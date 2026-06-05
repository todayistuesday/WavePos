import type { MenuItem } from "../../types";

interface DashboardPageProps {
  activeMenu: MenuItem;
}

const docs = [
  {
    title: "공통 규칙",
    description: "AGENTS와 Rules를 먼저 읽고 작업 순서를 맞춥니다."
  },
  {
    title: "PRD 작성",
    description: "도메인별 문서를 먼저 정리한 뒤 App 변경을 진행합니다."
  },
  {
    title: "앱 확장",
    description: "components, pages, services 단위로 분리해 기능을 추가합니다."
  }
];

export function DashboardPage({ activeMenu }: DashboardPageProps) {
  return (
    <section className="page">
      <div className="hero">
        <article className="card">
          <strong>현재 선택</strong>
          <h3>{activeMenu.label}</h3>
          <span>{activeMenu.description}</span>
        </article>
        <article className="card">
          <strong>권장 시작 순서</strong>
          <ul>
            <li>요구사항을 `docs/prd`에 먼저 문서화</li>
            <li>필요한 Rule과 Skill을 확인</li>
            <li>영향 범위를 고정한 뒤 App 구현</li>
          </ul>
        </article>
      </div>

      <div>
        <strong className="section-copy">프로젝트 운영 블록</strong>
        <h3 className="section-title">Rules / Skills / App / PRD</h3>
      </div>

      <div className="grid">
        <article className="card">
          <strong>Rules</strong>
          <span>작업 원칙, UI/UX 보호, 데이터 동기화 규칙을 관리합니다.</span>
        </article>
        <article className="card">
          <strong>Skills</strong>
          <span>커밋, PRD 작성, React 구현처럼 반복 작업을 문서화합니다.</span>
        </article>
        <article className="card">
          <strong>App</strong>
          <span>Vite + React + TypeScript 기반으로 화면과 로직을 확장합니다.</span>
        </article>
      </div>

      <div className="docs">
        {docs.map((item) => (
          <article key={item.title} className="card">
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
