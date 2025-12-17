import { OrdersRes } from "./api";

// api/server/orders.server.ts
export const fetchOrdersServer = async (): Promise<OrdersRes[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    cache: "no-store",
  });
  return res.json();
};
