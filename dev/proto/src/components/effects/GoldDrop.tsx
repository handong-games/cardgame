import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface GoldDropProps {
  amount: number;
  show: boolean;
  onComplete: () => void;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
}

// 획득량에 따른 동전 개수
function getCoinCount(amount: number): number {
  if (amount >= 41) return 5;
  if (amount >= 21) return 4;
  return 3;
}

export function GoldDrop({ amount, show, onComplete }: GoldDropProps) {
  const [isVisible, setIsVisible] = useState(false);

  // 동전 데이터 생성
  const coins = useMemo<Coin[]>(() => {
    const count = getCoinCount(amount);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 100,  // -50 ~ 50px
      y: Math.random() * 30 + 20,       // 20 ~ 50px 낙하
      rotation: (Math.random() - 0.5) * 360,
      delay: i * 0.05,
    }));
  }, [amount]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // 애니메이션 완료 후 콜백
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
          {/* 동전들 */}
          {coins.map((coin) => (
            <motion.div
              key={coin.id}
              className="absolute text-3xl"
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.5],
                x: [0, coin.x * 0.5, coin.x, coin.x * 0.8],
                y: [0, -40, coin.y, coin.y + 50],
                rotate: [0, coin.rotation],
              }}
              transition={{
                duration: 0.8,
                delay: coin.delay,
                ease: 'easeOut',
                times: [0, 0.3, 0.6, 1],
              }}
            >
              🪙
            </motion.div>
          ))}

          {/* 골드 텍스트 */}
          <motion.div
            className="absolute text-2xl font-bold text-yellow-400"
            style={{ textShadow: '0 0 10px rgba(234, 179, 8, 0.5)' }}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.3, 1, 0.8],
              y: [20, -20, -30, -50],
            }}
            transition={{
              duration: 1,
              ease: 'easeOut',
              times: [0, 0.2, 0.6, 1],
            }}
          >
            +{amount}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
