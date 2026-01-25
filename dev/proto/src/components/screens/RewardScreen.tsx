import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { CLASS_NAMES, CLASS_ICONS, CLASS_COLORS } from '../../utils/advancementSystem';
import { ADVANCEMENT_DEFINITIONS } from '../../data/advancement';
import type { CharacterClass, Skill } from '../../types';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: -10 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`
        cursor-pointer transform transition-all duration-200
        ${isHovered ? 'scale-110 -translate-y-4' : ''}
      `}
    >
      <div className="w-40 rounded-xl border-2 bg-gray-800 overflow-hidden border-amber-500 hover:border-amber-400 shadow-lg">
        {/* 스킬 이름 헤더 */}
        <div className="py-3 text-center font-bold border-b border-gray-700 bg-gray-750 text-amber-400">
          {skill.name}
        </div>

        {/* 스킬 아이콘 */}
        <div className="flex items-center justify-center py-8 text-6xl bg-gray-850">
          {skill.icon}
        </div>

        {/* 스킬 정보 */}
        <div className="px-3 py-3 border-t border-gray-700 bg-gray-800">
          {/* 비용 */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">비용</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 font-bold">{skill.coinCost}</span>
              <span className="text-sm">🪙</span>
            </div>
          </div>

          {/* 사용 제한 */}
          {skill.maxUsePerTurn > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">턴당 제한</span>
              <span className="text-blue-400 text-sm">{skill.maxUsePerTurn}회</span>
            </div>
          )}

          {/* 쿨다운 */}
          {skill.cooldown && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">쿨다운</span>
              <span className="text-purple-400 text-sm">{skill.cooldown}턴</span>
            </div>
          )}

          {/* 설명 */}
          <div className="text-center text-sm text-gray-300 mt-2 pt-2 border-t border-gray-700">
            {skill.description}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function RewardScreen() {
  const { reward, battle, selectRewardSkill, skipReward, confirmAdvancement, selectAdvancement } = useGameStore();
  const [hoveredSkillIndex, setHoveredSkillIndex] = useState<number | null>(null);

  if (!reward) return null;

  const isClassAdvancement = battle.phase === 'class_advancement';
  const hasAdvancementOptions = reward.advancementOptions && reward.advancementOptions.length > 0;
  const targetClass = reward.targetAdvancement;

  const handleSkillSelect = (skillId: string) => {
    if (isClassAdvancement) {
      confirmAdvancement(skillId);
    } else {
      selectRewardSkill(skillId);
    }
  };

  const handleAdvancementSelect = (targetClass: CharacterClass) => {
    selectAdvancement(targetClass);
  };

  // 다중 전직 선택 화면
  if (isClassAdvancement && hasAdvancementOptions) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      {/* 제목 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
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
              승리!
            </h1>
            <p className="text-gray-400">
              보상 스킬을 선택하세요
            </p>
          </>
        )}
      </motion.div>

      {/* 스킬 선택지 */}
      <div className="flex gap-8 mb-8">
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

      {/* 스킵 버튼 (전직 보상이 아닐 때만) */}
      {!isClassAdvancement && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={skipReward}
          className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
        >
          건너뛰기
        </motion.button>
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
    </div>
  );
}
