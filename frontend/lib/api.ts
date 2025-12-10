import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface OrdersRes {
  id: number;
  title: string;
  date: Date;
  description: string;
  productsCount: number;
  totalUSD: string;
  totalUAH: string;
}

export interface ProductRes {
  id: number;
  serialNumber: number;
  isNew: number;
  photo: string;
  title: string;
  type: string;
  specification: string;
  guarantee_start: Date;
  guarantee_end: Date;
  price_usd: string;
  price_uah: string;
  order_id: number;
  date: Date;
  orderTitle: string;
}

export interface OrderRes {
  id: number;
  title: string;
  date: Date;
  description: string;
  products: ProductRes[];
}

export interface OrderPayload {
  title: string;
  description: string;
  date: string; // ISO-строка
}

export interface ProductPayload {
  serialNumber: number;
  isNew: number;
  photo: "product.jpg";
  title: "Keyboard Pro";
  type: "Keyboards";
  specification: "RGB Mechanical";
  guarantee_start: "2025-12-06T11:11:00.000Z";
  guarantee_end: "2025-12-06T11:11:00.000Z";
  price_usd: number;
  price_uah: number;
  date: string; // ISO-строка
}

// Orders
export const fetchOrders = async (): Promise<OrderRes[]> => {
  const res = await api.get<OrderRes[]>("/orders");
  return res.data;
};
export const fetchOrderById = async (id: number): Promise<OrderRes> => {
  const res = await api.get<OrderRes>(`/orders/${id}`);
  return res.data;
};
export const createOrder = async (payload: OrderPayload): Promise<OrderRes> => {
  const { data } = await api.post<OrderRes>("/orders", payload);
  return data;
};
export const deleteOrder = async (id: number): Promise<number> => {
  const res = await api.delete(`/orders/${id}`);
  return res.status;
};

// Products
export const fetchProducts = async (type?: string): Promise<ProductRes[]> => {
  const res = await api.get<ProductRes[]>("/products", { params: { type } });
  return res.data;
};
export const fetchProductsByOrder = async (
  orderId: number,
  type?: string
): Promise<ProductRes[]> => {
  const res = await api.get<ProductRes[]>(`/orders/${orderId}/products`, {
    params: { type },
  });
  return res.data;
};
export const fetchProductById = async (id: number): Promise<ProductRes> => {
  const res = await api.get<ProductRes>(`/products/${id}`);
  return res.data;
};
export const createProduct = async (
  orderId: number,
  payload: any
): Promise<ProductRes> => {
  const res = await api.post(`/orders/${orderId}/products`, payload);
  return res.data;
};
export const deleteProduct = async (id: number): Promise<number> => {
  const res = await api.delete(`/products/${id}`);
  return res.status;
};
