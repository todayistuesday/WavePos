import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export type CheckoutItem = {
  id: string;
  title: string;
  time: string;
  detail: string;
  amount: string;
  quantity: number;
  groupId?: string;
  groupLabel?: string;
};

interface CheckoutPanelProps {
  checkoutLabel: string;
  items: CheckoutItem[];
  locked: boolean;
  onClear: () => void;
  onRemoveItem?: (itemId: string) => void;
  onRemoveGroup?: (groupId: string) => void;
  paymentMethods: readonly string[];
  defaultFocusedPaymentMethod?: string;
  showDiscountActions?: boolean;
  allowClearWhenLocked?: boolean;
  allowItemRemovalWhenLocked?: boolean;
  onPaymentMethodChange?: (method: string) => void;
  onPay?: (paymentMethod: string) => void;
}

export function CheckoutPanel({
  checkoutLabel,
  items,
  locked,
  onClear,
  onRemoveItem,
  onRemoveGroup,
  paymentMethods,
  defaultFocusedPaymentMethod,
  showDiscountActions = true,
  allowClearWhenLocked = false,
  allowItemRemovalWhenLocked = false,
  onPaymentMethodChange,
  onPay,
}: CheckoutPanelProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    defaultFocusedPaymentMethod && paymentMethods.includes(defaultFocusedPaymentMethod)
      ? defaultFocusedPaymentMethod
      : paymentMethods[0] ?? "",
  );

  useEffect(() => {
    setSelectedPaymentMethod(
      defaultFocusedPaymentMethod && paymentMethods.includes(defaultFocusedPaymentMethod)
        ? defaultFocusedPaymentMethod
        : paymentMethods[0] ?? "",
    );
  }, [defaultFocusedPaymentMethod, paymentMethods]);

  useEffect(() => {
    if (selectedPaymentMethod) {
      onPaymentMethodChange?.(selectedPaymentMethod);
    }
  }, [onPaymentMethodChange, selectedPaymentMethod]);

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.amount.replace(/[^0-9]/g, "")) * item.quantity,
    0,
  );
  const clearDisabled = locked && !allowClearWhenLocked;
  const itemGroups = items.reduce<Array<{ id: string; label?: string; items: CheckoutItem[] }>>((groups, item) => {
    const groupId = item.groupId ?? item.id;
    const lastGroup = groups[groups.length - 1];

    if (lastGroup?.id === groupId) {
      lastGroup.items.push(item);
      return groups;
    }

    groups.push({
      id: groupId,
      label: item.groupLabel,
      items: [item],
    });

    return groups;
  }, []);

  return (
    <aside className="pos-right">
      <section className="checkout">
        <div className="checkout__header">
          <h2>선택 내역</h2>
          <button
            className="checkout__clear"
            type="button"
            onClick={onClear}
            disabled={clearDisabled}
            aria-disabled={clearDisabled}
          >
            <Trash2 size={20} />
            전체삭제
          </button>
        </div>

        <div className="checkout__body">
          {items.length === 0 ? (
            <div className="checkout__empty">현재 선택 내역에 등록된 상품이 없습니다.</div>
          ) : (
            <div className="checkout__items" role="list" aria-label="선택 내역">
              {itemGroups.map((group) => (
                <section key={group.id} className="checkout__group" role="listitem" aria-label={group.label ?? group.id}>
                  {group.label ? (
                    <div className="checkout__groupHeader">
                      <strong className="checkout__groupLabel">{group.label}</strong>
                      <button
                        type="button"
                        className="checkout__groupRemove"
                        onClick={() => onRemoveGroup?.(group.id)}
                        disabled={!onRemoveGroup || (locked && !allowItemRemovalWhenLocked)}
                        aria-disabled={!onRemoveGroup || (locked && !allowItemRemovalWhenLocked)}
                        aria-label={`${group.label} 전체 제거`}
                        title={`${group.label} 전체 제거`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : null}

                  <div className="checkout__groupItems">
                    {group.items.map((item) => (
                      <article key={item.id} className="checkout__item">
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
                              -
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
                            onClick={() => onRemoveItem?.(item.id)}
                            disabled={!onRemoveItem || (locked && !allowItemRemovalWhenLocked)}
                            aria-disabled={!onRemoveItem || (locked && !allowItemRemovalWhenLocked)}
                            aria-label="삭제"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

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

        {showDiscountActions ? (
          <div className="checkout__actions">
            <button type="button" className="action-outline">
              현장 발권
            </button>
            <button type="button" className="action-outline">
              할인
            </button>
          </div>
        ) : null}

        <div className="checkout__methods">
          {paymentMethods.map((method) => (
            <button
              key={method}
              type="button"
              className={`method-button${method === selectedPaymentMethod ? " is-active" : ""}`}
              autoFocus={method === defaultFocusedPaymentMethod}
              aria-pressed={method === selectedPaymentMethod}
              onClick={() => setSelectedPaymentMethod(method)}
            >
              {method}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="checkout__pay"
          onClick={() => onPay?.(selectedPaymentMethod)}
        >
          {checkoutLabel}
        </button>
      </section>
    </aside>
  );
}
