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
  { id: "package-same-date", label: "동일 일자 패키지" },
  { id: "package-per-product-date", label: "상품별 일자 패키지" },
  { id: "package-lesson-suit-board", label: "레슨 1단계 + 슈트 + 보드 패키지" },
  { id: "package-miocosta-lifejacket", label: "미오코스타 + 구명조끼 패키지" },
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
export const packageScheduleConfigs = {
  "package-same-date": {
    mode: "same-date",
    items: [
      {
        id: "package-item-1",
        kind: "schedule",
        productName: "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세",
        options: [
          {
            id: "package-item-1-0900",
            title: "09:00 ~ 10:00",
            rows: [["정원", "30"], ["발권", "12"], ["잔여", "18"], ["온라인 잔여", "5"]],
          },
          {
            id: "package-item-1-1100",
            title: "11:00 ~ 12:00",
            rows: [["정원", "30"], ["발권", "20"], ["잔여", "10"], ["온라인 잔여", "3"]],
          },
        ],
      },
      {
        id: "package-item-2",
        kind: "schedule",
        productName: "구성상품 2",
        options: [
          {
            id: "package-item-2-1000",
            title: "10:00 ~ 11:00",
            rows: [["정원", "24"], ["발권", "8"], ["잔여", "16"], ["온라인 잔여", "4"]],
          },
          {
            id: "package-item-2-1400",
            title: "14:00 ~ 15:00",
            rows: [["정원", "24"], ["발권", "19"], ["잔여", "5"], ["온라인 잔여", "1"]],
          },
        ],
      },
      {
        id: "package-item-3",
        kind: "schedule",
        productName: "구성상품 3",
        options: [
          {
            id: "package-item-3-1200",
            title: "12:00 ~ 13:00",
            rows: [["정원", "18"], ["발권", "7"], ["잔여", "11"], ["온라인 잔여", "2"]],
          },
          {
            id: "package-item-3-1600",
            title: "16:00 ~ 17:00",
            rows: [["정원", "18"], ["발권", "13"], ["잔여", "5"], ["온라인 잔여", "1"]],
          },
        ],
      },
      {
        id: "package-item-4",
        kind: "schedule",
        productName: "구성상품 4",
        options: [
          {
            id: "package-item-4-1800",
            title: "18:00 ~ 19:00",
            rows: [["정원", "12"], ["발권", "3"], ["잔여", "9"], ["온라인 잔여", "2"]],
          },
          {
            id: "package-item-4-1930",
            title: "19:30 ~ 20:30",
            rows: [["정원", "12"], ["발권", "8"], ["잔여", "4"], ["온라인 잔여", "1"]],
          },
        ],
      },
    ],
  },
  "package-per-product-date": {
    mode: "per-product-date",
    items: [
      {
        id: "package-date-item-1",
        kind: "schedule",
        productName: "구성상품 1",
        options: [
          {
            id: "package-date-item-1-0900",
            title: "09:00 ~ 10:00",
            rows: [["정원", "20"], ["발권", "9"], ["잔여", "11"], ["온라인 잔여", "2"]],
          },
          {
            id: "package-date-item-1-1300",
            title: "13:00 ~ 14:00",
            rows: [["정원", "20"], ["발권", "14"], ["잔여", "6"], ["온라인 잔여", "1"]],
          },
        ],
      },
      {
        id: "package-date-item-2",
        kind: "schedule",
        productName: "구성상품 2",
        options: [
          {
            id: "package-date-item-2-1000",
            title: "10:00 ~ 11:00",
            rows: [["정원", "18"], ["발권", "6"], ["잔여", "12"], ["온라인 잔여", "3"]],
          },
          {
            id: "package-date-item-2-1500",
            title: "15:00 ~ 16:00",
            rows: [["정원", "18"], ["발권", "11"], ["잔여", "7"], ["온라인 잔여", "2"]],
          },
        ],
      },
      {
        id: "package-date-item-3",
        kind: "schedule",
        productName: "구성상품 3",
        options: [
          {
            id: "package-date-item-3-1100",
            title: "11:00 ~ 12:00",
            rows: [["정원", "16"], ["발권", "5"], ["잔여", "11"], ["온라인 잔여", "4"]],
          },
          {
            id: "package-date-item-3-1700",
            title: "17:00 ~ 18:00",
            rows: [["정원", "16"], ["발권", "10"], ["잔여", "6"], ["온라인 잔여", "1"]],
          },
        ],
      },
      {
        id: "package-date-item-4",
        kind: "schedule",
        productName: "구성상품 4",
        options: [
          {
            id: "package-date-item-4-1800",
            title: "18:00 ~ 19:00",
            rows: [["정원", "14"], ["발권", "4"], ["잔여", "10"], ["온라인 잔여", "3"]],
          },
        ],
      },
    ],
  },
  "package-lesson-suit-board": {
    mode: "period-schedule",
    periodLabel: "이용 기간",
    periodValue: "2026-07-01 ~ 2026-12-31",
    items: [
      {
        id: "lesson-package-item-1",
        kind: "schedule",
        productName: "레슨 1단계",
        options: [
          {
            id: "lesson-package-item-1-1000",
            title: "10:00 ~ 11:00",
            rows: [["정원", "16"], ["발권", "6"], ["잔여", "10"], ["온라인 잔여", "2"]],
          },
          {
            id: "lesson-package-item-1-1500",
            title: "15:00 ~ 16:00",
            rows: [["정원", "16"], ["발권", "9"], ["잔여", "7"], ["온라인 잔여", "1"]],
          },
        ],
      },
      {
        id: "lesson-package-item-2",
        kind: "period",
        productName: "슈트",
        options: [
          {
            id: "lesson-package-item-2-all-day",
            title: "기간 상품",
            rows: [["정원", "-"], ["발권", "11"], ["잔여", "-"], ["온라인 잔여", "-"]],
          },
        ],
      },
      {
        id: "lesson-package-item-3",
        kind: "period",
        productName: "보드",
        options: [
          {
            id: "lesson-package-item-3-all-day",
            title: "기간 상품",
            rows: [["정원", "100"], ["발권", "4"], ["잔여", "96"], ["온라인 잔여", "96"]],
          },
        ],
      },
      {
        id: "lesson-package-item-4",
        kind: "period",
        productName: "구성상품 4",
        options: [
          {
            id: "lesson-package-item-4-all-day",
            title: "기간 상품",
            rows: [["정원", "100"], ["발권", "8"], ["잔여", "92"], ["온라인 잔여", "92"]],
          },
        ],
      },
    ],
  },
  "package-miocosta-lifejacket": {
    mode: "period-schedule",
    periodLabel: "이용 기간",
    periodValue: "2026-07-01 ~ 2026-12-31",
    items: [
      {
        id: "miocosta-package-item-1",
        kind: "period",
        productName: "미오코스타",
        options: [
          {
            id: "miocosta-package-item-1-all-day",
            title: "기간 상품",
            rows: [["정원", "80"], ["발권", "26"], ["잔여", "54"], ["온라인 잔여", "54"]],
          },
        ],
      },
      {
        id: "miocosta-package-item-2",
        kind: "period",
        productName: "구명조끼",
        options: [
          {
            id: "miocosta-package-item-2-all-day",
            title: "기간 상품",
            rows: [["정원", "-"], ["발권", "18"], ["잔여", "-"], ["온라인 잔여", "-"]],
          },
        ],
      },
      {
        id: "miocosta-package-item-3",
        kind: "period",
        productName: "구성상품 3",
        options: [
          {
            id: "miocosta-package-item-3-all-day",
            title: "기간 상품",
            rows: [["정원", "40"], ["발권", "12"], ["잔여", "28"], ["온라인 잔여", "28"]],
          },
        ],
      },
      {
        id: "miocosta-package-item-4",
        kind: "period",
        productName: "구성상품 4",
        options: [
          {
            id: "miocosta-package-item-4-all-day",
            title: "기간 상품",
            rows: [["정원", "40"], ["발권", "21"], ["잔여", "19"], ["온라인 잔여", "19"]],
          },
        ],
      },
    ],
  },
} as const;

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

const generatedAvailableKeybands = Array.from({ length: 99 }, (_, index) => {
  const keybandNumber = String(1001 + index).padStart(4, "0");

  return `KB-${keybandNumber}`;
});

export const availableKeybands = [...generatedAvailableKeybands, "KB-2001", "KB-2002", "KB-2003", "KB-2004"] as const;
