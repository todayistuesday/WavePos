---
name: git-commit
description: 변경 파일을 기준으로 한국어 Conventional Commit 메시지를 정리할 때 사용하는 스킬
---

# Git Commit 스킬

## 사용 시점
- 사용자가 커밋을 명시적으로 요청했을 때만 사용한다.

## 원칙
- `git add .`는 사용하지 않는다.
- 파일별로 명시적으로 스테이징한다.
- 커밋 메시지는 한국어로 작성한다.

## 형식
```text
type(scope): 제목
```

## 예시
- `feat(app): 대시보드 초기 화면 추가`
- `docs(prd): 상품 공통 문서 초안 작성`
