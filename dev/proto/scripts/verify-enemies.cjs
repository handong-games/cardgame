// 몬스터 데이터 무결성 검증 스크립트

// enemies.ts에서 데이터 추출 (간이 파싱)
const fs = require('fs');
const path = require('path');

const enemiesPath = path.join(__dirname, '../src/data/enemies.ts');
const content = fs.readFileSync(enemiesPath, 'utf-8');

console.log('========== 몬스터 데이터 무결성 검증 ==========\n');

// 1. ENEMY_DEFINITIONS에서 몬스터 ID 추출
const definitionsMatch = content.match(/export const ENEMY_DEFINITIONS[^{]+\{([\s\S]+?)\n\};/);
if (!definitionsMatch) {
  console.error('❌ ENEMY_DEFINITIONS를 찾을 수 없습니다.');
  process.exit(1);
}

const definitionsContent = definitionsMatch[1];
const monsterIds = definitionsContent.match(/^\s+(\w+):/gm)?.map(m => m.trim().replace(':', '')) || [];

console.log('✅ 정의된 몬스터:', monsterIds.length + '개');
console.log('  ', monsterIds.join(', '));
console.log();

// 2. ROUND_ENEMY_POOLS 검증
const poolsMatch = content.match(/export const ROUND_ENEMY_POOLS[^{]+\{([\s\S]+?)\n\};/);
if (!poolsMatch) {
  console.error('❌ ROUND_ENEMY_POOLS를 찾을 수 없습니다.');
  process.exit(1);
}

const poolsContent = poolsMatch[1];
const poolMatches = [...poolsContent.matchAll(/(early|mid|late|boss):\s*\[([\s\S]*?)\]/g)];

let poolValidation = true;
for (const match of poolMatches) {
  const poolName = match[1];
  const poolContent = match[2];
  const poolIds = poolContent.match(/'(\w+)'/g)?.map(m => m.replace(/'/g, '')) || [];

  console.log(`${poolName} 풀: ${poolIds.length}개`);

  for (const id of poolIds) {
    if (!monsterIds.includes(id)) {
      console.error(`  ❌ 정의되지 않은 몬스터: ${id}`);
      poolValidation = false;
    }
  }

  if (poolValidation) {
    console.log(`  ✅ 모든 몬스터 ID 유효`);
  }
  console.log();
}

// 3. ENEMY_EMOJIS 검증
const emojisMatch = content.match(/export const ENEMY_EMOJIS[^{]+\{([\s\S]+?)\n\};/);
if (!emojisMatch) {
  console.error('❌ ENEMY_EMOJIS를 찾을 수 없습니다.');
  process.exit(1);
}

const emojisContent = emojisMatch[1];
const emojiIds = emojisContent.match(/^\s+(\w+):/gm)?.map(m => m.trim().replace(':', '')) || [];

console.log('이모지 매핑:', emojiIds.length + '개');

let emojiValidation = true;
for (const id of monsterIds) {
  if (!emojiIds.includes(id)) {
    console.error(`  ❌ 이모지가 없는 몬스터: ${id}`);
    emojiValidation = false;
  }
}

if (emojiValidation) {
  console.log('  ✅ 모든 몬스터에 이모지 매핑됨');
}
console.log();

// 4. 골드 보상 범위 검증
const goldMatches = [...definitionsContent.matchAll(/(\w+):\s*\{[\s\S]*?goldReward:\s*(\d+)/g)];
console.log('골드 보상 범위:');
console.log('  최소:', Math.min(...goldMatches.map(m => parseInt(m[2]))));
console.log('  최대:', Math.max(...goldMatches.map(m => parseInt(m[2]))));
console.log('  평균:', Math.round(goldMatches.reduce((sum, m) => sum + parseInt(m[2]), 0) / goldMatches.length));
console.log();

// 5. intentPattern 검증
const patternMatches = [...definitionsContent.matchAll(/(\w+):\s*\{[\s\S]*?intentPattern:\s*\[([\s\S]*?)\]/g)];
let patternValidation = true;
for (const match of patternMatches) {
  const id = match[1];
  const pattern = match[2];
  const intentCount = (pattern.match(/type:/g) || []).length;

  if (intentCount === 0) {
    console.error(`  ❌ ${id}: intentPattern이 비어있음`);
    patternValidation = false;
  }
}

if (patternValidation) {
  console.log('✅ 모든 몬스터에 intentPattern 정의됨');
}
console.log();

// 최종 결과
if (poolValidation && emojiValidation && patternValidation) {
  console.log('========================================');
  console.log('✅ 모든 검증 통과!');
  console.log('========================================');
  process.exit(0);
} else {
  console.log('========================================');
  console.log('❌ 검증 실패. 위의 오류를 수정하세요.');
  console.log('========================================');
  process.exit(1);
}
