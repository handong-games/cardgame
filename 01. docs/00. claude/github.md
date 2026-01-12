# GitHub 전략 가이드

이 문서는 프로젝트의 Git/GitHub 관련 규칙과 전략을 정의합니다.

---

## 1. 커밋 컨벤션 (Commit Convention)

### 커밋 태그
| 태그 | 설명 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 코드 포맷팅, 세미콜론 누락 등 (비즈니스 로직 변경 없음) |
| `refactor` | 코드 리팩토링 |
| `test` | 테스트 코드 추가/수정 |
| `chore` | 빌드 설정, 패키지 관리 등 기타 작업 |

### 메시지 형식
```
[태그]: 설명
```

### 예시
```bash
feat: 사용자 로그인 API 구현
fix: 카드 드래그 시 위치 오류 수정
docs: README 설치 가이드 추가
refactor: 게임 스토어 상태 관리 개선
```

### Co-Authored-By
Claude와 협업한 커밋에는 다음을 포함합니다:
```
Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## 2. 브랜치 전략 (Branch Strategy)

### main 단일 브랜치 운영
- **main**: 유일한 브랜치로 모든 작업이 직접 커밋됩니다
- 별도의 feature/develop 브랜치를 운영하지 않습니다
- 모든 변경사항은 main에 바로 반영됩니다

### 주의사항
- main 브랜치에 직접 커밋하므로 커밋 전 충분한 검토 필요
- 큰 변경은 여러 개의 작은 커밋으로 분리 권장

---

## 3. Git Hook 설정

### pre-commit Hook
커밋 시 자동으로 문서 의존성을 체크합니다.

#### 동작 흐름
```
git commit -m "docs: 문서 수정"
    ↓
pre-commit hook 실행
    ↓
변경된 .md 파일의 연관 문서 확인
    ↓
[연관 문서 미포함] → 경고 표시
[changelog.md 미포함] → 필수 경고 표시
    ↓
--no-verify로 강제 커밋 가능
```

#### Hook 위치
- `.git/hooks/pre-commit`

#### 체크 항목
- 스테이징된 .md 파일 감지
- `dependency-map.md` 참조하여 연관 문서 확인
- 미포함 연관 문서 경고 표시
- `changelog.md` 필수 체크

#### Hook 우회
긴급한 경우 `--no-verify` 옵션으로 Hook을 우회할 수 있습니다:
```bash
git commit -m "메시지" --no-verify
```

---

## 4. Pull Request 규칙

### PR 제목 형식
커밋 컨벤션과 동일한 형식을 따릅니다:
```
[태그]: PR 설명
```

### PR 본문 템플릿
```markdown
## Summary
- 변경 사항 요약 (1-3줄)

## Test plan
- [ ] 테스트 항목 1
- [ ] 테스트 항목 2

---
Generated with Claude Code
```

### 리뷰 체크리스트
PR 생성 전 확인사항:
- [ ] 코드가 정상 동작하는가
- [ ] 불필요한 console.log/디버깅 코드 제거
- [ ] 관련 문서 업데이트 완료
- [ ] 커밋 메시지가 컨벤션을 따르는가

---

## 5. 주의사항

### 금지된 작업
- **force push 금지**: `git push --force` 사용 금지
- **amend 제한**: 이미 push된 커밋에 `--amend` 금지
- **main 직접 rebase 금지**: 히스토리 변경 작업 금지

### 보안 관련 파일
다음 파일들은 절대 커밋하지 않습니다:
- `.env` 파일
- `credentials.json`
- API 키가 포함된 설정 파일
- 개인 인증 정보

### .gitignore 필수 항목
```
.env
.env.local
*.pem
credentials.json
```

---

## 참조 문서
- `.claude/agents/docs-mapping.md`: 에이전트-문서 매핑
- `.claude/docs/dependency-map.md`: 문서 의존성 맵
- `01. docs/changelog.md`: 변경 로그
