"use client";

import css from "./OrderDetails.module.css";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import { OrderRes, ProductRes } from "@/lib/api";
import {
  deleteProduct,
  fetchOrderById,
  fetchProductsByOrder,
} from "@/lib/client_api";

interface Props {
  orderId: number | null; // 🔴 важно: может быть null
  onClose: () => void;
}

export default function OrderDetails({ orderId, onClose }: Props) {
  const [order, setOrder] = useState<OrderRes | null>(null);
  const [products, setProducts] = useState<ProductRes[]>([]);
  const [filterType, setFilterType] = useState("");

  const isOpen = orderId !== null;

  // загрузка ордера
  useEffect(() => {
    if (!orderId) return;

    const loadOrder = async () => {
      const data = await fetchOrderById(orderId);
      setOrder(data);
      setProducts(data.products);
    };

    loadOrder();
  }, [orderId]);

  // фильтрация
  useEffect(() => {
    if (!order || !orderId) return;

    const loadFiltered = async () => {
      if (!filterType) {
        setProducts(order.products);
        return;
      }

      const filtered = await fetchProductsByOrder(orderId, filterType);
      setProducts(filtered);
    };

    loadFiltered();
  }, [filterType, order, orderId]);

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ⚠️ компонент всегда рендерится
  return (
    <div
      className={`${css.container} ${isOpen ? css.open : ""}`}
      style={{ marginLeft: "20px" }}
    >
      {!order ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={css.header}>
            <h3>{order.title} — Products</h3>
            <button onClick={onClose}>Close</button>
          </div>

          <div className={css.filter}>
            <label>
              Filter by type:{" "}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All</option>
                {Array.from(new Set(order.products.map((p) => p.type))).map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>

          <ul>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={() => handleDeleteProduct(product.id)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
