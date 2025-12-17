import {
  api,
  OrderPayload,
  OrderRes,
  OrdersRes,
  ProductPayload,
  ProductRes,
} from "./api";

export const fetchOrders = async (): Promise<OrdersRes[]> => {
  const res = await api.get<OrdersRes[]>("/orders");
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
export const deleteOrder = async (id: number): Promise<void> => {
  try {
    await api.delete(`/orders/${id}`);
  } catch (err) {
    throw err;
  }
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
  payload: ProductPayload
): Promise<ProductRes> => {
  const res = await api.post<ProductRes>(
    `/orders/${orderId}/products`,
    payload
  );
  return res.data;
};
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (err) {
    throw err;
  }
};
