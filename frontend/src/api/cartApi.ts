import axios from "axios";

// -------------------------
// Axios instance
// -------------------------
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/cart/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // keep session_key for Django sessions
});

// -------------------------
// Types
// -------------------------

export interface ProductImageType {
  image: string;       // absolute URL
  alt_text: string | null;
}

export interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  product_shop?: number | null;
  product_set?: number | null;
  product_gem?: number | null;
  product_images: ProductImageType[]; // always array
  image?: string;
}

export interface CartType {
  id: number;
  user?: number | null;
  session_key?: string | null;
  items: CartItemType[];
  created_at: string;
}

export interface CountryOrderSettingsType {
  shipping_cost: number;
  tax_rate: number;
  vat_rate: number;
}

export interface CountryType {
  id: number;
  name: string;
  order_settings?: CountryOrderSettingsType | null;
}

export interface OrderType {
  order_id: string;
  user?: number | null;
  cart?: CartType | null;
  full_name: string;
  email: string;
  phone?: string | null;
  address_1: string;
  address_2?: string | null;
  city: string;
  state?: string | null;
  country?: CountryType | null;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  vat: number;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
}

// -------------------------
// Cart & Order API
// -------------------------
export const CartAPI = {
  // -------------------------
  // Cart
  // -------------------------
  getCart: async (): Promise<CartType> => {
    const res = await API.get<CartType>("");
    return res.data;
  },

  addToCart: async (
    product_id: number,
    product_type: "shop" | "set" | "gem",
    quantity = 1
  ): Promise<CartType> => {
    const res = await API.post<CartType>("add/", {
      product_id,
      source: product_type,
      quantity,
    });
    return res.data;
  },

  updateCartItem: async (item_id: number, quantity: number): Promise<CartType> => {
    const res = await API.post<CartType>(`update/${item_id}/`, { quantity });
    return res.data;
  },

  removeCartItem: async (item_id: number): Promise<CartType> => {
    const res = await API.delete<CartType>(`remove/${item_id}/`);
    return res.data;
  },

  // -------------------------
  // Checkout / Orders
  // -------------------------
  checkout: async (orderData: {
    full_name: string;
    email: string;
    phone?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    country: string;
    payment_method: string;
  }): Promise<{ checkout_url: string; order_id: string }> => {
    const res = await API.post<{ checkout_url: string; order_id: string }>("checkout/", orderData);
    return res.data;
  },
  verifyPayment: async (order_id: string, session_id: string): Promise<{ status: string; message: string }> => {
    const res = await API.post<{ status: string; message: string }>(`order/${order_id}/verify/`, { session_id });
    return res.data;
  },
  getOrder: async (order_id: string): Promise<OrderType> => {
    const res = await API.get<OrderType>(`order/${order_id}/`);
    return res.data;
  },

  // -------------------------
  // Countries
  // -------------------------
  getCountries: async (): Promise<CountryType[]> => {
    const res = await API.get<CountryType[]>("countries/");
    return res.data;
  },

  // -------------------------
  // Orders
  // -------------------------
  getPendingOrders: async (): Promise<OrderType[]> => {
    const res = await API.get<OrderType[]>("orders/pending/");
    return res.data;
  },

  getAllOrders: async (): Promise<OrderType[]> => {
    const res = await API.get<OrderType[]>("orders/");
    return res.data;
  },
};
