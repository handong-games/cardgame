# 문서 인덱스

프롬프트에서 관련 문서를 찾기 위한 레지스트리입니다.

---

## UI 컴포넌트 레지스트리

| 이름 | 문서 경로 | 섹션 |
|-----|----------|------|
| 체력바 | 02. proto/02. battle-scene/ui-ux.md | #체력바 |
| 캐릭터카드 | 02. proto/02. battle-scene/ui-ux.md | #캐릭터카드 |
| 적카드 | 02. proto/02. battle-scene/ui-ux.md | #적카드 |
| 상단바 | 02. proto/02. battle-scene/ui-ux.md | #상단바 |
| 버프아이콘 | 02. proto/02. battle-scene/ui-ux.md | #버프아이콘 |
| 전투화면 | 02. proto/02. battle-scene/screen.md | 전체 |
| 승급힌트 | 02. proto/02. battle-scene/systems/advancement-hint.md | 전체 |
| 카드미리보기 | 02. proto/02. battle-scene/systems/card-preview.md | 전체 |

---

## 시스템 레지스트리

| 이름 | 문서 경로 |
|-----|----------|
| 전직시스템 | 02. proto/02. battle-scene/systems/class-advancement.md |
| 목적지시스템 | 02. proto/02. battle-scene/systems/destination-system.md |
| 지역시스템 | 02. proto/02. battle-scene/systems/region-system.md |
| 마을시스템 | 02. proto/02. battle-scene/systems/village-system.md |

---

## 콘텐츠 레지스트리

| 이름 | 문서 경로 |
|-----|----------|
| 카드 | contents/cards.md |
| 팔라딘 | contents/paladin.md |
| 워리어 | contents/warrior.md |
| 전직 | contents/class-advancement.md |

---

## 프로젝트 레지스트리

| 이름 | 문서 경로 |
|-----|----------|
| 원페이저 | 01. project/01. one-pager.md |

---

## 문서 구조

```
01. docs/
├── 00. claude/        # Claude 설정 문서
│   ├── doc-index.md       # 이 파일
│   ├── command-workflow.md # 프롬프트 처리 규칙
│   └── github.md          # Git 규칙
├── 01. project/       # 프로젝트 기획
│   └── 01. one-pager.md
├── 02. proto/         # 프로토타입 설계
│   ├── 00. common/        # 공통 UI/UX
│   └── 02. battle-scene/  # 전투 화면
│       ├── screen.md      # 화면 레이아웃
│       ├── ui-ux.md       # UI 컴포넌트
│       ├── animation.md   # 애니메이션
│       └── systems/       # 시스템 문서
├── 03. wireframe/     # 와이어프레임
└── contents/          # 게임 콘텐츠
    ├── cards.md
    ├── paladin.md
    └── warrior.md
```

---

## 사용 방법

1. 사용자 요청에서 키워드 추출
2. 이 문서에서 키워드와 일치하는 항목 검색
3. 관련 문서 경로 확인
4. 해당 문서의 섹션으로 이동
