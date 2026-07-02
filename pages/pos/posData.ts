export const topTabs = ["현장 판매", "예약 조회", "환불", "창구 마감"] as const;

export const posModes = [
  { id: "general", label: "일반 포스" },
  { id: "keyband", label: "키밴드 정산" },
  { id: "online-postpaid", label: "온라인 후불" },
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

export const keybandPaymentMethods = ["신용 카드", "현금", "기타 결제"] as const;

export const keybandRows = [
  {
    id: "kb-1001",
    bandNo: "KB-1001",
    reservationNo: "RS000001",
    phone: "010-1234-1001",
    name: "이현우",
    time: "15:05",
    amount: "48,000원",
    status: "정산 가능",
    detail: "보드 대여 2건 · 음료 1건",
    items: [
      {
        id: "kb-1001-board",
        productName: "서핑장비",
        session: "10:00 ~ 20:00",
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
      {
        id: "kb-1001-towel",
        productName: "타월",
        session: "2026-05-01 ~ 2026-12-31",
        ticketName: "비치타올",
        price: "8,000원",
        quantity: 2,
      },
    ],
  },
  {
    id: "kb-1002",
    bandNo: "KB-1002",
    reservationNo: "RS000002",
    phone: "010-1234-1002",
    name: "김서연",
    time: "15:12",
    amount: "300,000원",
    status: "정산 가능",
    detail: "보드 20건 · 락커 1건",
    items: [
      {
        id: "kb-1002-board",
        productName: "서핑장비",
        session: "1세션 (1시간)",
        ticketName: "하드 보드 (숏)",
        price: "15,000원",
        quantity: 20,
      },
      {
        id: "kb-1002-locker",
        productName: "락커",
        session: "종일 (퇴장시 까지)",
        ticketName: "개인 락커",
        price: "3,000원",
        quantity: 1,
      },
    ],
  },
  {
    id: "kb-1003",
    bandNo: "KB-1003",
    reservationNo: "RS000003",
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
    reservationNo: "RS000004",
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
        session: "2026-01-01 ~ 2026-12-31",
        ticketName: "생수",
        price: "4,000원",
        quantity: 1,
      },
    ],
  },
  {
    id: "kb-1005",
    bandNo: "KB-1005",
    reservationNo: "RS000005",
    phone: "010-5555-0005",
    name: "공동 예약",
    time: "16:10",
    amount: "30,000원",
    status: "정산 가능",
    detail: "카바나 1건",
    items: [
      {
        id: "kb-1005-ticket",
        productName: "미오코스타 카바나",
        session: "오후권",
        ticketName: "카바나 일반",
        price: "30,000원",
        quantity: 1,
      },
    ],
  },
  {
    id: "kb-1006",
    bandNo: "KB-1006",
    reservationNo: "RS000005",
    phone: "010-5555-0005",
    name: "공동 예약",
    time: "16:10",
    amount: "15,000원",
    status: "정산 가능",
    detail: "락커 1건",
    items: [
      {
        id: "kb-1006-ticket",
        productName: "락커",
        session: "종일",
        ticketName: "프리미엄 락커",
        price: "15,000원",
        quantity: 1,
      },
    ],
  },
  {
    id: "kb-1007",
    bandNo: "KB-1007",
    reservationNo: "RS000005",
    phone: "010-5555-0005",
    name: "공동 예약",
    time: "16:10",
    amount: "12,000원",
    status: "정산 가능",
    detail: "타월 2건",
    items: [
      {
        id: "kb-1007-ticket",
        productName: "타월",
        session: "종일",
        ticketName: "비치 타월",
        price: "6,000원",
        quantity: 2,
      },
    ],
  },
] as const;

export const unmatchedKeybandTickets = [
  {
    id: "pending-kb-2001",
    sourceType: "모바일 티켓",
    qrCode: "MOBILE-QR-20260605-2001",
    reservationNo: "RS000005",
    phone: "010-8888-2001",
    name: "이서준",
    time: "15:33",
    amount: "81,000원",
    status: "키밴드 미발급",
    detail: "입장권 3매",
    items: [
      {
        id: "pending-kb-2001-board",
        productName: "입장권",
        session: "1세션 (1시간)",
        ticketName: "성인",
        price: "27,000원",
        quantity: 3,
      },
    ],
  },
  {
    id: "pending-kb-2003",
    sourceType: "모바일 티켓",
    qrCode: "MOBILE-QR-20260605-2003",
    reservationNo: "RS000007",
    phone: "010-9999-2003",
    name: "김하늘",
    time: "15:37",
    amount: "54,000원",
    status: "키밴드 미발급",
    detail: "입장권 2매",
    items: [
      {
        id: "pending-kb-2003-board",
        productName: "입장권",
        session: "2세션 (2시간)",
        ticketName: "성인",
        price: "27,000원",
        quantity: 2,
      },
    ],
  },
  {
    id: "pending-kb-2002",
    sourceType: "현장 발권",
    qrCode: "ONSITE-QR-20260605-2002",
    reservationNo: "RS000006",
    phone: "010-7777-2002",
    name: "최하은",
    time: "15:41",
    amount: "18,000원",
    status: "키밴드 미발급",
    detail: "입장권 1매",
    items: [
      {
        id: "pending-kb-2002-board",
        productName: "입장권",
        session: "2세션 (2시간)",
        ticketName: "소인",
        price: "18,000원",
        quantity: 1,
      },
    ],
  },
] as const;

export const keybandUsageRows = [
  {
    id: "usage-kb-2001",
    bandNo: "KB-2001",
    items: [
      {
        id: "usage-kb-2001-ticket-1",
        productName: "미오코스타존 (대인) 평일 입장권",
        session: "-",
        ticketName: "미오코스타(대인)",
        quantity: 2,
      },
    ],
  },
  {
    id: "usage-kb-2011",
    bandNo: "KB-2011",
    items: [
      {
        id: "usage-kb-2011-ticket-1",
        productName: "미오코스타존 (대인) 평일 입장권",
        session: "10:00 ~ 20:00",
        ticketName: "미오코스타(대인)",
        quantity: 2,
      },
      {
        id: "usage-kb-2011-ticket-2",
        productName: "구명자켓",
        session: "퇴장 시 까지",
        ticketName: "구명자켓",
        quantity: 2,
      },
    ],
  },
] as const;

export const availableKeybands = ["KB-2001", "KB-2002", "KB-2003", "KB-2004"] as const;
