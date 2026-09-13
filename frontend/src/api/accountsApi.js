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
export const setTokens = (access, refresh) => {
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
    if (token &&
        config.headers &&
        !config.url?.includes("/auth/login") &&
        !config.url?.includes("/auth/register")) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});
// ---------------- HELPERS ----------------
const mapCartItems = (items) => items.map((i) => ({
    id: i.id,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image ?? "/placeholder.jpg",
    total_price: i.price * i.quantity,
}));
// ---------------- AUTH FUNCTIONS ----------------
export const loginUser = async (email, password) => {
    try {
        const res = await api.post("/login/", { email, password });
        setTokens(res.data.access, res.data.refresh);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return res.data;
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            const axiosErr = err;
            throw new Error(axiosErr.response?.data?.detail || axiosErr.response?.data?.message || "Login failed");
        }
        throw new Error("Login failed");
    }
};
export const registerUser = async (payload) => {
    try {
        const res = await api.post("/register/", payload);
        setTokens(res.data.access, res.data.refresh);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return res.data;
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            const axiosErr = err;
            const msg = axiosErr.response?.data?.email ||
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
export const refreshAccessToken = async (refreshToken) => {
    try {
        const res = await axios.post(`${API_AUTH_URL}/token/refresh/`, {
            refresh: refreshToken,
        });
        const { access } = res.data;
        localStorage.setItem(ACCESS_TOKEN_KEY, access);
        return access;
    }
    catch (error) {
        const err = error;
        console.error("Token refresh failed:", err.message);
        return null;
    }
};
export const logoutUser = async () => {
    try {
        const token = getAccessToken();
        await api.post("/logout/", {}, { headers: { Authorization: `Bearer ${token}` } });
    }
    catch (err) {
        console.error("Logout failed:", err);
    }
    finally {
        clearTokens();
        localStorage.removeItem("user");
    }
};
// ---------------- OTHER AUTH ----------------
export const updateProfile = async (payload) => {
    const res = await api.put("/profile/", payload);
    return res.data;
};
export const changePassword = async (payload) => {
    const res = await api.post("/change-password/", payload);
    return res.data;
};
export const forgotPassword = async (payload) => {
    const res = await api.post("/forgot-password/", payload);
    return res.data;
};
// ---------------- CART API ----------------
export const getCart = async () => {
    const res = await api.get("/cart/");
    return mapCartItems(res.data.items || []);
};
export const addToCart = async (shop_product, sets_product, quantity = 1) => {
    const res = await api.post("/cart/add/", {
        shop_product,
        sets_product,
        quantity,
    });
    return mapCartItems(res.data.items || []);
};
export const updateCartItem = async (itemId, quantity) => {
    const res = await api.patch(`/cart/${itemId}/update/`, { quantity });
    return mapCartItems(res.data.items || []);
};
export const removeCartItem = async (itemId) => {
    const res = await api.delete(`/cart/${itemId}/remove/`);
    return mapCartItems(res.data.items || []);
};
// ---------------- CHECKOUT ----------------
export const checkout = async (order) => {
    const res = await api.post("/checkout/", order);
    return res.data;
};
export default api;
