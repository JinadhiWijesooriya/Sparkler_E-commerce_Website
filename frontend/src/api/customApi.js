import axios from "axios";
// ---------------- BASE CONFIG ----------------
const BASE_URL = "http://127.0.0.1:8000"; // Django backend
const MEDIA_URL = "/media/"; // Matches settings.MEDIA_URL
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
// ---------------- HELPERS ----------------
const prependMediaUrl = (path, fallback = "/previews/default.jpg") => path && !path.startsWith("http") ? `${BASE_URL}${MEDIA_URL}${path}` : path || fallback;
// ---------------- API FUNCTIONS ----------------
// -------- Hero Section --------
export const getHeroSections = async () => {
    const response = await api.get("/custom/hero-section/");
    return response.data.map((h) => ({
        ...h,
        image: prependMediaUrl(h.image),
    }));
};
// -------- Jewelry Types --------
export const getJewelryTypes = async () => {
    const response = await api.get("/custom/jewelry-types/");
    return response.data;
};
// -------- Gems --------
export const getGems = async () => {
    const response = await api.get("/custom/gems/");
    return response.data.map((g) => ({
        ...g,
        image: prependMediaUrl(g.image),
    }));
};
// -------- Metals --------
export const getMetals = async () => {
    const response = await api.get("/custom/metals/");
    return response.data.map((m) => ({
        ...m,
        image: prependMediaUrl(m.image),
    }));
};
// -------- Suggested Items --------
export const getSuggestedItems = async (params) => {
    const response = await api.get("/custom/suggested-items/", { params });
    return response.data.map((item) => ({
        ...item,
        image: prependMediaUrl(item.image),
        gem: { ...item.gem, image: prependMediaUrl(item.gem.image) },
        metal: { ...item.metal, image: prependMediaUrl(item.metal.image) },
    }));
};
// -------- Custom Orders --------
export const getCustomOrders = async () => {
    const response = await api.get("/custom/custom-orders/");
    return response.data;
};
export const getCustomOrderById = async (id) => {
    const response = await api.get(`/custom/custom-orders/${id}/`);
    return response.data;
};
export const createCustomOrder = async (data) => {
    const response = await api.post("/custom/custom-orders/", data);
    return response.data;
};
export const updateCustomOrder = async (id, data) => {
    const response = await api.put(`/custom/custom-orders/${id}/`, data);
    return response.data;
};
export const deleteCustomOrder = async (id) => {
    await api.delete(`/custom/custom-orders/${id}/`);
};
