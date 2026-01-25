import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo, useRef } from 'react';
import type { CoinTossResult } from '../../types';
import { COIN_TOSS_PHYSICS } from '../../animations/coinAnimations';
import { COIN_DEFINITIONS } from '../../data/coins';

interface CoinTossAnimationProps {
  results: CoinTossResult[];
  buttonPosition: { x: number; y: number };
  animationAreaBounds: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  onCoinLand: (coinValue: number) => void;
  onComplete: () => void;
}

interface CoinTrajectory {
  id: number;
  targetX: number;
  targetY: number;
  rotation: number;
  delay: number;
}

// 동전 궤적 생성 (버튼에서 중앙 영역으로 산탄, 경계 제약 적용)
function generateCoinTrajectory(
  index: number,
  buttonPos: { x: number; y: number },
  areaBounds: { left: number; top: number; width: number; height: number }
): CoinTrajectory {
  // 버튼 위치를 애니메이션 영역 기준 상대 좌표로 변환
  const buttonRelativeX = Math.max(0, buttonPos.x - areaBounds.left);
  const buttonRelativeY = Math.max(0, buttonPos.y - areaBounds.top);

  // 애니메이션 영역 중앙 계산
  const centerX = areaBounds.width / 2;
  const centerY = areaBounds.height / 2;

  // 버튼에서 중앙으로의 방향 벡터
  const directionX = centerX - buttonRelativeX;
  const directionY = centerY - buttonRelativeY;

  // 산탄 범위: 중앙 방향 ± 90도 (반원 형태로 넓게 퍼짐)
  const baseAngle = Math.atan2(directionY, directionX);
  const spreadAngle = (Math.PI / 2) * (Math.random() - 0.5); // ±90도
  const finalAngle = baseAngle + spreadAngle;

  // 거리: 영역 너비의 40-70% (코인 영역 대부분을 커버)
  const minDistance = areaBounds.width * 0.4;
  const maxDistance = areaBounds.width * 0.7;
  const distance = minDistance + Math.random() * (maxDistance - minDistance);

  // 최종 목표 위치 계산
  let targetX = buttonRelativeX + Math.cos(finalAngle) * distance;
  let targetY = buttonRelativeY + Math.sin(finalAngle) * distance;

  // 경계 제약 (영역 내부로 제한)
  const margin = 32; // 동전 크기의 절반 (w-8 = 32px)
  targetX = Math.max(margin, Math.min(areaBounds.width - margin, targetX));
  targetY = Math.max(margin, Math.min(areaBounds.height - margin, targetY));

  return {
    id: index,
    targetX,
    targetY,
    rotation: Math.random() * 720,
    delay: index * COIN_TOSS_PHYSICS.COIN_STAGGER,
  };
}

export function CoinTossAnimation({
  results,
  buttonPosition,
  animationAreaBounds,
  onCoinLand,
  onComplete,
}: CoinTossAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  // onComplete 콜백을 ref로 관리하여 참조 안정성 확보
  const onCompleteRef = useRef(onComplete);

  // 애니메이션 실행 플래그 (Strict Mode 이중 실행 방지)
  const hasStartedRef = useRef(false);

  // onComplete가 변경되면 ref 업데이트 (useEffect 재실행 방지)
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 동전 궤적 데이터 생성
  const trajectories = useMemo<CoinTrajectory[]>(() => {
    return results.map((_, index) =>
      generateCoinTrajectory(index, buttonPosition, animationAreaBounds)
    );
  }, [results, buttonPosition, animationAreaBounds]);

  useEffect(() => {
    // 이미 실행 중이면 무시 (Strict Mode 이중 실행 방지)
    if (results.length > 0 && !hasStartedRef.current) {
      hasStartedRef.current = true;  // 실행 플래그 설정
      setIsVisible(true);

      // 전체 애니메이션 완료 후 콜백
      const timer = setTimeout(() => {
        setIsVisible(false);
        onCompleteRef.current();  // ref를 통해 콜백 호출
        hasStartedRef.current = false;  // 완료 후 플래그 초기화
      }, COIN_TOSS_PHYSICS.TOTAL_DURATION * 1000);

      return () => {
        clearTimeout(timer);
        // cleanup 시에는 플래그 초기화 안 함 (Strict Mode 재실행 감지용)
      };
    } else if (results.length === 0) {
      // results가 빈 배열이 되면 플래그 초기화 (다음 토스 준비)
      hasStartedRef.current = false;
    }
  }, [results]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="absolute pointer-events-none z-10 inset-0"
          style={{
            width: animationAreaBounds.width,
            height: animationAreaBounds.height,
          }}
        >
          {/* 동전들 */}
          {results.map((result, index) => {
            const trajectory = trajectories[index];
            const coin = COIN_DEFINITIONS[result.coinId];

            // 버튼의 상대 위치 계산 (애니메이션 영역 기준)
            const startX = buttonPosition.x - animationAreaBounds.left;
            const startY = buttonPosition.y - animationAreaBounds.top;

            return (
              <motion.div
                key={index}
                className={`
                  absolute w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${
                    result.isHeads
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50'
                      : 'bg-gray-600 opacity-50'
                  }
                `}
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  x: startX,
                  y: startY,
                  rotateY: 0,
                }}
                animate={{
                  // 버튼 위치에서 시작하여 목표 위치로 이동
                  x: [
                    startX,
                    startX + (trajectory.targetX - startX) * 0.3, // 중간 지점
                    trajectory.targetX, // 최종 목표
                  ],
                  y: [
                    startY,
                    startY - 60, // 위로 튀어오름
                    trajectory.targetY, // 최종 목표
                  ],
                  scale: [0.5, 1, 1.2, 1],
                  rotateY: [0, 360, 720],
                  opacity: [0, 1, 1, 1],
                }}
                transition={{
                  duration: COIN_TOSS_PHYSICS.FLIGHT_DURATION,
                  delay: trajectory.delay,
                  ease: 'easeOut',
                  times: [0, 0.4, 0.9, 1],
                }}
                onAnimationComplete={() => {
                  // 앞면인 경우에만 코인 가치 증가
                  if (result.isHeads) {
                    onCoinLand(result.denomination);
                  }
                }}
              >
                {coin?.emoji || '🪙'}
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
