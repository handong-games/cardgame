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