import { Trash2 } from "lucide-react";

export type CheckoutItem = {
  id: string;
  title: string;
  time: string;
  detail: string;
  amount: string;
  quantity: number;
};

interface CheckoutPanelProps {
  checkoutLabel: string;
  items: CheckoutItem[];
  locked: boolean;
  onClear: () => void;
  paymentMethods: readonly string[];
}

export function CheckoutPanel({ checkoutLabel, items, locked, onClear, paymentMethods }: CheckoutPanelProps) {
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.amount.replace(/[^0-9]/g, "")) * item.quantity,
    0,
  );

  return (
    <aside className="pos-right">
      <section className="checkout">
        <div className="checkout__header">
          <h2>선택 내역</h2>
          <button
            className="checkout__clear"
            type="button"
            onClick={onClear}
            disabled={locked}
            aria-disabled={locked}
          >
            <Trash2 size={20} />
            전체삭제
          </button>
        </div>

        {items.length === 0 ? (
          <div className="checkout__empty">현재 선택 내역에 등록된 상품이 없습니다.</div>
        ) : (
          <div className="checkout__items" role="list" aria-label="선택 내역">
            {items.map((item) => (
              <article key={item.id} className="checkout__item" role="listitem">
                <div className="checkout__itemHead">
                  <strong>{item.title}</strong>
                  <span className="checkout__itemTime">{item.time}</span>
                </div>

                <div className="checkout__itemBody">
                  <span className="checkout__itemDetail">{item.detail}</span>
                  <strong className="checkout__itemAmount">{item.amount}</strong>
                </div>

                <div className="checkout__itemControls">
                  <div className="checkout__qtyGroup" aria-label="수량">
                    <button
                      type="button"
                      className="checkout__qtyButton"
                      disabled={locked}
                      aria-disabled={locked}
                    >
                      −
                    </button>
                    <span className="checkout__qtyValue">{item.quantity}</span>
                    <button
                      type="button"
                      className="checkout__qtyButton"
                      disabled={locked}
                      aria-disabled={locked}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="checkout__deleteButton"
                    disabled={locked}
                    aria-disabled={locked}
                    aria-label="삭제"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <dl className="checkout__summary">
          <div>
            <dt>주문 금액</dt>
            <dd>{totalAmount.toLocaleString()} 원</dd>
          </div>
          <div>
            <dt>할인금액</dt>
            <dd>0 원</dd>
          </div>
          <div className="checkout__received">
            <dt>받은 금액</dt>
            <dd>
              <input type="text" value={totalAmount.toLocaleString()} readOnly />
            </dd>
          </div>
          <div>
            <dt>거스름돈</dt>
            <dd>0 원</dd>
          </div>
        </dl>

        <div className="checkout__actions">
          <button type="button" className="action-outline">
            낱장 발권
          </button>
          <button type="button" className="action-outline">
            할인
          </button>
        </div>

        <div className="checkout__methods">
          {paymentMethods.map((method) => (
            <button key={method} type="button" className="method-button">
              {method}
            </button>
          ))}
        </div>

        <button type="button" className="checkout__pay">
          {checkoutLabel}
        </button>
      </section>
    </aside>
  );
}
