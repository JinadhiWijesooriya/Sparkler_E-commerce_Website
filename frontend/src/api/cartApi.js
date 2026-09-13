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
// Cart & Order API
// -------------------------
export const CartAPI = {
    // -------------------------
    // Cart
    // -------------------------
    getCart: async () => {
        const res = await API.get("");
        return res.data;
    },
    addToCart: async (product_id, product_type, quantity = 1) => {
        const res = await API.post("add/", {
            product_id,
            source: product_type,
            quantity,
        });
        return res.data;
    },
    updateCartItem: async (item_id, quantity) => {
        const res = await API.post(`update/${item_id}/`, { quantity });
        return res.data;
    },
    removeCartItem: async (item_id) => {
        const res = await API.delete(`remove/${item_id}/`);
        return res.data;
    },
    // -------------------------
    // Checkout / Orders
    // -------------------------
    checkout: async (orderData) => {
        const res = await API.post("checkout/", orderData);
        return res.data;
    },
    verifyPayment: async (order_id, session_id) => {
        const res = await API.post(`order/${order_id}/verify/`, { session_id });
        return res.data;
    },
    getOrder: async (order_id) => {
        const res = await API.get(`order/${order_id}/`);
        return res.data;
    },
    // -------------------------
    // Countries
    // -------------------------
    getCountries: async () => {
        const res = await API.get("countries/");
        return res.data;
    },
    // -------------------------
    // Orders
    // -------------------------
    getPendingOrders: async () => {
        const res = await API.get("orders/pending/");
        return res.data;
    },
    getAllOrders: async () => {
        const res = await API.get("orders/");
        return res.data;
    },
};
