import { OrdersRes } from "@/lib/api";
import css from "./OrderCard.module.css";

interface Props {
  order: OrdersRes;
  isCollapsed?: boolean;
  isActive?: boolean;
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
  function formatDate(date: string, mode: "numeric" | "text") {
    const d = new Date(date);

    const day = d.toLocaleString("en-US", { day: "2-digit" });
    const year = d.getFullYear();

    const month =
      mode === "numeric"
        ? d.toLocaleString("en-US", { month: "2-digit" })
        : d.toLocaleString("en-US", { month: "short" });

    return `${day} / ${month} / ${year}`;
  }
  const handleOpen = () => {
    onOpenDetails?.(order.id);
  };
  const formatAmount = (value: string | number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(Number(value))
      .replace(/,/g, " ");

  return (
    <li className={css.card_box} data-order-id={order.id}>
      {!isCollapsed && (
        <h3 className={css.title} onClick={handleOpen} role="button">
          {order.title}
        </h3>
      )}
      <div className={isCollapsed ? css.info_box_colaps : css.info_box}>
        <button
          className={css.burger_btn}
          type="button"
          aria-label="Открыть детали прихода"
          onClick={handleOpen}
        >
          <svg className={css.icon} width="20" height="20" aria-hidden>
            <use href="/sprite.svg#icon-burger" />
          </svg>
        </button>

        <div className={css.product_box}>
          <strong>{order.productsCount}</strong>
          <span>Продукта</span>
        </div>
        <div className={css.date_box}>
          <time dateTime={order.date}>{formatDate(order.date, "numeric")}</time>

          <time dateTime={order.formattedDate}>
            {formatDate(order.formattedDate, "text")}
          </time>
        </div>

        {!isCollapsed && (
          <div className={css.prise_box}>
            <span>{formatAmount(order.totalUSD)} $</span>

            <span>{formatAmount(order.totalUAH)} UAH</span>
          </div>
        )}
        {!isCollapsed && (
          <button className={css.del_btn} onClick={() => onDelete(order.id)}>
            <svg className={css.icon} width="16" height="16">
              <use href="/sprite.svg#icon-bin" />
            </svg>
          </button>
        )}
      </div>

      {isActive && (
        <div className={css.active_icon_wrapper}>
          <svg className={css.active_icon} width="16" height="16">
            <use href="/sprite.svg#icon-circle-right" />
          </svg>
        </div>
      )}
    </li>
  );
}
