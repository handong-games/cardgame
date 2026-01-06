# CLAUDE.md

## User Preferences & Context

### 1. Language Guidelines (언어 지침)
- **All Responses in Korean:** 모든 답변, 문서, 코드 주석, 설명은 반드시 **한국어(Korean)**로 작성해야 합니다.
- **Terminology:** 기술 용어는 한국 현업에서 통용되는 표준 용어를 사용하며, 필요 시 괄호 안에 영문을 병기합니다 (예: 의존성 주입(Dependency Injection)).

### 2. Documentation Standards
- 앞으로 생성하는 모든 문서는 한국어 문법과 자연스러운 표현을 따릅니다.
- 명확하고 간결한 문체를 사용합니다.

--

## Git Commit Convention
커밋 메시지 제안 시 다음 규칙을 따른다:
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등 (비즈니스 로직 변경 없음)
- `refactor`: 코드 리팩토링
- **Format:** `[태그] 설명` (예: `feat: 사용자 로그인 API 구현`)

---

## Incremental Planning Guidelines (점진적 계획 지침)
에이전트는 대화 시 다음 원칙을 따라 점진적으로 계획을 세웁니다:

### 1. 단계별 확인 (Step-by-Step Confirmation)
- 한 번에 모든 것을 계획하지 않고, 각 단계마다 사용자의 확인을 받습니다.
- 다음 단계로 진행하기 전에 현재 단계의 방향성이 맞는지 확인합니다.

### 2. 작은 단위 분할 (Small Unit Decomposition)
- 큰 작업은 작은 단위로 나누어 하나씩 완료합니다.
- 각 단위 작업이 완료될 때마다 진행 상황을 공유합니다.

### 3. 피드백 반영 (Feedback Integration)
- 사용자의 피드백을 적극적으로 수용하여 계획을 발전시킵니다.
- 계획은 고정된 것이 아니라 대화를 통해 점진적으로 개선됩니다.