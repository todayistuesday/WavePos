import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export type CheckoutItem = {
  id: string;
  title: string;
  time?: string;
  detail: string;
  amount: string;
  quantity: number;
  discountAmount?: number;
  discountLabel?: string;
  packageDetails?: string[];
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
  const packageItemIds = useMemo(
    () =>
      items
        .filter((item) => item.packageDetails && item.packageDetails.length > 0)
        .map((item) => item.id),
    [items],
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    defaultFocusedPaymentMethod && paymentMethods.includes(defaultFocusedPaymentMethod)
      ? defaultFocusedPaymentMethod
      : paymentMethods[0] ?? "",
  );
  const [expandedPackageItemIds, setExpandedPackageItemIds] = useState<string[]>(packageItemIds);

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

  useEffect(() => {
    setExpandedPackageItemIds((current) =>
      Array.from(new Set([...packageItemIds, ...current.filter((itemId) => packageItemIds.includes(itemId))])),
    );
  }, [packageItemIds]);

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.amount.replace(/[^0-9]/g, "")) * item.quantity,
    0,
  );
  const totalDiscountAmount = items.reduce(
    (sum, item) => sum + (item.discountAmount ?? 0) * item.quantity,
    0,
  );
  const payableAmount = Math.max(totalAmount - totalDiscountAmount, 0);
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

  const togglePackageDetails = (itemId: string) => {
    setExpandedPackageItemIds((current) =>
      current.includes(itemId)
        ? current.filter((currentItemId) => currentItemId !== itemId)
        : [...current, itemId],
    );
  };

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
                      <div className="checkout__groupMeta">
                        <strong className="checkout__groupLabel">{group.label}</strong>
                        <span className="checkout__groupCount">{`${group.items.length}건`}</span>
                      </div>
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
                        <article
                          key={item.id}
                          className={`checkout__item${expandedPackageItemIds.includes(item.id) ? " is-expanded" : ""}`}
                        >
                          <div className="checkout__itemHead">
                            <strong>{item.title}</strong>
                          </div>

                        {item.time && (
                          <div className="checkout__itemMeta">
                            <span className="checkout__itemTime">{item.time}</span>
                          </div>
                        )}

                        <div className="checkout__itemBody">
                          <span className="checkout__itemDetail">{item.detail}</span>
                          <strong className="checkout__itemAmount">{item.amount}</strong>
                        </div>

                        {item.packageDetails && item.packageDetails.length > 0 ? (
                          <div className="checkout__itemPackageWrap">
                            <button
                              type="button"
                              className="checkout__itemPackageToggle"
                              onClick={() => togglePackageDetails(item.id)}
                              aria-expanded={expandedPackageItemIds.includes(item.id)}
                            >
                              {expandedPackageItemIds.includes(item.id) ? "구성 상세 접기" : "구성 상세 더보기"}
                            </button>

                            {expandedPackageItemIds.includes(item.id) ? (
                              <div className="checkout__itemPackage">
                                {item.packageDetails.map((packageDetail) => (
                                  <div key={packageDetail} className="checkout__itemPackageRow">
                                    {packageDetail}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {item.discountLabel ? (
                          <div className="checkout__itemDiscount">{`할인 : ${item.discountLabel}`}</div>
                        ) : null}

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
            <dd>{totalDiscountAmount.toLocaleString()} 원</dd>
          </div>
          <div className="checkout__received">
            <dt>받은 금액</dt>
            <dd>
              <input type="text" value={payableAmount.toLocaleString()} readOnly />
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
