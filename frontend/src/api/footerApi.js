import axios from "axios";
/* ---------------- Axios instance ---------------- */
const BASE_URL = "http://127.0.0.1:8000";
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
/* ---------------- API FUNCTIONS ---------------- */
/**
 * Get all social links (ordered by backend)
 */
export const getSocialLinks = async () => {
    try {
        const { data } = await api.get("/api/footer/social-links/");
        return data;
    }
    catch (error) {
        console.error("Error fetching social links:", error);
        throw error;
    }
};
/**
 * Create a new social link
 */
export const createSocialLink = async (data) => {
    try {
        const { data: response } = await api.post("/api/footer/social-links/create/", data);
        return response;
    }
    catch (error) {
        console.error("Error creating social link:", error);
        throw error;
    }
};
/**
 * Update an existing social link
 */
export const updateSocialLink = async (id, data) => {
    try {
        const { data: response } = await api.put(`/api/footer/social-links/${id}/update/`, data);
        return response;
    }
    catch (error) {
        console.error(`Error updating social link ${id}:`, error);
        throw error;
    }
};
/**
 * Delete a social link
 */
export const deleteSocialLink = async (id) => {
    try {
        await api.delete(`/api/footer/social-links/${id}/delete/`);
    }
    catch (error) {
        console.error(`Error deleting social link ${id}:`, error);
        throw error;
    }
};
