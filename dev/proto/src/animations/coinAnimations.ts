// 코인 토스 애니메이션 설정

// 코인 토스 타이밍 상수
export const COIN_ANIMATION_TIMING = {
  TOSS_DURATION: 0.8,      // 토스 애니메이션 시간
  COIN_STAGGER: 0.1,       // 코인 간 딜레이 (초)
  RESULT_DISPLAY: 1.5,     // 결과 표시 시간
} as const;

// 물리 기반 코인 토스 타이밍
export const COIN_TOSS_PHYSICS = {
  FLIGHT_DURATION: 0.6,    // 각 동전 비행 시간
  COIN_STAGGER: 0.1,       // 동전 간 발사 간격
  LANDING_DISPLAY: 0.9,    // 착지 후 표시 시간
  TOTAL_DURATION: 1.5,     // 전체 애니메이션
} as const;

// 코인 토스 애니메이션 (Framer Motion용)
export const coinTossAnimation = {
  initial: {
    y: 0,
    rotateY: 0,
    scale: 0.5,
    opacity: 0,
  },
  animate: {
    y: [-50, -100, -50, 0],  // 위로 튀어오르기
    rotateY: [0, 180, 360, 540, 720],  // 회전
    scale: 1,
    opacity: 1,
  },
  transition: {
    duration: COIN_ANIMATION_TIMING.TOSS_DURATION,
    ease: 'easeOut',
  },
};

// 앞면 (성공) 효과
export const headsEffect = {
  boxShadow: [
    '0 0 0px rgba(234, 179, 8, 0)',
    '0 0 20px rgba(234, 179, 8, 0.8)',
    '0 0 10px rgba(234, 179, 8, 0.5)',
  ],
  scale: [1, 1.1, 1],
  transition: {
    duration: 0.3,
    delay: COIN_ANIMATION_TIMING.TOSS_DURATION,
  },
};

// 뒷면 (실패) 효과
export const tailsEffect = {
  opacity: [1, 0.5],
  scale: [1, 0.9],
  transition: {
    duration: 0.2,
    delay: COIN_ANIMATION_TIMING.TOSS_DURATION,
  },
};
