import axios from "axios";
/* ---------------- Axios instance ---------------- */
const BASE_URL = "http://127.0.0.1:8000";
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
/* ---------------- API call ---------------- */
export const getHomepageData = async () => {
    try {
        const { data } = await api.get("/api/home/");
        return data;
    }
    catch (error) {
        console.error("Error fetching homepage data:", error);
        throw error;
    }
};
