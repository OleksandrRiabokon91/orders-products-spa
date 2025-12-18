import { OrdersRes } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// api/server/orders.server.ts
export const fetchOrdersServer = async (): Promise<OrdersRes[]> => {
  const res = await fetch(`${API_URL}/orders`, {
    cache: "no-store",
  });
  return res.json();
};
