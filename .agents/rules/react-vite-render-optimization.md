# React / Vite 구현 가이드

## 기본 원칙
- 큰 화면 전환이나 비긴급 상태 업데이트에는 `startTransition` 사용을 우선 검토한다.
- 무거운 화면은 필요 시 lazy loading으로 분리한다.
- 파생 가능한 값은 effect보다 render 단계 계산을 우선한다.
- 반복 렌더를 유발하는 불필요한 상태는 만들지 않는다.

## 구조 원칙
- 공통 UI는 `components/`, 도메인 화면은 `pages/`, 데이터 로직은 `services/`, 순수 함수는 `utils/`에 둔다.
- 파일 하나에 여러 역할을 섞지 않는다.

## 검증
- 기능 추가 뒤 `npm run build` 기준으로 최소 검증을 수행한다.
