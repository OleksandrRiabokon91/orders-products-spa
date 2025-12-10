"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function OrderDetails({ id }) {
  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => (await api.get(`/orders/${id}`)).data,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="order-details">
      <h3>{data.title}</h3>
      <p>Created: {data.created_at}</p>
      <p>Total: {data.total}</p>
    </div>
  );
}
