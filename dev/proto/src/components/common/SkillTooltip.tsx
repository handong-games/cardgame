import { motion } from 'framer-motion';
import type { Skill, SkillState, PreviewEffects } from '../../types';
import { getSkillCosts } from '../../utils/skillSystem';

interface SkillTooltipProps {
  skill: Skill;
  skillState?: SkillState;
  previewEffects?: PreviewEffects;
  canAfford: boolean;
}

// 효과 타입별 아이콘
const EFFECT_ICONS = {
  damage: '⚔️',
  block: '🛡️',
  heal: '💚',
  selfDamage: '💔',
  coin_gain: '🪙',
  apply_buff: '✨',
};

export function SkillTooltip({
  skill,
  skillState,
  previewEffects,
}: SkillTooltipProps) {
  // 스킬 비용 계산
  const costs = getSkillCosts(skill);

  // 쿨다운 상태
  const isOnCooldown = skillState && skillState.cooldownRemaining > 0;

  // 조건 충족 여부
  const hasConditionsMet = previewEffects && previewEffects.conditionsMet.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
    >
      <div className="bg-gray-900 border border-gray-600 rounded-lg shadow-lg p-3 min-w-[200px] max-w-[280px]">
        {/* 스킬 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{skill.icon}</span>
            <span className="text-white font-bold">{skill.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {costs.heads > 0 && (
              <div className="px-2 py-0.5 rounded text-sm font-bold bg-amber-500 text-black">
                ↑ {costs.heads}
              </div>
            )}
            {costs.tails > 0 && (
              <div className="px-2 py-0.5 rounded text-sm font-bold bg-blue-500 text-white">
                ↓ {costs.tails}
              </div>
            )}
          </div>
        </div>

        {/* 효과 목록 */}
        <div className="space-y-1 mb-2">
          {/* 데미지 */}
          {previewEffects && previewEffects.damage > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span>{EFFECT_ICONS.damage}</span>
              <span className="text-orange-400">
                적에게 {previewEffects.damage} 데미지
              </span>
            </div>
          )}

          {/* 블록 */}
          {previewEffects && previewEffects.block > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span>{EFFECT_ICONS.block}</span>
              <span className="text-cyan-400">
                방어력 +{previewEffects.block}
              </span>
            </div>
          )}

          {/* 힐 */}
          {previewEffects && previewEffects.heal > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span>{EFFECT_ICONS.heal}</span>
              <span className="text-green-400">
                HP +{previewEffects.heal} 회복
              </span>
            </div>
          )}

          {/* 자해 데미지 */}
          {previewEffects && previewEffects.selfDamage > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span>{EFFECT_ICONS.selfDamage}</span>
              <span className="text-red-400">
                자신에게 {previewEffects.selfDamage} 데미지
              </span>
            </div>
          )}

          {/* 코인 획득 */}
          {previewEffects && previewEffects.coinsGained > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span>{EFFECT_ICONS.coin_gain}</span>
              <span className="text-yellow-400">
                코인 +{previewEffects.coinsGained}
              </span>
            </div>
          )}

          {/* 버프 */}
          {previewEffects && previewEffects.buffs.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span>{EFFECT_ICONS.apply_buff}</span>
              <span className="text-purple-400">
                버프 적용
              </span>
            </div>
          )}
        </div>

        {/* 조건부 효과 강조 */}
        {hasConditionsMet && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded px-2 py-1 mb-2">
            <span className="text-yellow-400 text-xs font-bold">
              ✨ 조건 충족: 추가 효과 발동!
            </span>
          </div>
        )}

        {/* 설명 */}
        <p className="text-gray-300 text-xs leading-relaxed border-t border-gray-700 pt-2">
          {skill.description}
        </p>

        {/* 제한 사항 - 쿨다운만 표시 */}
        {isOnCooldown && (
          <div className="mt-2 pt-2 border-t border-gray-700 text-xs">
            <div className="text-blue-400">
              ⏱️ 쿨다운: {skillState!.cooldownRemaining}턴
            </div>
          </div>
        )}
      </div>

      {/* 화살표 */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-l border-t border-gray-600 rotate-45" />
    </motion.div>
  );
}
