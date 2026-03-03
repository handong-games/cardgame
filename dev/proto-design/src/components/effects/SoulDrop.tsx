import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import soulIcon from '@assets/icons/icon-soul.png';

interface Position {
  x: number;
  y: number;
}

interface SoulDropProps {
  amount: number;
  show: boolean;
  startPosition: Position;
  targetPosition: Position;
  onComplete: () => void;
}

interface Soul {
  id: number;
  offsetX: number;
  offsetY: number;
  arcOffsetX: number;
  arcHeight: number;
  delay: number;
}

function getSoulCount(amount: number): number {
  if (amount >= 41) return 5;
  if (amount >= 21) return 4;
  return 3;
}

const DELAY_PER_SOUL = 0.08;
const FLIGHT_DURATION = 0.7;
const TEXT_DURATION = 0.8;

export function SoulDrop({ amount, show, startPosition, targetPosition, onComplete }: SoulDropProps) {
  const [isVisible, setIsVisible] = useState(false);

  const souls = useMemo<Soul[]>(() => {
    const count = getSoulCount(amount);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      offsetX: (Math.random() - 0.5) * 60,
      offsetY: (Math.random() - 0.5) * 40,
      arcOffsetX: (Math.random() - 0.5) * 80,
      arcHeight: Math.random() * 60 + 80,
      delay: i * DELAY_PER_SOUL,
    }));
  }, [amount]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const count = getSoulCount(amount);
      const totalDuration = (count - 1) * DELAY_PER_SOUL + FLIGHT_DURATION + 0.15;
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, totalDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete, amount]);

  const dx = targetPosition.x - startPosition.x;
  const dy = targetPosition.y - startPosition.y;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 60 }}>
          {souls.map((soul) => {
            const midX = dx * 0.4 + soul.arcOffsetX;
            const midY = dy * 0.3 - soul.arcHeight;

            return (
              <motion.div
                key={soul.id}
                className="absolute"
                style={{ left: startPosition.x, top: startPosition.y }}
                initial={{ x: soul.offsetX, y: soul.offsetY, opacity: 0, scale: 0 }}
                animate={{
                  x: [soul.offsetX, midX, dx],
                  y: [soul.offsetY, midY, dy],
                  opacity: [0, 1, 1, 0.9],
                  scale: [0, 1.3, 1, 0.4],
                }}
                transition={{
                  duration: FLIGHT_DURATION,
                  delay: soul.delay,
                  ease: [0.25, 0.1, 0.25, 1],
                  times: [0, 0.25, 0.7, 1],
                }}
              >
                <img
                  src={soulIcon}
                  alt=""
                  className="w-7 h-7 object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(192,192,252,0.7)) drop-shadow(0 0 12px rgba(192,132,252,0.4))',
                  }}
                />
              </motion.div>
            );
          })}

          <motion.div
            className="absolute text-xl font-bold text-purple-400"
            style={{
              left: startPosition.x,
              top: startPosition.y,
              textShadow: '0 0 10px rgba(192, 132, 252, 0.6)',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8],
              y: [10, -15, -25, -45],
            }}
            transition={{
              duration: TEXT_DURATION,
              ease: 'easeOut',
              times: [0, 0.2, 0.5, 1],
            }}
          >
            +{amount} 영혼
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
