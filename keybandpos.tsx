import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { CheckoutPanel, type CheckoutItem } from "./posShared";
import { generalPaymentMethods, keybandRows } from "./posData";

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function getItemAmount(item: CheckoutItem) {
  return Number(item.amount.replace(/[^0-9]/g, "")) * item.quantity;
}

export function KeybandPos() {
  const [keybandQuery, setKeybandQuery] = useState("");
  const [keybandCartItemIds, setKeybandCartItemIds] = useState<string[]>([]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = keybandQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return keybandRows;
    }

    const normalizedQueryDigits = normalizeDigits(normalizedQuery);

    return keybandRows.filter((row) => {
      const matchesBandOrReservation = [row.bandNo, row.reservationNo]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFullPhone =
        normalizedQueryDigits.length > 0 && normalizeDigits(row.phone) === normalizedQueryDigits;

      return matchesBandOrReservation || matchesFullPhone;
    });
  }, [keybandQuery]);

  const productRows = useMemo(() => {
    return filteredRows.flatMap((row) =>
      row.items.map((item) => ({
        ...item,
        bandNo: row.bandNo,
        name: row.name,
        status: row.status,
        inCart: keybandCartItemIds.includes(item.id),
      })),
    );
  }, [filteredRows, keybandCartItemIds]);

  const cartItems = useMemo<CheckoutItem[]>(() => {
    return keybandCartItemIds
      .map((id) => {
        const row = keybandRows.find((keybandRow) => keybandRow.items.some((item) => item.id === id));
        const item = row?.items.find((rowItem) => rowItem.id === id);

        if (!row || !item) {
          return null;
        }

        return {
          id: item.id,
          title: `${item.productName} · ${row.bandNo} · ${row.name}`,
          time: item.session,
          detail: item.ticketName,
          amount: item.price,
          quantity: item.quantity,
        };
      })
      .filter((item): item is CheckoutItem => Boolean(item));
  }, [keybandCartItemIds]);

  const checkoutTotal = cartItems.reduce((sum, item) => sum + getItemAmount(item), 0);
  const checkoutQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (itemId: string) => {
    setKeybandCartItemIds((current) => (current.includes(itemId) ? current : [...current, itemId]));
  };

  return (
    <main className="keyband-main">
      <section className="keyband-left">
        <section className="panel keyband-panel keyband-panel--search">
          <div className="panel__header">
            <h2>키밴드 조회</h2>
            <div className="panel__nav">
              <button type="button" aria-label="이전 조회">
                <ChevronLeft size={30} strokeWidth={2.2} />
              </button>
              <button type="button" aria-label="다음 조회">
                <ChevronRight size={30} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <form
            className="keyband-search"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="keyband-search__field">
              <Search size={18} />
              <input
                type="text"
                value={keybandQuery}
                placeholder="키밴드 번호, 예매번호, 전체 전화번호로 조회"
                onChange={(event) => setKeybandQuery(event.target.value)}
              />
            </div>
            <button type="submit" className="keyband-search__button">
              조회
            </button>
          </form>

          <div className="keyband-search__meta">총 {productRows.length}건 조회됨</div>
        </section>

        <section className="panel keyband-panel keyband-panel--list">
          <div className="panel__header panel__header--inline">
            <h2>조회 내역 리스트</h2>
            <span className="panel__copy">정산 내역 확인 · 장바구니 담기</span>
            <div className="panel__nav">
              <button type="button" aria-label="이전 내역">
                <ChevronLeft size={30} strokeWidth={2.2} />
              </button>
              <button type="button" aria-label="다음 내역">
                <ChevronRight size={30} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <div className="keyband-table" role="table" aria-label="키밴드 조회 내역">
            <div className="keyband-table__head" role="row">
              <span>키밴드</span>
              <span>이용자</span>
              <span>상품명</span>
              <span>회차</span>
              <span>권종명</span>
              <span>가격</span>
              <span>수량</span>
              <span>상태</span>
              <span>장바구니</span>
            </div>

            <div className="keyband-table__body">
              {productRows.map((row) => {
                return (
                  <div key={row.id} className="keyband-row" role="row">
                    <span>{row.bandNo}</span>
                    <span>{row.name}</span>
                    <span>{row.productName}</span>
                    <span>{row.session}</span>
                    <span>{row.ticketName}</span>
                    <span>{row.price}</span>
                    <span>{row.quantity}</span>
                    <span>
                      <em className="keyband-status">{row.status}</em>
                    </span>
                    <button
                      type="button"
                      className={`keyband-row__add${row.inCart ? " is-active" : ""}`}
                      onClick={() => handleAddToCart(row.id)}
                      disabled={row.inCart}
                    >
                      <Plus size={16} />
                      {row.inCart ? "담김" : "담기"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </section>

      <CheckoutPanel
        checkoutLabel={`총 ${checkoutQuantity}매 ${checkoutTotal.toLocaleString()}원 결제하기`}
        items={cartItems}
        locked
        onClear={() => setKeybandCartItemIds([])}
        paymentMethods={generalPaymentMethods}
      />
    </main>
  );
}
