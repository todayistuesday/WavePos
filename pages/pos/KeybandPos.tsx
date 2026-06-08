import { ChevronLeft, ChevronRight, Search, ShoppingCart, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { CheckoutPanel, type CheckoutItem } from "../../components/pos/CheckoutPanel";
import { availableKeybands, keybandPaymentMethods, keybandRows, unmatchedKeybandTickets } from "./posData";

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeScanValue(value: string) {
  return value.trim().toUpperCase();
}

function isValidKeybandFormat(value: string) {
  const match = /^KB-(\d{4})$/.exec(value);

  if (!match) {
    return false;
  }

  const keybandNumber = Number(match[1]);

  return keybandNumber >= 1 && keybandNumber <= 9999;
}

function isReturnedKeyband(row: KeybandRow) {
  return row.status === "결제 완료";
}

function getItemAmount(item: CheckoutItem) {
  return Number(item.amount.replace(/[^0-9]/g, "")) * item.quantity;
}

function getDisplayAmount(price: string, quantity: number) {
  return `${(Number(price.replace(/[^0-9]/g, "")) * quantity).toLocaleString()}원`;
}

type SourceKeybandRow = (typeof keybandRows)[number];
type KeybandRowItem = SourceKeybandRow["items"][number];
type KeybandRow = Omit<SourceKeybandRow, "status" | "items"> & {
  status: string;
  items: ReadonlyArray<KeybandRowItem>;
};
type PendingKeybandTicket = (typeof unmatchedKeybandTickets)[number];
type IssueBandField = {
  id: string;
  value: string;
};

function matchesIssuedRow(row: KeybandRow, query: string, queryDigits: string) {
  const matchesBandOrReservation = [row.bandNo, row.reservationNo].join(" ").toLowerCase().includes(query);
  const matchesFullPhone = queryDigits.length > 0 && normalizeDigits(row.phone) === queryDigits;

  return matchesBandOrReservation || matchesFullPhone;
}

function findPendingTicketByQuery(tickets: PendingKeybandTicket[], query: string, queryDigits: string) {
  if (!query && !queryDigits) {
    return null;
  }

  return (
    tickets.find((ticket) => {
      const exactTextMatch = [ticket.qrCode, ticket.reservationNo].some(
        (value) => value.toLowerCase() === query,
      );
      const exactPhoneMatch = queryDigits.length > 0 && normalizeDigits(ticket.phone) === queryDigits;

      return exactTextMatch || exactPhoneMatch;
    }) ?? null
  );
}

function getRequiredBandCount(ticket: PendingKeybandTicket) {
  const totalQuantity = ticket.items.reduce((sum, item) => sum + item.quantity, 0);

  return Math.max(totalQuantity, 1);
}

function createIssueBandFields(count: number): IssueBandField[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `issue-band-${index + 1}`,
    value: "",
  }));
}

function createIssuedRows(ticket: PendingKeybandTicket, bandNos: string[]): KeybandRow[] {
  const expandedItems = ticket.items.flatMap((item) =>
    Array.from({ length: item.quantity }, (_, index) => ({
      id: `${item.id}-${index + 1}`,
      productName: item.productName,
      session: item.session,
      ticketName: item.ticketName,
      price: item.price,
      quantity: 1,
    })),
  );

  return bandNos.map((bandNo, index) => {
    const assignedItem = expandedItems[index];

    return {
      id: `${ticket.id}-${bandNo.toLowerCase()}`,
      bandNo,
      reservationNo: ticket.reservationNo,
      phone: ticket.phone,
      name: ticket.name,
      time: ticket.time,
      amount: assignedItem?.price ?? "0원",
      status: "발급 완료",
      detail: assignedItem ? `${assignedItem.ticketName} 1매` : "추가 입장 매핑",
      items: assignedItem
        ? [assignedItem]
        : [
            {
              id: `${ticket.id}-extra-${index + 1}`,
              productName: "입장권",
              session: "현장 확인",
              ticketName: "추가 매핑",
              price: "0원",
              quantity: 1,
            },
          ],
    };
  });
}

function getIssueCustomerName(ticket: PendingKeybandTicket) {
  return ticket.sourceType === "현장 발권" ? "현장 방문 고객" : ticket.name;
}

function getIssueContact(ticket: PendingKeybandTicket) {
  return ticket.sourceType === "현장 발권" ? "" : ticket.phone;
}

export function KeybandPos() {
  const [keybandQuery, setKeybandQuery] = useState("");
  const [keybandCartItemIds, setKeybandCartItemIds] = useState<string[]>([]);
  const [issuedRows, setIssuedRows] = useState<KeybandRow[]>([]);
  const [issuedPendingTicketIds, setIssuedPendingTicketIds] = useState<string[]>([]);
  const [searchedRowIds, setSearchedRowIds] = useState<string[]>([]);
  const [issueTargetId, setIssueTargetId] = useState<string | null>(null);
  const [issueBandFields, setIssueBandFields] = useState<IssueBandField[]>([]);
  const [issueError, setIssueError] = useState("");

  const query = keybandQuery.trim().toLowerCase();
  const queryDigits = normalizeDigits(keybandQuery);

  const trackedRows = useMemo<KeybandRow[]>(() => [...issuedRows, ...keybandRows], [issuedRows]);

  const pendingTickets = useMemo(
    () => unmatchedKeybandTickets.filter((ticket) => !issuedPendingTicketIds.includes(ticket.id)),
    [issuedPendingTicketIds],
  );

  const filteredRows = useMemo(
    () => trackedRows.filter((row) => searchedRowIds.includes(row.id)),
    [trackedRows, searchedRowIds],
  );

  const pendingTicketMatch = useMemo(
    () => findPendingTicketByQuery(pendingTickets, query, queryDigits),
    [pendingTickets, query, queryDigits],
  );

  const groupedRows = useMemo(() => {
    return filteredRows.map((row) => ({
      ...row,
      inCart: row.items.every((item) => keybandCartItemIds.includes(item.id)),
    }));
  }, [filteredRows, keybandCartItemIds]);

  const currentIssueTarget = useMemo(
    () => pendingTickets.find((ticket) => ticket.id === issueTargetId) ?? null,
    [issueTargetId, pendingTickets],
  );

  const cartItems = useMemo<CheckoutItem[]>(() => {
    return keybandCartItemIds
      .map((id) => {
        const row = trackedRows.find((keybandRow) => keybandRow.items.some((item) => item.id === id));
        const item = row?.items.find((rowItem) => rowItem.id === id);

        if (!row || !item) {
          return null;
        }

        return {
          id: item.id,
          title: item.productName,
          time: item.session,
          detail: item.ticketName,
          amount: item.price,
          quantity: item.quantity,
          groupId: row.bandNo,
          groupLabel: row.bandNo,
        };
      })
      .filter((item): item is CheckoutItem => Boolean(item));
  }, [trackedRows, keybandCartItemIds]);

  const checkoutTotal = cartItems.reduce((sum, item) => sum + getItemAmount(item), 0);
  const checkoutQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shouldShowHistoryNav = groupedRows.length > 10;

  const openIssueModal = (ticketId: string) => {
    const ticket = pendingTickets.find((currentTicket) => currentTicket.id === ticketId);

    if (!ticket) {
      return;
    }

    setIssueTargetId(ticketId);
    setIssueBandFields(createIssueBandFields(getRequiredBandCount(ticket)));
    setIssueError("");
  };

  const closeIssueModal = () => {
    setIssueTargetId(null);
    setIssueBandFields([]);
    setIssueError("");
  };

  const handleAddToCart = (rowId: string) => {
    const row = trackedRows.find((keybandRow) => keybandRow.id === rowId);

    if (!row) {
      return;
    }

    setKeybandCartItemIds((current) => {
      const nextItemIds = row.items.map((item) => item.id).filter((itemId) => !current.includes(itemId));

      return [...current, ...nextItemIds];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setKeybandCartItemIds((current) => current.filter((currentItemId) => currentItemId !== itemId));
  };

  const handleRemoveGroupFromCart = (bandNo: string) => {
    setKeybandCartItemIds((current) => {
      const groupItemIds = trackedRows
        .filter((row) => row.bandNo === bandNo)
        .flatMap((row) => row.items.map((item) => item.id));

      return current.filter((currentItemId) => !groupItemIds.includes(currentItemId));
    });
  };

  const handleClearCart = () => {
    setKeybandCartItemIds([]);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query || queryDigits) {
      const matchedRowIds = trackedRows
        .filter((row) => matchesIssuedRow(row, query, queryDigits))
        .map((row) => row.id);

      if (matchedRowIds.length > 0) {
        setSearchedRowIds((current) => [
          ...current,
          ...matchedRowIds.filter((rowId) => !current.includes(rowId)),
        ]);
      }
    }

    if (pendingTicketMatch) {
      openIssueModal(pendingTicketMatch.id);
    }
  };

  const handleSearchReset = () => {
    setKeybandQuery("");
    setSearchedRowIds([]);
    closeIssueModal();
  };

  const handleRemoveFromHistory = (rowId: string) => {
    setSearchedRowIds((current) => current.filter((currentRowId) => currentRowId !== rowId));
  };

  const handleIssueSubmit = () => {
    if (!currentIssueTarget) {
      return;
    }

    const normalizedBandNos = issueBandFields.map((field) => normalizeScanValue(field.value));

    if (normalizedBandNos.some((bandNo) => !bandNo)) {
      setIssueError("모든 키밴드 입력칸을 스캔하거나, 필요 없는 칸은 제거해 주세요.");
      return;
    }

    if (new Set(normalizedBandNos).size !== normalizedBandNos.length) {
      setIssueError("같은 키밴드를 중복 매핑할 수 없습니다.");
      return;
    }

    const invalidBandNo = normalizedBandNos.find((bandNo) => !isValidKeybandFormat(bandNo));

    if (invalidBandNo) {
      setIssueError("등록된 보유 키밴드가 아닙니다");
      return;
    }

    const alreadyIssuedBandNo = normalizedBandNos.find((bandNo) =>
      trackedRows.some(
        (row) => normalizeScanValue(row.bandNo) === bandNo && !isReturnedKeyband(row),
      ),
    );

    if (alreadyIssuedBandNo) {
      setIssueError("이미 사용 중인 키 밴드 입니다.");
      return;
    }

    const missingBandNo = normalizedBandNos.find(
      (bandNo) => !availableKeybands.some((availableBandNo) => normalizeScanValue(availableBandNo) === bandNo),
    );

    if (missingBandNo) {
      setIssueError("등록된 보유 키밴드가 아닙니다");
      return;
    }

    const nextIssuedRows = createIssuedRows(currentIssueTarget, normalizedBandNos);

    setIssuedRows((current) => [...nextIssuedRows, ...current]);
    setIssuedPendingTicketIds((current) => [...current, currentIssueTarget.id]);
    setKeybandQuery(currentIssueTarget.reservationNo);
    setSearchedRowIds((current) => [
      ...nextIssuedRows.map((row) => row.id),
      ...current.filter((rowId) => !nextIssuedRows.some((row) => row.id === rowId)),
    ]);
    closeIssueModal();
  };

  return (
    <>
      <main className="keyband-main">
        <section className="keyband-left">
          <section className="panel keyband-panel keyband-panel--search">
            <div className="panel__header">
              <h2>키 밴드 조회 및 발급</h2>
            </div>

            <form className="keyband-search" onSubmit={handleSearchSubmit}>
              <div className="keyband-search__field">
                <Search size={18} />
                <input
                  type="text"
                  value={keybandQuery}
                  placeholder="키 밴드 스캔 (번호 입력), 예약 번호, 휴대폰 번호로 조회  ※ 키 밴드 발급은 모바일 티켓 또는 현장 QR 코드 스캔"
                  onChange={(event) => setKeybandQuery(event.target.value)}
                />
              </div>
              <button type="submit" className="keyband-search__button">
                조회
              </button>
              <button type="button" className="keyband-search__button keyband-search__button--reset" onClick={handleSearchReset}>
                초기화
              </button>
            </form>

            <div className="keyband-search__meta">
              총 {groupedRows.length}건 조회됨
            </div>
          </section>

          <section className="panel keyband-panel keyband-panel--list">
            <div className="panel__header panel__header--inline">
              <h2>조회 내역 리스트</h2>
              <span className="panel__copy">조회 결과가 있는 상태에서 조회 시 내역 리스트에 추가 표시 됩니다.</span>
              {shouldShowHistoryNav ? (
                <div className="panel__nav">
                  <button type="button" aria-label="이전 내역">
                    <ChevronLeft size={30} strokeWidth={2.2} />
                  </button>
                  <button type="button" aria-label="다음 내역">
                    <ChevronRight size={30} strokeWidth={2.2} />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="keyband-table" role="table" aria-label="키밴드 조회 내역">
              <div className="keyband-table__head" role="row">
                <span>예약번호</span>
                <span>키밴드</span>
                <div className="keyband-table__itemHead">
                  <span>상품</span>
                  <span>회차</span>
                  <span>권종</span>
                  <span>가격</span>
                  <span>수량</span>
                  <span>결제 금액</span>
                </div>
                <span>동작</span>
              </div>

              <div className="keyband-table__body">
                {groupedRows.map((row) => {
                  return (
                    <div key={row.id} className="keyband-row" role="row">
                      <span>{row.reservationNo}</span>
                      <span>{row.bandNo}</span>
                      <div className="keyband-row__items">
                        {row.items.map((item) => (
                          <div key={item.id} className="keyband-row__item">
                            <span>{item.productName}</span>
                            <span>{item.session}</span>
                            <span>{item.ticketName}</span>
                            <span>{item.price}</span>
                            <span>{item.quantity}</span>
                            <span>{getDisplayAmount(item.price, item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="keyband-row__actions">
                        <button
                          type="button"
                          className={`keyband-row__add${row.inCart ? " is-active" : ""}`}
                          onClick={() => handleAddToCart(row.id)}
                          disabled={row.inCart}
                          aria-label={row.inCart ? "장바구니에 담김" : "장바구니에 담기"}
                          title={row.inCart ? "장바구니에 담김" : "장바구니에 담기"}
                        >
                          <ShoppingCart size={16} />
                        </button>
                        <button
                          type="button"
                          className="keyband-row__remove"
                          onClick={() => handleRemoveFromHistory(row.id)}
                          aria-label="조회 내역에서 제거"
                          title="조회 내역에서 제거"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {groupedRows.length === 0 ? (
                  <div className="keyband-empty">조회된 키밴드 정산 건이 없습니다.</div>
                ) : null}
              </div>
            </div>
          </section>
        </section>

        <CheckoutPanel
          checkoutLabel={`총 ${checkoutQuantity}매 ${checkoutTotal.toLocaleString()}원 결제하기`}
          items={cartItems}
          locked
          onClear={handleClearCart}
          onRemoveItem={handleRemoveFromCart}
          onRemoveGroup={handleRemoveGroupFromCart}
          paymentMethods={keybandPaymentMethods}
          defaultFocusedPaymentMethod="신용 카드"
          showDiscountActions={false}
          allowClearWhenLocked
          allowItemRemovalWhenLocked
        />
      </main>

      {currentIssueTarget ? (
        <div className="keyband-issue" role="dialog" aria-modal="true" aria-labelledby="keyband-issue-title">
          <div className="keyband-issue__backdrop" onClick={closeIssueModal} />
          <section className="keyband-issue__panel">
            <div className="keyband-issue__header">
              <div>
                <strong id="keyband-issue-title">키밴드 발급</strong>
              </div>
              <button type="button" className="keyband-issue__close" onClick={closeIssueModal} aria-label="팝업 닫기">
                <X size={18} />
              </button>
            </div>

            <div className="keyband-issue__summary">
              <div className="keyband-issue__summaryRow">
                <span>예약번호</span>
                <strong>{currentIssueTarget.reservationNo}</strong>
                <span>QR 코드</span>
                <strong className="keyband-issue__qrCode">{currentIssueTarget.qrCode}</strong>
              </div>
              <div className="keyband-issue__summaryRow">
                <span>고객명</span>
                <strong>{getIssueCustomerName(currentIssueTarget)}</strong>
                <span>고객 연락처</span>
                <strong>{getIssueContact(currentIssueTarget)}</strong>
              </div>
              <div>
                <div className="keyband-issue__items" role="table" aria-label="상품 요약">
                  <div className="keyband-issue__itemsHead" role="row">
                    <span>상품명</span>
                    <span>회차</span>
                    <span>권종명</span>
                    <span>수량</span>
                  </div>
                  <div className="keyband-issue__itemsBody">
                    {currentIssueTarget.items.map((item) => (
                      <div key={item.id} className="keyband-issue__itemsRow" role="row">
                        <span>{item.productName}</span>
                        <span>{item.session}</span>
                        <span>{item.ticketName}</span>
                        <span>{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="keyband-issue__field">
              <div className="keyband-issue__fieldHead">
                <span>보유 키밴드 스캔</span>
                <div className="keyband-issue__fieldActions">
                  <button
                    type="button"
                    className="keyband-issue__ghost"
                    onClick={() =>
                      setIssueBandFields((current) => [
                        ...current,
                        { id: `issue-band-${current.length + 1}`, value: "" },
                      ])
                    }
                  >
                    키밴드 추가
                  </button>
                  <button
                    type="button"
                    className="keyband-issue__ghost"
                    onClick={() =>
                      setIssueBandFields((current) =>
                        current.length > 1 ? current.slice(0, -1) : current,
                      )
                    }
                    disabled={issueBandFields.length <= 1}
                  >
                    마지막 제거
                  </button>
                </div>
              </div>

              <div className="keyband-issue__fieldList">
                {issueBandFields.map((field, index) => (
                  <label key={field.id} className="keyband-issue__slot">
                    <span>키밴드 {index + 1}</span>
                    <input
                      type="text"
                      value={field.value}
                      placeholder={`예: KB-20${String(index + 1).padStart(2, "0")}`}
                      onChange={(event) => {
                        const nextValue = event.target.value;

                        setIssueBandFields((current) =>
                          current.map((currentField) =>
                            currentField.id === field.id
                              ? { ...currentField, value: nextValue }
                              : currentField,
                          ),
                        );

                        if (issueError) {
                          setIssueError("");
                        }
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="keyband-issue__hint">
              기본 {getRequiredBandCount(currentIssueTarget)}개가 준비되며, 현장 상황에 따라 키밴드 칸을 추가하거나 제거할 수 있습니다.
            </div>

            {issueError ? <div className="keyband-issue__error">{issueError}</div> : null}

            <div className="keyband-issue__actions">
              <button type="button" className="keyband-issue__secondary" onClick={closeIssueModal}>
                취소
              </button>
              <button type="button" className="keyband-issue__primary" onClick={handleIssueSubmit}>
                매핑 후 발급
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
