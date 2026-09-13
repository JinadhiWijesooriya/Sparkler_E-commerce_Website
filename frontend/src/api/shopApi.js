import axios from "axios";
// ---------------- BASE CONFIG ----------------
const BASE_URL = "http://127.0.0.1:8000/api";
const MEDIA_BASE_URL = "http://127.0.0.1:8000";
// Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
// ---------------- HELPERS ----------------
// Attach full media URL safely
const withMediaUrl = (path) => {
    if (!path)
        return ""; // handle null or undefined
    if (path.startsWith("http") || path.startsWith("https"))
        return path; // already full URL
    return `${MEDIA_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
// ---------------- API FUNCTIONS ----------------
//  Get shop hero
export const getShopHero = async () => {
    try {
        const response = await api.get("/shop/hero/");
        if (!response.data)
            return null;
        return {
            ...response.data,
            background_image: withMediaUrl(response.data.background_image),
        };
    }
    catch (error) {
        console.error("Error fetching shop hero:", error);
        return null;
    }
};
//Get all products
export const getProducts = async (params) => {
    try {
        const response = await api.get("/shop/products/", { params });
        return response.data.map((product) => ({
            ...product,
            images: product.images?.length
                ? product.images.map((img) => ({
                    ...img,
                    image: withMediaUrl(img.image),
                }))
                : [], // empty array if no images
        }));
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};
// Get single product by ID
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/shop/products/${id}/`);
        return {
            ...response.data,
            images: response.data.images?.length
                ? response.data.images.map((img) => ({
                    ...img,
                    image: withMediaUrl(img.image),
                }))
                : [],
        };
    }
    catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
};
