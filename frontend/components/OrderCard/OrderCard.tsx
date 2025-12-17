import { OrdersRes } from "@/lib/api";

interface Props {
  order: OrdersRes;
}

export default function OrderCard({ order }: Props) {
  console.log("Render order:", order.id);

  return (
    <li>
      <strong>{order.title}</strong> — {order.formattedDate}
    </li>
  );
}
