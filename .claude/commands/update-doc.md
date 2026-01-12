# /update-doc 명령어

현재 세션의 작업 내용을 분석하여 관련 문서를 자동으로 업데이트합니다.

---

## 워크플로우

```
/update-doc
     ↓
[Phase 1] 변경 파일 감지 (git status)
     ↓
[Phase 2] 레지스트리에서 관련 문서 검색
     ↓
[Phase 3] 변경 내용 요약 (git diff --stat)
     ↓
[Phase 4] 문서 업데이트
     ↓
[Phase 5] 레지스트리 동기화 확인
     ↓
완료
```

---

## Phase 1: 변경 파일 감지

```bash
git status --short
```

| 기호 | 의미 |
|------|------|
| `M` | 수정됨 |
| `A` | 추가됨 |
| `D` | 삭제됨 |

---

## Phase 2: 레지스트리에서 관련 문서 검색

### 문서 인덱스 참조
`01. docs/00. claude/doc-index.md` 파일에서 검색

### 검색 순서
1. 변경된 파일명/경로에서 키워드 추출
2. doc-index.md의 레지스트리에서 매칭
3. 관련 문서 경로 확인

### 예시
```
변경 파일: 02. dev/proto/src/components/common/HPBar.tsx
     ↓
키워드: "HPBar", "체력바"
     ↓
doc-index.md 검색: "체력바" → ui-ux.md #체력바
```

---

## Phase 3: 변경 내용 요약

```bash
git diff --stat
```

- 전체 diff 대신 통계만 확인
- 토큰 절약

---

## Phase 4: 문서 업데이트

### 문서 파일 직접 변경된 경우
- 추가 작업 없음

### 코드 파일 변경된 경우
1. Phase 2에서 찾은 관련 문서 열기
2. 해당 섹션 수정
3. 저장

---

## Phase 5: 레지스트리 동기화 확인

### 체크 항목
| 상황 | 처리 |
|------|------|
| 새 UI 컴포넌트 추가됨 | doc-index.md에 등록 필요 알림 |
| UI 컴포넌트 삭제됨 | doc-index.md에서 제거 필요 알림 |
| 레지스트리에 없는 파일 변경 | 등록 여부 확인 |

### 동기화 메시지 예시
```
[레지스트리 동기화]
⚠ 새 컴포넌트 감지: NewComponent.tsx
  → doc-index.md에 등록이 필요합니다.
  → 관련 문서 섹션 추가가 필요합니다.
```

---

## 참조
- `01. docs/00. claude/doc-index.md`: 문서 인덱스 (레지스트리)
- `01. docs/00. claude/command-workflow.md`: 프롬프트 처리 규칙
- `01. docs/00. claude/github.md`: Git 커밋 규칙
