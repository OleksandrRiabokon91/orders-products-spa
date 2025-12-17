"use client";

import { useState } from "react";
import { fetchOrders, createOrder } from "../../lib/client_api";
import { OrdersRes } from "../../lib/api";
import OrderCard from "../../components/OrderCard/OrderCard";

interface Props {
  initialOrders: OrdersRes[];
}

export default function OrdersList({ initialOrders }: Props) {
  const [orders, setOrders] = useState<OrdersRes[]>(initialOrders);

  const handleCreate = async () => {
    await createOrder({
      title: "Test order",
      description: "From client",
      date: new Date().toISOString(),
    });

    // клиентский рефетч
    const freshOrders = await fetchOrders();
    console.log("Fresh orders:", freshOrders);
    setOrders(freshOrders);
  };

  return (
    <div>
      <button onClick={handleCreate}>Create order</button>

      <ul>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ul>
    </div>
  );
}
