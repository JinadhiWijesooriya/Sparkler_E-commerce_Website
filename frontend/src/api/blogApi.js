import axios, { AxiosError } from "axios";
// ---------------- BASE URL ----------------
const BASE_URL = "http://127.0.0.1:8000/api";
// Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
// ---------------- API FUNCTIONS ----------------
/**
 * Fetch all articles with optional filters, search, and ordering
 * @param params ArticleQueryParams
 * @returns Article[]
 */
export const getArticles = async (params) => {
    try {
        const response = await api.get("/blog/articles/", {
            params,
        });
        return response.data.results || response.data;
    }
    catch (error) {
        const err = error;
        console.error("Error fetching articles:", err.response?.data || err.message);
        throw err;
    }
};
/**
 * Fetch a single article by ID
 * @param id Article ID
 * @returns Article
 */
export const getArticleById = async (id) => {
    try {
        const response = await api.get(`/blog/articles/${id}/`);
        return response.data;
    }
    catch (error) {
        const err = error;
        console.error(`Error fetching article ${id}:`, err.response?.data || err.message);
        throw err;
    }
};
/**
 * Fetch the latest hero section (if multiple, returns the first)
 * @returns HeroSection
 */
export const getHeroSection = async () => {
    try {
        const response = await api.get("/blog/hero/");
        return response.data.length > 0 ? response.data[0] : null;
    }
    catch (error) {
        const err = error;
        console.error("Error fetching hero section:", err.response?.data || err.message);
        return null;
    }
};
