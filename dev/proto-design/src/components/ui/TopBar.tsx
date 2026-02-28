import { motion, AnimatePresence } from 'framer-motion';
import { AudioControl } from './AudioControl';
import type { Accessory } from '../../types';

interface TopBarProps {
  enemyName?: string;
  souls: number;
  soulPulse?: boolean;
  accessories?: Accessory[];
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export function TopBar({
  enemyName,
  souls,
  soulPulse = false,
  accessories = [],
  isMuted = false,
  onToggleMute,
}: TopBarProps) {
  return (
    <div className="w-full bg-gradient-to-r from-dark-surface/90 via-dark-charcoal/90 to-dark-surface/90 backdrop-blur-sm border-b border-dark-graphite/50 px-4 py-1.5 shadow-card-dark">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* 좌측: 장신구 */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <AnimatePresence>
            {accessories.map((accessory, index) => (
              <motion.div
                key={accessory.id}
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative group"
                title={`${accessory.name}: ${accessory.description}`}
              >
                <div className="w-7 h-7 rounded-full bg-dark-deep border border-dark-graphite flex items-center justify-center shadow-card-dark">
                  <span className="text-sm cursor-help">{accessory.emoji}</span>
                </div>
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50">
                   <div className="bg-dark-charcoal border border-dark-graphite rounded-lg px-3 py-2 whitespace-nowrap shadow-card-dark">
                    <p className="text-coin-gold text-xs font-bold">{accessory.name}</p>
                    <p className="text-gray-300 text-xs">{accessory.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {accessories.length === 0 && (
            <span className="text-gray-600 text-xs">🎒</span>
          )}
        </div>

        {/* 중앙 좌: 적 이름 */}
        {enemyName && (
          <div className="flex items-center gap-1.5 px-3 py-0.5 bg-dark-deep/60 rounded-full border border-dark-graphite/50">
            <span className="text-sm">⚔️</span>
            <span className="text-gray-200 font-medium text-sm">{enemyName}</span>
          </div>
        )}

        {/* 우측: 영혼 + 오디오 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.div
            className="flex items-center gap-1.5 px-2.5 py-0.5 bg-dark-deep/60 rounded-full border border-dark-graphite/50"
            animate={soulPulse ? {
              scale: [1, 1.2, 1],
              boxShadow: ['0 0 0 rgba(192,192,192,0)', '0 0 20px rgba(192,192,192,0.5)', '0 0 0 rgba(192,192,192,0)'],
              transition: { duration: 0.3 }
            } : {}}
          >
            <span className="text-sm">👻</span>
            <span className="text-gray-200 font-bold text-sm">{souls}</span>
          </motion.div>
          {onToggleMute && (
            <AudioControl isMuted={isMuted} onToggleMute={onToggleMute} />
          )}
        </div>
      </div>
    </div>
  );
}
