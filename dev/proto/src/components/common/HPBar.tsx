import { motion, AnimatePresence } from 'framer-motion';

interface HPBarProps {
  current: number;
  max: number;
  showText?: boolean;
  color?: 'red' | 'green';
  previewDamage?: number;     // 예상 데미지 (프리뷰용)
  previewHeal?: number;       // 예상 힐 (프리뷰용)
  previewSelfDamage?: number; // 예상 자해 데미지 (프리뷰용)
}

export function HPBar({
  current,
  max,
  showText = true,
  color = 'red',
  previewDamage = 0,
  previewHeal = 0,
  previewSelfDamage = 0,
}: HPBarProps) {
  const hpPercentage = Math.max(0, Math.min(100, (current / max) * 100));

  // 프리뷰 후 남을 HP 계산 (데미지 + 자해)
  const totalDamage = previewDamage + previewSelfDamage;
  const afterDamageHp = Math.max(0, current - totalDamage);
  const afterDamagePercentage = Math.max(0, Math.min(100, (afterDamageHp / max) * 100));

  // 프리뷰 힐 후 HP 계산
  const afterHealHp = Math.min(max, current + previewHeal);
  const afterHealPercentage = Math.max(0, Math.min(100, (afterHealHp / max) * 100));

  // 프리뷰 데미지 영역 (깎일 부분)
  const damagePreviewPercentage = hpPercentage - afterDamagePercentage;

  // 프리뷰 힐 영역 (회복될 부분)
  const healPreviewPercentage = afterHealPercentage - hpPercentage;

  const barColors = {
    red: 'bg-red-500',
    green: 'bg-green-500',
  };

  // 최종 HP 표시값 계산
  const getFinalHp = () => {
    if (totalDamage > 0) return afterDamageHp;
    if (previewHeal > 0) return afterHealHp;
    return current;
  };

  return (
    <div className="w-full relative">
      {/* 데미지/자해 숫자 표시 */}
      <AnimatePresence>
        {previewDamage > 0 && (
          <motion.div
            key="preview-damage"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-orange-400 font-bold text-sm"
          >
            -{previewDamage}
          </motion.div>
        )}
        {previewSelfDamage > 0 && (
          <motion.div
            key="preview-self-damage"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`absolute -top-6 font-bold text-sm text-red-400 ${
              previewDamage > 0 ? 'left-1/4 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'
            }`}
          >
            -{previewSelfDamage}💔
          </motion.div>
        )}
        {previewHeal > 0 && (
          <motion.div
            key="preview-heal"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-green-400 font-bold text-sm"
          >
            +{previewHeal}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-6 bg-gray-700 rounded-sm overflow-hidden">
        {/* 기본 HP (데미지 프리뷰 시 줄어든 상태) */}
        <div
          className={`absolute h-full ${barColors[color]} transition-all duration-300`}
          style={{ width: `${totalDamage > 0 ? afterDamagePercentage : hpPercentage}%` }}
        />

        {/* 프리뷰 데미지/자해 영역 (주황색/빨간색) */}
        {totalDamage > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className={`absolute h-full ${previewSelfDamage > 0 ? 'bg-red-500' : 'bg-orange-500'}`}
            style={{
              left: `${afterDamagePercentage}%`,
              width: `${damagePreviewPercentage}%`,
            }}
          />
        )}

        {/* 프리뷰 힐 영역 (녹색) */}
        {previewHeal > 0 && healPreviewPercentage > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute h-full bg-green-400"
            style={{
              left: `${hpPercentage}%`,
              width: `${healPreviewPercentage}%`,
            }}
          />
        )}

        {/* HP 텍스트 */}
        {showText && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold drop-shadow-md">
            {getFinalHp()} / {max}
          </div>
        )}
      </div>
    </div>
  );
}
