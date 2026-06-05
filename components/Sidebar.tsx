import type { MenuItem } from "../types";

interface SidebarProps {
  activeMenuId: string;
  items: MenuItem[];
  onSelectMenu: (menuId: string) => void;
}

export function Sidebar({ activeMenuId, items, onSelectMenu }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h1>WavePos</h1>
        <p>Park-os-admin의 운영 구조를 참고한 프로젝트 시작점입니다.</p>
      </div>
      <nav className="sidebar__menu" aria-label="주요 메뉴">
        {items.map((item) => (
          <button
            key={item.id}
            className={`sidebar__button${item.id === activeMenuId ? " is-active" : ""}`}
            type="button"
            onClick={() => onSelectMenu(item.id)}
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
