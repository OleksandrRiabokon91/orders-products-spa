import { fetchOrdersServer } from "../../lib/server_api";
import OrdersList from "./OrdersList";

export default async function OrdersPage() {
  const orders = await fetchOrdersServer();

  return (
    <section>
      <h1>Orders</h1>
      <OrdersList initialOrders={orders} />
    </section>
  );
}
