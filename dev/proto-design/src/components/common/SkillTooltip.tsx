import { motion } from 'framer-motion';
import type { Skill, SkillState, PreviewEffects } from '../../types';
import { getSkillCosts } from '../../utils/skillSystem';
import sunCoinImg from '@assets/coins/sun-coin.png';
import moonCoinImg from '@assets/coins/moon-coin.png';

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
  const costs = getSkillCosts(skill);
  const isOnCooldown = skillState && skillState.cooldownRemaining > 0;
  const hasConditionsMet = previewEffects && previewEffects.conditionsMet.length > 0;
  const costEntries = [
    costs.heads > 0 ? { key: 'heads', amount: costs.heads, label: '해 코인', icon: sunCoinImg, textColor: '#7A5610', bgColor: 'rgba(255,246,214,0.96)', borderColor: 'rgba(201,168,108,0.56)' } : null,
    costs.tails > 0 ? { key: 'tails', amount: costs.tails, label: '달 코인', icon: moonCoinImg, textColor: '#6A5080', bgColor: 'rgba(225,220,245,0.92)', borderColor: 'rgba(106,80,128,0.28)' } : null,
  ].filter(Boolean) as Array<{ key: string; amount: number; label: string; icon: string; textColor: string; bgColor: string; borderColor: string }>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
    >
      <div className="bg-gray-900 border border-gray-600 rounded-lg shadow-lg p-3 min-w-[200px] max-w-[280px]">
        {/* 스킬 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{skill.icon}</span>
            <span className="text-white font-bold">{skill.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {costEntries.map((cost) => (
              <div
                key={cost.key}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-sm font-bold border"
                style={{
                  backgroundColor: cost.bgColor,
                  borderColor: cost.borderColor,
                  color: cost.textColor,
                  boxShadow: cost.key === 'heads' ? '0 4px 10px rgba(201,168,108,0.16)' : '0 4px 10px rgba(106,80,128,0.14)',
                }}
                title={cost.label}
              >
                <img src={cost.icon} alt={cost.label} className="w-4 h-4 object-contain" />
                <span>{cost.amount}</span>
              </div>
            ))}
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
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-r border-b border-gray-600 rotate-45" />
    </motion.div>
  );
}
