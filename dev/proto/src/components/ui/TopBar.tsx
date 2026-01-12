import { motion, AnimatePresence } from 'framer-motion';
import type { Accessory } from '../../types';

interface TopBarProps {
  enemyName?: string;
  gold: number;
  goldPulse?: boolean;  // 골드 획득 시 펄스 효과
  accessories?: Accessory[];  // 획득한 장신구들
}

export function TopBar({
  enemyName,
  gold,
  goldPulse = false,
  accessories = [],
}: TopBarProps) {
  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 px-4 py-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* 왼쪽: 장신구 */}
        <div className="flex items-center gap-2">
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
                <span className="text-xl cursor-help">{accessory.emoji}</span>
                {/* 툴팁 */}
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50">
                  <div className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 whitespace-nowrap shadow-lg">
                    <p className="text-yellow-400 text-xs font-bold">{accessory.name}</p>
                    <p className="text-gray-300 text-xs">{accessory.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {accessories.length === 0 && (
            <span className="text-gray-600 text-sm">장신구 없음</span>
          )}
        </div>

        {/* 중앙: 현재 적 */}
        {enemyName && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">👾</span>
            <span className="text-purple-400 font-medium">{enemyName}</span>
          </div>
        )}

        {/* 오른쪽: 골드 */}
        <motion.div
          className="flex items-center gap-2"
          animate={goldPulse ? {
            scale: [1, 1.2, 1],
            transition: { duration: 0.3 }
          } : {}}
        >
          <span className="text-2xl">💰</span>
          <span className="text-yellow-400 font-bold text-lg">{gold}</span>
        </motion.div>
      </div>
    </div>
  );
}
