import { fetchOrdersServer } from "../../lib/server_api";
import OrdersContainer from "./OrdersContainer";

export default async function OrdersPage() {
  const orders = await fetchOrdersServer();

  return <OrdersContainer initialOrders={orders} />;
}
