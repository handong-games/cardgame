# 전사 스킬 입력 스키마 (초안)

> 라운드별 최소/최대 턴 예측 시스템에 사용되는 스킬 입력 정의
> 강도는 1~10 단계, 비선형 커브로 변환되어 계산된다.

---

## 1) 스킬 객체 구조

```json
{
  "name": "정의의 일격",
  "class": "warrior",
  "role": "damage",
  "build": "stable",
  "cost": 1,
  "cooldown": 0,
  "conditions": [
    { "type": "none" }
  ],
  "effects": [
    {
      "type": "damage",
      "target": "enemy",
      "magnitude": 5,
      "hits": 1,
      "duration": 0,
      "stackable": false,
      "notes": ""
    }
  ]
}
```

---

## 2) 필수 필드

- `name`: string
- `class`: "warrior" 고정
- `role`: damage | block | heal | buff | debuff | utility
- `build`: stable | burst | tails | low_hp | combo | hybrid
- `cost`: number (코인 비용)
- `cooldown`: number (턴 제한, 없으면 0)
- `conditions`: Condition[] (없으면 type: none)
- `effects`: Effect[]

---

## 3) Condition 정의

```json
{
  "type": "hp_below" | "hp_above" | "coin_heads" | "coin_tails" | "combo" | "none",
  "value": 0,
  "notes": ""
}
```

- `hp_below`: value% 이하일 때
- `hp_above`: value% 이상일 때
- `coin_heads`: 앞면 개수 조건
- `coin_tails`: 뒷면 개수 조건
- `combo`: 직전 스킬/연계 조건
- `none`: 조건 없음

---

## 4) Effect 정의

```json
{
  "type": "damage" | "block" | "heal" | "buff" | "debuff" | "utility",
  "target": "enemy" | "self" | "both",
  "magnitude": 1,
  "hits": 1,
  "duration": 0,
  "stackable": false,
  "notes": ""
}
```

### 필드 설명
- `magnitude`: 1~10 강도 단계
- `hits`: 다타수 (기본 1)
- `duration`: 버프/디버프 지속 턴
- `stackable`: 스택 가능 여부
- `notes`: 특수 룰(예: "앞면->뒷면", "방어단계-2")

---

## 5) 상태이상/특수 효과 표기 규칙

- **중독**: effects에 `type: "debuff"`, notes: "poison", magnitude=단계, duration=N
- **환각**: effects에 `type: "debuff"`, notes: "hallucination", magnitude=단계, duration=1
- **속박**: effects에 `type: "debuff"`, notes: "bind", magnitude=단계, duration=1

---

## 6) 강도 단계 매핑 (비선형)

단계 -> 값(가중치)
- 1 -> 1.0
- 2 -> 1.3
- 3 -> 1.7
- 4 -> 2.2
- 5 -> 3.0
- 6 -> 4.0
- 7 -> 5.3
- 8 -> 7.0
- 9 -> 9.0
- 10 -> 12.0

---

## 7) 턴 산출 규칙 (의사코드)

목표: 스킬 조합별로 **라운드 최소/최대 킬 턴**을 산출한다.

### 7.1 기본 규칙 요약
- 최소 턴 = **코인 최대 시나리오**에서 최단 킬 턴
- 최대 턴 = **코인 최소(1개) 시나리오**에서 최장 킬 턴
- 스킬 조합 표시:
  - 스킬 3개: 기본 스킬만
  - 스킬 4개: 기본 3 + 추가 1개
  - 스킬 5개: 전투에서 5개 모두 사용 가능

### 7.2 의사코드

```text
for each round:
  candidates = monsterOptions(round)
  for each monster in candidates:
    for each coinScenario in [maxCoin, minCoin(=1)]:
      skillSet = resolveSkillSet(totalSkills)
      result = simulateTurns(monster, skillSet, coinScenario)
      record killTurn and skillCombo

  minTurn = min(killTurn at maxCoin)
  maxTurn = max(killTurn at minCoin)
  output round range + combos
```

### 7.3 simulateTurns 개념

```text
function simulateTurns(monster, skillSet, coinScenario):
  hp = monster.hp
  turn = 1
  while hp > 0 and turn <= TURN_CAP:
    apply monster pre-effects (debuff, bind, hallucination)
    effectiveDamage = pickBestSkillCombo(skillSet, coinScenario, turn)
    effectiveDamage *= damageReduction(monster.damageReduce, turn)
    effectiveDamage *= statusCoefficients(turn)
    hp -= effectiveDamage
    apply monster heal/defense pattern for this turn
    turn += 1
  return turn
```

### 7.4 보정 계수 적용
- 중독: `poisonCoef = 1 + (stage * 0.05)` (N턴)
- 환각: 해당 턴 코인 기대치 x 0.7
- 속박: 해당 턴 방어 효율 x 0.85

---

작성 위치: docs/codex/warrior-skill-input-schema.md
