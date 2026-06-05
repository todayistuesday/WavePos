import type { MenuItem } from "./types";

export const APP_TITLE = "WavePos";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    group: "dashboard",
    description: "프로젝트 진행 현황과 다음 작업을 확인합니다."
  },
  {
    id: "product",
    label: "상품 기획",
    group: "product",
    description: "상품 정책과 등록 흐름을 PRD 중심으로 정리합니다."
  },
  {
    id: "facility",
    label: "시설 운영",
    group: "facility",
    description: "운영 시설과 상품 매핑 구조를 관리합니다."
  },
  {
    id: "front",
    label: "예약 프론트",
    group: "front",
    description: "고객 예약 화면과 사용자 흐름을 설계합니다."
  }
];
