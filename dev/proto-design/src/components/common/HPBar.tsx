import { motion, AnimatePresence } from 'framer-motion';

interface HPBarProps {
  current: number;
  max: number;
  showText?: boolean;
  color?: 'red' | 'green';
  previewDamage?: number;
  previewHeal?: number;
  previewSelfDamage?: number;
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

  const totalDamage = previewDamage + previewSelfDamage;
  const afterDamageHp = Math.max(0, current - totalDamage);
  const afterDamagePercentage = Math.max(0, Math.min(100, (afterDamageHp / max) * 100));

  const afterHealHp = Math.min(max, current + previewHeal);
  const afterHealPercentage = Math.max(0, Math.min(100, (afterHealHp / max) * 100));

  const damagePreviewPercentage = hpPercentage - afterDamagePercentage;
  const healPreviewPercentage = afterHealPercentage - hpPercentage;

  const barColors = {
    red: 'bg-gradient-to-r from-effect-attack to-red-400',
    green: 'bg-gradient-to-r from-effect-buff to-emerald-400',
  };

  const getFinalHp = () => {
    if (totalDamage > 0) return afterDamageHp;
    if (previewHeal > 0) return afterHealHp;
    return current;
  };

  return (
    <div className="w-full relative">
      <AnimatePresence>
        {previewDamage > 0 && (
          <motion.div
            key="preview-damage"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-effect-attack font-bold text-sm text-shadow-sm"
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
            className={`absolute -top-6 font-bold text-sm text-red-500 ${
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
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-effect-heal font-bold text-sm text-shadow-sm"
          >
            +{previewHeal}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hp-bar-container relative h-6">
        <div
          className={`absolute h-full ${barColors[color]} transition-all duration-300`}
          style={{ width: `${totalDamage > 0 ? afterDamagePercentage : hpPercentage}%` }}
        />

        {totalDamage > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className={`absolute h-full ${previewSelfDamage > 0 ? 'bg-red-500' : 'bg-effect-attack'}`}
            style={{
              left: `${afterDamagePercentage}%`,
              width: `${damagePreviewPercentage}%`,
            }}
          />
        )}

        {previewHeal > 0 && healPreviewPercentage > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute h-full bg-effect-heal"
            style={{
              left: `${hpPercentage}%`,
              width: `${healPreviewPercentage}%`,
            }}
          />
        )}

        {showText && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold drop-shadow-md">
            {getFinalHp()} / {max}
          </div>
        )}
      </div>
    </div>
  );
}
