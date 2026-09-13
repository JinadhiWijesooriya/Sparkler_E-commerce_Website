import axios from "axios";
// ---------------- BASE SETUP ----------------
const API_ROOT = "http://127.0.0.1:8000/api";
const BACKEND_ROOT = "http://127.0.0.1:8000"; // add root for full URLs
const api = axios.create({
    baseURL: API_ROOT,
    headers: { "Content-Type": "application/json" },
});
// ---------------- API FUNCTIONS ----------------
export const getHeroSections = async () => {
    try {
        const response = await api.get("/hero/");
        // prepend backend root
        return response.data.map(h => ({
            ...h,
            background_image: h.background_image.startsWith("http")
                ? h.background_image
                : `${BACKEND_ROOT}${h.background_image}`,
        }));
    }
    catch (error) {
        console.error("Error fetching hero sections:", error);
        return [];
    }
};
export const getServices = async (params) => {
    try {
        const response = await api.get("/services/", { params });
        // prepend backend root for videos and images
        return response.data.map(s => ({
            ...s,
            video_url: s.video_url
                ? s.video_url.startsWith("http")
                    ? s.video_url
                    : `${BACKEND_ROOT}${s.video_url}`
                : null,
            images: s.images.map(img => ({
                ...img,
                image: img.image.startsWith("http") ? img.image : `${BACKEND_ROOT}${img.image}`,
            })),
        }));
    }
    catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
};
export const getServiceById = async (id) => {
    try {
        const response = await api.get(`/services/${id}/`);
        const s = response.data;
        return {
            ...s,
            video_url: s.video_url
                ? s.video_url.startsWith("http")
                    ? s.video_url
                    : `${BACKEND_ROOT}${s.video_url}`
                : null,
            images: s.images.map(img => ({
                ...img,
                image: img.image.startsWith("http") ? img.image : `${BACKEND_ROOT}${img.image}`,
            })),
        };
    }
    catch (error) {
        console.error(`Error fetching service with ID ${id}:`, error);
        return null;
    }
};
