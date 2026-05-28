import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameButton } from '../ui/GameButton';
import { CLASS_NAMES, CLASS_ICONS, CLASS_COLORS } from '../../utils/advancementSystem';
import { ADVANCEMENT_DEFINITIONS } from '../../data/advancement';
import { SKILL_IMAGES } from '../../data/skillImages';
import skillFrameDefaultImg from '@assets/frames/skill-frame.png';
import skillFrameAttackImg from '@assets/frames/skill-frame-attack.png';
import skillFrameDefenseImg from '@assets/frames/skill-frame-defense.png';
import skillFrameBuffImg from '@assets/frames/skill-frame-buff.png';
import type { CharacterClass, Skill } from '../../types';

function getRewardSkillFrameImage(skill: Skill): string {
  const allEffects = [
    ...skill.effects,
    ...(skill.conditionalEffects?.map((entry) => entry.effect) ?? []),
  ];

  const hasDamage = allEffects.some((effect) => effect.type === 'damage');
  const hasBlock = allEffects.some((effect) => effect.type === 'block');
  const hasSupport = allEffects.some((effect) => ['heal', 'apply_buff', 'apply_debuff', 'coin_gain', 'evasion', 'reflection', 'combo_stack', 'charge_stack'].includes(effect.type));

  if (hasDamage) return skillFrameAttackImg;
  if (hasBlock) return skillFrameDefenseImg;
  if (hasSupport) return skillFrameBuffImg;
  return skillFrameDefaultImg;
}

// 스킬 보상 카드 컴포넌트
function SkillRewardCard({
  skill,
  index,
  isHovered,
  onSelect,
  onHover,
}: {
  skill: Skill;
  index: number;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const skillImage = SKILL_IMAGES[skill.skillKey];
  const frameImage = getRewardSkillFrameImage(skill);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={{ opacity: 1, y: isHovered ? -12 : 0, scale: isHovered ? 1.08 : 1 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="cursor-pointer"
    >
      <div className="flex w-40 flex-col items-center">
        <div className="relative h-36 w-32 drop-shadow-[0_12px_18px_rgba(20,14,18,0.28)]">
          <img src={frameImage} alt="스킬 프레임" className="absolute inset-0 h-full w-full rounded-xl object-contain" />
          {skillImage ? (
            <img src={skillImage} alt={skill.name} className="absolute inset-0 m-auto h-3/4 w-3/4 object-contain" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-4xl">{skill.icon}</span>
          )}
          <div className="absolute -right-2 -top-2 flex flex-col items-end gap-1">
            {(skill.headsCost ?? 0) > 0 && (
              <div className="rounded-full border border-[#C9A86C]/80 bg-[#F5E6B8] px-2 py-0.5 text-xs font-extrabold text-[#7A5610] shadow-sm">
                ☀ {skill.headsCost}
              </div>
            )}
            {(skill.tailsCost ?? 0) > 0 && (
              <div className="rounded-full border border-[#6A5080]/50 bg-[#E6DFF2] px-2 py-0.5 text-xs font-extrabold text-[#4F4369] shadow-sm">
                ☾ {skill.tailsCost}
              </div>
            )}
          </div>
          {skill.maxUsePerTurn > 0 && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded border border-[#3A3040]/50 bg-[#3A3040]/82 px-2 py-0.5 text-xs font-bold text-[#F0E8D8]">
              0/{skill.maxUsePerTurn}
            </div>
          )}
        </div>
        <div className="mt-3 rounded-xl border border-[#F0E8D8]/12 bg-[#1B1620]/72 px-3 py-2 text-center shadow-[0_8px_18px_rgba(20,14,18,0.2)]">
          <div className="text-sm font-bold text-[#F0E8D8]">{skill.name}</div>
          <div className="mt-1 line-clamp-2 text-xs leading-5 text-[#F0E8D8]/62">{skill.description}</div>
        </div>
      </div>
    </motion.div>
  );
}

export function RewardScreen() {
  const { player, reward, battle, selectRewardSkill, skipReward, confirmAdvancement, selectAdvancement } = useGameStore();
  const [hoveredSkillIndex, setHoveredSkillIndex] = useState<number | null>(null);
  const [pendingSkill, setPendingSkill] = useState<Skill | null>(null);

  if (!reward) return null;

  const isClassAdvancement = battle.phase === 'class_advancement';
  const hasAdvancementOptions = reward.advancementOptions && reward.advancementOptions.length > 0;
  const targetClass = reward.targetAdvancement;

  const handleSkillSelect = (skillId: string) => {
    if (isClassAdvancement) {
      confirmAdvancement(skillId);
      return;
    }

    const selectedSkill = reward.skills.find(skill => skill.id === skillId);
    if (!selectedSkill) return;

    if (player.skills.length >= player.maxSkillSlots) {
      setPendingSkill(selectedSkill);
      return;
    }

    selectRewardSkill(skillId);
  };

  const handleAdvancementSelect = (targetClass: CharacterClass) => {
    selectAdvancement(targetClass);
  };

  // 다중 전직 선택 화면
  if (isClassAdvancement && hasAdvancementOptions) {
    return (
      <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            전직 선택!
          </h1>
          <p className="text-xl text-yellow-200">
            여러 전직 조건을 충족했습니다
          </p>
          <p className="text-gray-400 mt-2">
            원하는 클래스를 선택하세요
          </p>
        </motion.div>

        {/* 전직 선택지 */}
        <div className="flex gap-6 mb-8">
          {reward.advancementOptions!.map((classId, index) => {
            const definition = ADVANCEMENT_DEFINITIONS[classId];
            return (
              <motion.div
                key={classId}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAdvancementSelect(classId)}
                className="cursor-pointer"
              >
                <div
                  className="w-48 p-6 rounded-xl border-2 hover:scale-105 transition-transform"
                  style={{
                    borderColor: CLASS_COLORS[classId],
                    backgroundColor: `${CLASS_COLORS[classId]}20`,
                  }}
                >
                  <div className="text-center">
                    <span className="text-4xl">{CLASS_ICONS[classId]}</span>
                    <h3
                      className="text-xl font-bold mt-2"
                      style={{ color: CLASS_COLORS[classId] }}
                    >
                      {CLASS_NAMES[classId]}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">
                      {definition.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-3 italic">
                      {definition.auraDescription}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 z-[70] flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <div className="absolute inset-0 bg-[#1B1620]/12 backdrop-blur-[1px]" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.34, ease: 'easeOut' }}
        className="relative max-w-4xl rounded-[28px] border border-[#F0E8D8]/18 bg-[#1B1620]/82 px-8 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.36)] backdrop-blur-md"
      >
      {/* 제목 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        {isClassAdvancement && targetClass ? (
          <>
            <h1 className="text-4xl font-bold mb-2" style={{ color: CLASS_COLORS[targetClass] }}>
              {CLASS_ICONS[targetClass]} 전직!
            </h1>
            <p className="text-xl" style={{ color: CLASS_COLORS[targetClass] }}>
              {CLASS_NAMES[targetClass]}(으)로 각성합니다
            </p>
            <p className="text-gray-400 mt-2">
              보너스 스킬을 선택하세요
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-green-400 mb-2">
              승리 보상
            </h1>
            <p className="text-gray-300">
              영혼을 획득했습니다. 추가로 스킬 하나를 선택할 수 있습니다.
            </p>
            <p className="mt-2 text-sm text-[#F0E8D8]/58">
              스킬 슬롯 {player.skills.length}/{player.maxSkillSlots}
            </p>
          </>
        )}
      </motion.div>

      {/* 스킬 선택지 */}
      {reward.skills.length > 0 ? (
        <div className="mb-7 flex justify-center gap-7">
          {reward.skills.map((skill, index) => (
            <SkillRewardCard
              key={skill.id}
              skill={skill}
              index={index}
              isHovered={hoveredSkillIndex === index}
              onSelect={() => handleSkillSelect(skill.id)}
              onHover={(hovered) => setHoveredSkillIndex(hovered ? index : null)}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 rounded-2xl border border-[#F0E8D8]/12 bg-[#F0E8D8]/8 px-8 py-6 text-center text-[#F0E8D8]/72"
        >
          새로 배울 수 있는 스킬이 없습니다.
        </motion.div>
      )}

      {pendingSkill && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-7 w-full max-w-3xl rounded-2xl border border-[#D8C8E8]/28 bg-[#1B1620]/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.34)]"
        >
          <div className="mb-4 text-center">
            <div className="text-lg font-bold text-[#F0E8D8]">스킬 슬롯이 가득 찼습니다</div>
            <div className="mt-1 text-sm text-[#F0E8D8]/62">
              <span className="text-[#C9A86C]">{pendingSkill.name}</span>을(를) 얻으려면 교체할 스킬을 선택하세요.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {player.skills.map((ownedSkill) => (
              <button
                key={ownedSkill.id}
                type="button"
                onClick={() => selectRewardSkill(pendingSkill.id, ownedSkill.id)}
                className="rounded-xl border border-[#F0E8D8]/14 bg-[#F0E8D8]/8 p-3 text-center transition hover:border-[#D8C8E8]/60 hover:bg-[#D8C8E8]/14"
              >
                <div className="relative mx-auto mb-2 h-20 w-16">
                  <img src={getRewardSkillFrameImage(ownedSkill)} alt="스킬 프레임" className="absolute inset-0 h-full w-full object-contain" />
                  {SKILL_IMAGES[ownedSkill.skillKey] ? (
                    <img src={SKILL_IMAGES[ownedSkill.skillKey]} alt={ownedSkill.name} className="absolute inset-0 m-auto h-3/4 w-3/4 object-contain" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">{ownedSkill.icon}</span>
                  )}
                </div>
                <div className="text-sm font-bold text-[#F0E8D8]">{ownedSkill.name}</div>
                <div className="mt-1 line-clamp-2 text-xs text-[#F0E8D8]/56">{ownedSkill.description}</div>
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <GameButton variant="secondary" size="sm" onClick={() => setPendingSkill(null)}>교체 취소</GameButton>
          </div>
        </motion.div>
      )}

      {/* 스킵 버튼 (전직 보상이 아닐 때만) */}
      {!isClassAdvancement && (
        <GameButton
          variant="secondary"
          size="sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={skipReward}
        >
          건너뛰기
        </GameButton>
      )}

      {/* 전직 안내 (전직 화면일 때) */}
      {isClassAdvancement && targetClass && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center text-sm text-gray-500"
        >
          <p>{CLASS_NAMES[targetClass]} 전직 조건을 달성했습니다!</p>
          <p>선택한 스킬이 추가됩니다.</p>
        </motion.div>
      )}
      </motion.div>
    </motion.div>
  );
}
