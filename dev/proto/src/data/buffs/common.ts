import type { Buff, BuffEventEffect } from '../../types';

/**
 * 공용 버프 정의
 *
 * 모든 클래스가 사용할 수 있는 공통 버프
 */
export const COMMON_BUFF_DEFINITIONS: Record<string, Buff> = {
  // 탐욕 스택 - 3스택 시 보너스 코인 토스 발동
  greed_stack: {
    id: 'greed_stack',
    name: '탐욕',
    type: 'power',
    duration: 'combat', // 전투 종료까지 유지
    stackable: true,
    description:
      '3스택 도달 시 추가 코인 토스 발동. 보너스 토스에서 앞면이 나오면 해당 코인 소모.',
  },
};

/**
 * 공용 버프 이벤트 효과
 *
 * 탐욕 스택의 보너스 토스는 gameStore에서 직접 처리
 * (턴 시작 시 스택 체크 및 보너스 토스 발동)
 */
export const COMMON_BUFF_EVENT_EFFECTS: Record<string, BuffEventEffect[]> = {
  // 탐욕은 특수 처리가 필요하므로 여기서는 빈 배열
  // 실제 로직은 gameStore의 processGreedStack에서 처리
  greed_stack: [],
};

// 탐욕 시스템 상수
export const GREED_CONSTANTS = {
  THRESHOLD: 3, // 발동까지 필요한 스택 수
  BONUS_TOSS_COUNT: 1, // 발동 시 추가 코인 토스 횟수
};
