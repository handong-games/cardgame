import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo, useRef } from 'react';
import type { CoinTossResult } from '../../types';
import { COIN_TOSS_PHYSICS, getScaledCoinPhysics } from '../../animations/coinAnimations';
import { useAnimSpeed } from '../../hooks/useAnimSpeed';
import sunCoinImg from '@assets/coins/coin-heads.png';
import moonCoinImg from '@assets/coins/coin-tails.png';

interface CoinTossAnimationProps {
  results: CoinTossResult[];
  pouchPosition: { x: number; y: number };
  animationAreaBounds: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  sunCountPosition: { x: number; y: number };
  moonCountPosition: { x: number; y: number };
  onCoinLand: (coinValue: number) => void;
  onComplete: () => void;
}

interface CoinTrajectory {
  id: number;
  targetX: number;
  targetY: number;
  peakY?: number;
  rotation: number;
  delay: number;
}

type CoinPhase = 'flying' | 'landed' | 'moving' | 'done';

interface CoinState {
  phase: CoinPhase;
  currentX: number;
  currentY: number;
}

function generateCoinTrajectory(
  index: number,
  pouchPos: { x: number; y: number },
  areaBounds: { left: number; top: number; width: number; height: number }
): CoinTrajectory {
  const startX = Math.max(0, pouchPos.x - areaBounds.left);
  const startY = Math.max(0, pouchPos.y - areaBounds.top);

  const baseAngle = -Math.PI / 2;
  const spreadAngle = (Math.PI / 3) * (Math.random() - 0.5);
  const finalAngle = baseAngle + spreadAngle;
  const distance = 150 + Math.random() * 100;

  let targetX = startX + Math.cos(finalAngle) * distance * 1.5;
  let targetY = startY - 80 + Math.random() * 60;

  const margin = 32;
  targetX = Math.max(margin, Math.min(areaBounds.width - margin, targetX));
  targetY = Math.max(margin, Math.min(areaBounds.height * 0.6, targetY));

  return {
    id: index,
    targetX,
    targetY,
    peakY: startY - distance,
    rotation: Math.random() * 1080,
    delay: index * COIN_TOSS_PHYSICS.COIN_STAGGER,
  };
}

export function CoinTossAnimation({
  results,
  pouchPosition,
  animationAreaBounds,
  sunCountPosition,
  moonCountPosition,
  onCoinLand,
  onComplete,
}: CoinTossAnimationProps) {
  const speedM = useAnimSpeed();
  const [isVisible, setIsVisible] = useState(false);
  const [coinStates, setCoinStates] = useState<Map<number, CoinState>>(new Map());
  const onCompleteRef = useRef(onComplete);
  const onCoinLandRef = useRef(onCoinLand);
  const hasStartedRef = useRef(false);
  const completedCoinsRef = useRef(new Set<number>());

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onCoinLandRef.current = onCoinLand;
  }, [onComplete, onCoinLand]);

  const trajectories = useMemo<CoinTrajectory[]>(() => {
    return results.map((_, index) =>
      generateCoinTrajectory(index, pouchPosition, animationAreaBounds)
    );
  }, [results, pouchPosition, animationAreaBounds]);

  useEffect(() => {
    if (results.length > 0 && !hasStartedRef.current) {
      hasStartedRef.current = true;
      completedCoinsRef.current = new Set();
      setIsVisible(true);

      const initialStates = new Map<number, CoinState>();
      results.forEach((_, index) => {
        initialStates.set(index, {
          phase: 'flying',
          currentX: pouchPosition.x - animationAreaBounds.left,
          currentY: pouchPosition.y - animationAreaBounds.top,
        });
      });
      setCoinStates(initialStates);
    } else if (results.length === 0) {
      hasStartedRef.current = false;
      completedCoinsRef.current = new Set();
    }
  }, [results, pouchPosition, animationAreaBounds]);

  const handleCoinLanded = (index: number, x: number, y: number) => {
    setCoinStates(prev => {
      const newStates = new Map(prev);
      newStates.set(index, { phase: 'landed', currentX: x, currentY: y });
      return newStates;
    });

    setTimeout(() => {
      setCoinStates(prev => {
        const newStates = new Map(prev);
        const state = newStates.get(index);
        if (state && state.phase === 'landed') {
          newStates.set(index, { ...state, phase: 'moving' });
        }
        return newStates;
      });
    }, 200 * speedM);
  };

  const handleCoinReachedCounter = (index: number, isHeads: boolean, denomination: number) => {
    if (completedCoinsRef.current.has(index)) return;
    completedCoinsRef.current.add(index);

    setCoinStates(prev => {
      const newStates = new Map(prev);
      newStates.set(index, { phase: 'done', currentX: 0, currentY: 0 });
      return newStates;
    });

    if (isHeads) {
      onCoinLandRef.current(denomination);
    }

    if (completedCoinsRef.current.size === results.length) {
      setTimeout(() => {
        setIsVisible(false);
        onCompleteRef.current();
        hasStartedRef.current = false;
      }, 100 * speedM);
    }
  };

  const getCounterPosition = (isHeads: boolean) => {
    const pos = isHeads ? sunCountPosition : moonCountPosition;
    return {
      x: pos.x - animationAreaBounds.left,
      y: pos.y - animationAreaBounds.top,
    };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute pointer-events-none z-10 inset-0">
          {results.map((result, index) => {
            const trajectory = trajectories[index];
            const coinState = coinStates.get(index);

            const startX = pouchPosition.x - animationAreaBounds.left;
            const startY = pouchPosition.y - animationAreaBounds.top;
            const peakY = trajectory.peakY ?? (startY - 150);
            const counterPos = getCounterPosition(result.isHeads);

            if (coinState?.phase === 'done') {
              return null;
            }

            if (coinState?.phase === 'moving') {
              return (
                <motion.div
                  key={`moving-${index}`}
                  className="absolute w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    boxShadow: result.isHeads
                      ? '0 0 12px rgba(255, 215, 0, 0.5)'
                      : '0 0 8px rgba(192, 192, 192, 0.3)',
                  }}
                  initial={{
                    x: coinState.currentX,
                    y: coinState.currentY,
                    scale: 1,
                    opacity: 1,
                  }}
                  animate={{
                    x: counterPos.x,
                    y: counterPos.y,
                    scale: 0.5,
                    opacity: 0.8,
                  }}
                  transition={{
                    duration: 0.4 * speedM,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  onAnimationComplete={() => {
                    handleCoinReachedCounter(index, result.isHeads, result.denomination);
                  }}
                >
                  <img
                    src={result.isHeads ? sunCoinImg : moonCoinImg}
                    alt={result.isHeads ? '앞면' : '뒷면'}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              );
            }

            return (
              <motion.div
                key={index}
                className="absolute w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  boxShadow: result.isHeads
                    ? '0 0 16px rgba(255, 215, 0, 0.6)'
                    : '0 0 10px rgba(192, 192, 192, 0.4)',
                }}
                initial={{
                  opacity: 0,
                  scale: 0.3,
                  x: startX,
                  y: startY,
                  rotateY: 0,
                  rotateX: 0,
                }}
                animate={{
                  x: [startX, startX + (trajectory.targetX - startX) * 0.3, trajectory.targetX],
                  y: [startY, peakY, trajectory.targetY],
                  scale: [0.3, 1.2, 1],
                  rotateY: [0, 360, trajectory.rotation],
                  rotateX: [0, 180, 360],
                  opacity: [0, 1, 1],
                }}
                transition={{
                  duration: COIN_TOSS_PHYSICS.FLIGHT_DURATION * 1.2 * speedM,
                  delay: trajectory.delay * speedM,
                  ease: [0.2, 0.8, 0.4, 1],
                  times: [0, 0.4, 1],
                }}
                onAnimationComplete={() => {
                  handleCoinLanded(index, trajectory.targetX, trajectory.targetY);
                }}
              >
                <img
                  src={result.isHeads ? sunCoinImg : moonCoinImg}
                  alt={result.isHeads ? '앞면' : '뒷면'}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
