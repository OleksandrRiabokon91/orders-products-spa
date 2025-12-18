import { OrdersRes } from "@/lib/api";
import css from "./OrderCard.module.css";
// import { deleteOrder } from "@/lib/client_api";

interface Props {
  order: OrdersRes;
  isCollapsed?: boolean; // на будущее
  isActive?: boolean; // этот ордер открыт сейчас
  onOpenDetails?: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function OrderCard({
  order,
  isCollapsed = false,
  isActive = false,
  onOpenDetails,
  onDelete,
}: Props) {
  return (
    <li className={css.card_box} data-order-id={order.id}>
      {!isCollapsed && <h3>{order.title}</h3>}

      <button
        type="button"
        aria-label="Открыть детали прихода"
        onClick={() => onOpenDetails?.(order.id)}
      >
        <svg width="16" height="16" aria-hidden>
          <use href="/sprite.svg#icon-burger" />
        </svg>
      </button>
      <div>
        <div>
          <strong>{order.productsCount}</strong>
          <span>Продукта</span>
        </div>
        <div>
          <time dateTime={order.date}>{order.date}</time>
          <span> / </span>
          <time>{order.formattedDate}</time>
        </div>
      </div>

      {!isCollapsed && (
        <div>
          <div>
            <span>USD:</span>
            <strong>{order.totalUSD}</strong>
          </div>
          <div>
            <span>UAH:</span>
            <strong>{order.totalUAH}</strong>
          </div>
        </div>
      )}
      {!isCollapsed && (
        <button onClick={() => onDelete(order.id)}>
          <svg width="16" height="16">
            <use href="/sprite.svg#icon-bin" />
          </svg>
        </button>
      )}

      {isActive && (
        <svg width="16" height="16">
          <use href="/sprite.svg#icon-circle-right" />
        </svg>
      )}
    </li>
  );
}
