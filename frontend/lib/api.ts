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
  date: string; // ISO string
  formattedDate: string;
  productsCount: number;
  totalUSD: string;
  totalUAH: string;
}
export interface ProductPrice {
  value: string; // например "71.26"
  symbol: string; // например "USD"
  isDefault: 0 | 1; // 1 если это дефолтная валюта
}
export interface ProductGuarantee {
  start: string; // ISO string
  end: string; // ISO string
  product_id: number;
}
// response
export interface ProductRes {
  id: number;
  title: string;
  serialNumber: number;
  type: string;
  specification: string;
  isNew: 0 | 1;
  photo: string | null;
  date: string; // ISO string
  price: ProductPrice[]; // массив цен
  guarantee?: ProductGuarantee;
}

export interface OrderRes {
  id: number;
  title: string;
  date: string; // ISO string
  formattedDate: string;
  productsCount: number;
  totalUSD: string;
  totalUAH: string;
  products: ProductRes[];
}
// request

export interface OrderPayload {
  title: string;
  description: string;
  date: string; // ISO string
  products?: ProductPayload | ProductPayload[];
}

export interface ProductPayload {
  serialNumber: number | string; // backend примет и число, и строку с цифрами
  isNew: 0 | 1 | boolean; // 1 / 0 или true / false
  price: number | string; // backend конвертирует string в число
  photo?: string | null;
  title: string;
  type: string;
  specification: string;
  guarantee_start?: string; // ISO string
  guarantee_end?: string; // ISO string
  inputCurrency: "UAH" | "USD";
  date: string; // ISO string
}
