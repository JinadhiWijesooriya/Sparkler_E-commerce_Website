"use client";

import axios, { AxiosError } from "axios";

// ---------------- BASE CONFIG ----------------
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/auth",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // important for Django session cookies
});

// ---------------- TOKEN HELPERS ----------------
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ---------------- AXIOS INTERCEPTOR ----------------
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (
    token &&
    config.headers &&
    !config.url?.includes("/auth/login") &&
    !config.url?.includes("/auth/register")
  ) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ---------------- TYPES ----------------
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name?: string;
  phone?: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

// ---------------- CART TYPES ----------------
export interface BackendCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total_price: number;
}

// ---------------- ORDER TYPES ----------------
export interface Order {
  full_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  country: string;
}

export interface CheckoutResponse {
  message: string;
  order_id?: string;
}

// ---------------- HELPERS ----------------
const mapCartItems = (items: BackendCartItem[]): CartItem[] =>
  items.map((i) => ({
    id: i.id,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image ?? "/placeholder.jpg",
    total_price: i.price * i.quantity,
  }));

// ---------------- AUTH FUNCTIONS ----------------
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>("/login/", { email, password });
    setTokens(res.data.access, res.data.refresh);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ detail?: string; message?: string }>;
      throw new Error(axiosErr.response?.data?.detail || axiosErr.response?.data?.message || "Login failed");
    }
    throw new Error("Login failed");
  }
};

export const registerUser = async (payload: RegisterPayload): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>("/register/", payload);
    setTokens(res.data.access, res.data.refresh);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ email?: string; detail?: string; message?: string }>;
      const msg =
        axiosErr.response?.data?.email ||
        axiosErr.response?.data?.detail ||
        axiosErr.response?.data?.message ||
        "Signup failed";
      throw new Error(msg);
    }
    throw new Error("Signup failed");
  }
};

// ---------------- TOKEN REFRESH & LOGOUT ----------------
const API_AUTH_URL = "http://127.0.0.1:8000/api/auth";

export const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
  try {
    const res = await axios.post<{ access: string }>(`${API_AUTH_URL}/token/refresh/`, {
      refresh: refreshToken,
    });
    const { access } = res.data;
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    return access;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Token refresh failed:", err.message);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const token = getAccessToken();
    await api.post("/logout/", {}, { headers: { Authorization: `Bearer ${token}` } });
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    clearTokens();
    localStorage.removeItem("user");
  }
};
// ---------------- OTHER AUTH ----------------
export const updateProfile = async (payload: { email: string; name: string; phone?: string }): Promise<{ user: User }> => {
  const res = await api.put<{ user: User }>("/profile/", payload);
  return res.data;
};


export const changePassword = async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/change-password/", payload);
  return res.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
  const res = await api.post<ForgotPasswordResponse>("/forgot-password/", payload);
  return res.data;
};



// ---------------- CART API ----------------
export const getCart = async (): Promise<CartItem[]> => {
  const res = await api.get<{ items: BackendCartItem[] }>("/cart/");
  return mapCartItems(res.data.items || []);
};

export const addToCart = async (
  shop_product?: number,
  sets_product?: number,
  quantity: number = 1
): Promise<CartItem[]> => {
  const res = await api.post<{ items: BackendCartItem[] }>("/cart/add/", {
    shop_product,
    sets_product,
    quantity,
  });
  return mapCartItems(res.data.items || []);
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<CartItem[]> => {
  const res = await api.patch<{ items: BackendCartItem[] }>(`/cart/${itemId}/update/`, { quantity });
  return mapCartItems(res.data.items || []);
};

export const removeCartItem = async (itemId: number): Promise<CartItem[]> => {
  const res = await api.delete<{ items: BackendCartItem[] }>(`/cart/${itemId}/remove/`);
  return mapCartItems(res.data.items || []);
};

// ---------------- CHECKOUT ----------------
export const checkout = async (order: Order): Promise<CheckoutResponse> => {
  const res = await api.post<CheckoutResponse>("/checkout/", order);
  return res.data;
};

export default api;
