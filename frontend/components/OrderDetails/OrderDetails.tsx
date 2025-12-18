"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import { OrderRes, ProductRes } from "@/lib/api";
import {
  deleteProduct,
  fetchOrderById,
  fetchProductsByOrder,
} from "@/lib/client_api";

interface Props {
  orderId: number;
  onClose: () => void;
}

export default function OrderDetails({ orderId, onClose }: Props) {
  const [order, setOrder] = useState<OrderRes | null>(null);
  const [products, setProducts] = useState<ProductRes[]>([]);
  const [filterType, setFilterType] = useState<string>(""); // исправлено

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // загрузка данных ордера и продуктов
  useEffect(() => {
    const loadOrder = async () => {
      const data = await fetchOrderById(orderId);
      setOrder(data);
      setProducts(data.products);
    };
    loadOrder();
  }, [orderId]);

  // фильтрация продуктов через API
  useEffect(() => {
    const loadFilteredProducts = async () => {
      if (!filterType) {
        if (order) setProducts(order.products);
        return;
      }
      const filtered = await fetchProductsByOrder(orderId, filterType);
      setProducts(filtered);
    };
    loadFilteredProducts();
  }, [filterType, orderId, order]);

  if (!order) return <div>Loading...</div>;

  return (
    <div
      style={{
        marginLeft: "20px",
        minWidth: "300px",
        border: "1px solid #ccc",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h3>{order.title} - Products</h3>
        <button onClick={onClose}>Close</button>
      </div>

      <div style={{ marginBottom: "10px" }}>
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
    </div>
  );
}
