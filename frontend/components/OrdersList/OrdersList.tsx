import css from "./OrdersList.module.css";
import { OrdersRes } from "@/lib/api";
import OrderCard from "../OrderCard/OrderCard";

interface Props {
  orders: OrdersRes[];
  activeOrderId: number | null;
  onDelete: (id: number) => void;
  onOpenDetails: (id: number) => void;
}

export default function OrdersList({
  orders,
  activeOrderId,
  onDelete,
  onOpenDetails,
}: Props) {
  const isCollapsed = activeOrderId !== null;

  return (
    <ul className={`${css.list} ${isCollapsed ? css.collapsed_list : ""}`}>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isCollapsed={isCollapsed}
          isActive={order.id === activeOrderId}
          onDelete={onDelete}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </ul>
  );
}
