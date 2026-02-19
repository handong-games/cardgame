# Unity 카드게임 프로젝트 전체 기획

## 목표
React 프로토타입을 기반으로 Unity 메인 프로젝트 구조 설계 및 구현

---

## 1. 폴더 구조

→ **[01. folder-structure.md](./01.%20folder-structure.md)** 참조

---

## 2. 핵심 시스템 설계

### 2.1 데이터 클래스 (ScriptableObject)

| 클래스명 | 역할 | 프로토타입 대응 |
|---------|------|----------------|
| `CardData` | 카드 정의 | `Card` 타입 |
| `EnemyData` | 적 정의 | `Enemy` 타입 |
| `BuffData` | 버프 정의 | `Buff` 타입 |
| `RegionData` | 지역 정의 | `Region` 타입 |

### 2.2 런타임 데이터 클래스

| 클래스명 | 역할 | 프로토타입 대응 |
|---------|------|----------------|
| `PlayerState` | 플레이어 상태 | `Player` |
| `EnemyState` | 적 인스턴스 상태 | `Enemy` |
| `BattleState` | 전투 상태 | `BattleState` |
| `RunState` | 런 진행 상태 | `RunState` |

### 2.3 매니저 클래스

| 매니저 | 역할 |
|--------|------|
| `GameManager` | 전체 게임 흐름 관리 (싱글턴) |
| `BattleManager` | 전투 진행, 턴 관리 |
| `DeckManager` | 덱/손패/버림패 관리 |
| `UIManager` | UI 업데이트 조율 |

---

## 3. 씬 구성

→ **[02. scene-structure.md](./02.%20scene-structure.md)** 참조

---

## 4. 구현 단계 (Phase)

### Phase 1: 프로젝트 기반
- [ ] 폴더 구조 생성
- [ ] 코어 데이터 클래스 정의 (SO)
- [ ] 기본 매니저 스켈레톤

### Phase 2: UI 레이아웃
- [ ] BattleCanvas 생성
- [ ] 3개 영역 배치 (TopBar, BattleArea, PlayerArea)
- [ ] 캐릭터 카드 UI
- [ ] HP 바, 방패 아이콘

### Phase 3: 카드 시스템
- [ ] 카드 UI 프리팹
- [ ] 손패 배열 (부채꼴)
- [ ] 카드 드래그 앤 드롭

### Phase 4: 전투 로직
- [ ] 턴 시스템
- [ ] 카드 효과 적용
- [ ] 적 AI (의도 시스템)

### Phase 5: 메타 시스템
- [ ] 런 진행
- [ ] 보상 시스템
- [ ] 전직 시스템

---

## 5. 프로토타입 레이아웃 (참고)

```
┌─────────────────────────────────────────────────────────────┐
│  【 상단 바 (TopBar) 】 - 적 이름 | 골드 | 장신구           │
├─────────────────────────────────────────────────────────────┤
│  【 전투 영역 】                                             │
│                                                             │
│   ○ 방패  ┌─HP바─┐          ○ 방패  ┌─HP바─┐  [다음액션]   │
│   ┌─────────────────┐       ┌─────────────────┐             │
│   │   유저 캐릭터    │       │    적 캐릭터    │             │
│   └─────────────────┘       └─────────────────┘             │
│                                               [라운드진행]   │
├─────────────────────────────────────────────────────────────┤
│  【 플레이어 영역 】                                         │
│  ○ 에너지                                        ○ 다음턴   │
│                    ┌────┐ ┌────┐ ┌────┐                     │
│  ○ 덱             │카드│ │카드│ │카드│                      │
│                    └────┘ └────┘ └────┘                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Addressables 리소스 관리

> **[addressables-resource-management.md](./addressables-resource-management.md)** 참조
>
> 에셋 그룹 구성, 주소 지정 규칙, 메모리 관리 전략, 로딩 시스템, 업데이트/패치 시스템 등 상세 내용은 독립 문서에서 관리합니다.

---

## 7. 해상도 & 화면 비율 대응

→ **[03. resolution-and-aspect-ratio.md](./03.%20resolution-and-aspect-ratio.md)** 참조

---

## 8. Canvas 아키텍처 (분리 전략)

### Canvas 계층 구조
```
[Sort Order: 0]  BGCanvas        → 배경 (거의 안 변함)
[Sort Order: 10] BattleCanvas    → 몬스터/이펙트/피격 플래시 (중간)
[Sort Order: 20] HandCanvas      → 손패/드래그 (자주 변함, 최중요)
[Sort Order: 30] OverlayCanvas   → 툴팁/확대보기/모달/가이드 (최상단)
```

### 각 Canvas 역할

#### BGCanvas (Sort Order: 0)
- **변경 빈도**: 거의 없음 (정적)
- **내용**: 배경 이미지, 전투 필드 배경
- **최적화**: 한 번 렌더링 후 캐시

#### BattleCanvas (Sort Order: 10)
- **변경 빈도**: 중간
- **내용**:
  - TopBar (적 이름, 골드, 장신구)
  - 플레이어 캐릭터 (HP바, 방패, 버프)
  - 적 캐릭터 (HP바, 방패, 의도)
  - 피격 플래시/이펙트
  - 라운드 진행 UI

#### HandCanvas (Sort Order: 20)
- **변경 빈도**: 높음 (최중요)
- **내용**:
  - 손패 카드들 (부채꼴 배열)
  - 드래그 중인 카드
  - 에너지/덱 표시
  - 턴 종료 버튼
- **최적화**: 손패 변경 시만 리빌드

#### OverlayCanvas (Sort Order: 30)
- **변경 빈도**: 이벤트성
- **내용**:
  - 카드 툴팁/확대 보기
  - 모달 (보상 선택, 전직 등)
  - 튜토리얼 가이드
  - 일시정지 메뉴
- **특징**: Raycast Target으로 하위 Canvas 입력 차단

### Canvas 설정 (공통)
```
모든 Canvas
├── Render Mode: Screen Space - Overlay
├── Pixel Perfect: false (성능)
└── Additional Shader Channels: Nothing (필요 시 추가)

Canvas Scaler (공통)
├── UI Scale Mode: Scale With Screen Size
├── Reference Resolution: 1920 x 1080
└── Match: 0.5
```

### 드로우콜 최적화
| Canvas | 전략 |
|--------|------|
| BGCanvas | Static Batching (변경 없음) |
| BattleCanvas | Sprite Atlas 사용 |
| HandCanvas | 카드별 Material 공유 |
| OverlayCanvas | 필요 시에만 활성화 |

---

## Unity 구현 계획

### 1단계: Canvas 및 기본 구조 생성

#### Canvas 설정
- Render Mode: Screen Space - Overlay
- UI Scale Mode: Scale With Screen Size
- Reference Resolution: 1920 x 1080
- Match: 0.5 (Width/Height 균형)

#### 계층 구조
```
BattleCanvas
├── TopBar (상단)
│   ├── EnemyNameText
│   └── GoldText
├── BattleArea (중앙 - 전투 영역)
│   ├── PlayerCharacterArea (좌측)
│   │   ├── ShieldAndHPBar
│   │   │   ├── ShieldIcon
│   │   │   └── HPBar
│   │   └── CharacterCard
│   │       ├── NameLabel
│   │       └── CharacterImage
│   └── EnemyCharacterArea (우측)
│       ├── NextActionIndicator (상단)
│       ├── ShieldAndHPBar
│       └── CharacterCard
└── PlayerArea (하단)
    ├── EnergyDisplay (좌상)
    ├── DeckDisplay (좌하)
    ├── HandArea (중앙)
    └── EndTurnButton (우측)
```

### 2단계: 스크립트 구조

| 스크립트명 | 역할 |
|-----------|------|
| `BattleSceneManager.cs` | 전체 씬 관리 |
| `CharacterCardUI.cs` | 캐릭터 카드 (이름 + 이미지) |
| `HPBarUI.cs` | HP 바 (현재/최대 표시) |
| `ShieldIconUI.cs` | 방패 아이콘 (방어력 표시) |
| `EnergyDisplayUI.cs` | 에너지 표시 |
| `DeckDisplayUI.cs` | 덱 카드 수 표시 |
| `EndTurnButtonUI.cs` | 턴 종료 버튼 |

### 3단계: 구현 순서

1. **Canvas 생성 및 기본 레이아웃 영역 배치**
   - 3개 영역(TopBar, BattleArea, PlayerArea) 구분

2. **캐릭터 카드 UI 구현**
   - 플레이어 캐릭터 카드
   - 적 캐릭터 카드

3. **HP 바 및 방패 아이콘 구현**

4. **하단 UI 구현**
   - 에너지 표시
   - 덱 표시
   - 턴 종료 버튼
   - 손패 영역 (빈 영역으로)

---

## 주요 참조 파일

| 구분 | 경로 |
|------|------|
| 화면 설계서 | `docs/02. proto/02. battle-scene/screen.md` |
| UI/UX 문서 | `docs/02. proto/02. battle-scene/ui-ux.md` |
| 코딩 컨벤션 | `docs/03. main/coding-convention.md` |
| React 프로토 | `dev/proto/src/components/screens/BattleScreen.tsx` |

---

## 검증 방법

1. Unity 에디터에서 Game 뷰로 레이아웃 확인
2. 각 영역이 올바른 위치에 배치되었는지 시각적 확인
3. 화면 비율 변경 시 UI 스케일링 확인

---

## 비고

- 이번 단계에서는 **정적 레이아웃만** 구현
- 카드 드래그, 애니메이션, 게임 로직은 이후 단계에서 구현
- 데이터 바인딩 없이 하드코딩된 테스트 값 사용
