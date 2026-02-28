import type { Region } from '../types';

export const REGIONS: Record<string, Region> = {
  forgotten_dungeon: {
    id: 'forgotten_dungeon',
    name: '잊혀진 숲',
    description: '안개에 뒤덮인 고대의 숲. 슬라임과 고블린이 서식한다.',
    totalRounds: 7,
    bossKey: 'dark_knight',
    bgTheme: 'forest',
  },
  // 추후 확장용 지역들
  // cursed_castle: {
  //   id: 'cursed_castle',
  //   name: '저주받은 성',
  //   description: '그림자가 드리운 폐허. 언데드가 배회한다.',
  //   totalRounds: 7,
  //   bossKey: 'lich_king',
  //   bgTheme: 'castle',
  // },
  // ancient_dungeon: {
  //   id: 'ancient_dungeon',
  //   name: '고대 던전',
  //   description: '땅속 깊이 잠든 미궁. 어둠의 존재가 깃들어 있다.',
  //   totalRounds: 7,
  //   bossKey: 'dungeon_lord',
  //   bgTheme: 'dungeon',
  // },
};

// 기본 시작 지역
export const DEFAULT_REGION_ID = 'forgotten_dungeon';

// 지역 조회
export function getRegion(regionId: string): Region {
  return REGIONS[regionId] ?? REGIONS[DEFAULT_REGION_ID];
}
