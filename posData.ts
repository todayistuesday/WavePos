export const topTabs = ["현장 판매", "예약 조회", "환불", "창구 마감"] as const;

export const posModes = [
  { id: "general", label: "일반 포스" },
  { id: "keyband", label: "키밴드 정산" },
] as const;

export const productCategories = [
  { id: "surf", label: "서핑장비" },
  { id: "suite", label: "슈트" },
  { id: "tower", label: "타월" },
  { id: "locker", label: "구명자켓" },
  { id: "snorkel", label: "수중스쿠터" },
  { id: "tube", label: "튜브" },
  { id: "cabana", label: "미오코스타 카바나" },
  { id: "bed", label: "선베드" },
] as const;

export const schedules = [
  {
    id: "one-hour",
    title: "1세션 (1시간)",
    rows: [
      ["정원", "10000"],
      ["발권", "0"],
      ["잔여", "10000"],
      ["온라인 잔여", "1000"],
    ],
  },
] as const;

export const ticketOptions = [
  { title: "소프트 보드 (1시간)", price: "9,000원" },
  { title: "하드 보드 (숏 1시간)", price: "18,000원" },
  { title: "하드 보드 (몸 1시간)", price: "19,000원" },
  { title: "프리미엄 보드 (숏 1시간)", price: "24,000원" },
] as const;

export const generalPaymentMethods = ["신용 카드", "현금", "키밴드"] as const;

export const keybandRows = [
  {
    id: "kb-1001",
    bandNo: "KB-1001",
    reservationNo: "R20260529-1001",
    phone: "010-1234-1001",
    name: "이현우",
    time: "15:05",
    amount: "32,000원",
    status: "정산 가능",
    detail: "보드 대여 2건 · 음료 1건",
    items: [
      {
        id: "kb-1001-board",
        productName: "서핑장비",
        session: "1세션 (1시간)",
        ticketName: "소프트 보드",
        price: "9,000원",
        quantity: 2,
      },
      {
        id: "kb-1001-drink",
        productName: "음료",
        session: "상시",
        ticketName: "아이스 아메리카노",
        price: "14,000원",
        quantity: 1,
      },
    ],
  },
  {
    id: "kb-1002",
    bandNo: "KB-1002",
    reservationNo: "R20260529-1002",
    phone: "010-1234-1002",
    name: "김서연",
    time: "15:12",
    amount: "18,000원",
    status: "정산 가능",
    detail: "보드 1건 · 락커 1건",
    items: [
      {
        id: "kb-1002-board",
        productName: "서핑장비",
        session: "1세션 (1시간)",
        ticketName: "하드 보드 (숏)",
        price: "15,000원",
        quantity: 1,
      },
      {
        id: "kb-1002-locker",
        productName: "락커",
        session: "종일",
        ticketName: "개인 락커",
        price: "3,000원",
        quantity: 1,
      },
    ],
  },
  {
    id: "kb-1003",
    bandNo: "KB-1003",
    reservationNo: "R20260529-1003",
    phone: "010-1234-1003",
    name: "박준호",
    time: "15:18",
    amount: "54,000원",
    status: "부분 정산",
    detail: "서핑장비 3건 · 카바나 1건",
    items: [
      {
        id: "kb-1003-board",
        productName: "서핑장비",
        session: "1세션 (1시간)",
        ticketName: "프리미엄 보드",
        price: "8,000원",
        quantity: 3,
      },
      {
        id: "kb-1003-cabana",
        productName: "미오코스타 카바나",
        session: "오후권",
        ticketName: "카바나 일반",
        price: "30,000원",
        quantity: 1,
      },
    ],
  },
  {
    id: "kb-1004",
    bandNo: "KB-1004",
    reservationNo: "R20260529-1004",
    phone: "010-1234-1004",
    name: "정민지",
    time: "15:26",
    amount: "7,000원",
    status: "정산 가능",
    detail: "타월 1건 · 음료 1건",
    items: [
      {
        id: "kb-1004-towel",
        productName: "타월",
        session: "종일",
        ticketName: "비치 타월",
        price: "3,000원",
        quantity: 1,
      },
      {
        id: "kb-1004-drink",
        productName: "음료",
        session: "상시",
        ticketName: "생수",
        price: "4,000원",
        quantity: 1,
      },
    ],
  },
] as const;
