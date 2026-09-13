import axios from "axios";
// ---------------- BASE URL ----------------
const BASE_URL = "http://127.0.0.1:8000/api/contact"; // include /api/contact
// ---------------- AXIOS INSTANCE ----------------
const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});
// ---------------- API FUNCTIONS ----------------
export const getContactInfo = async () => {
    try {
        const response = await api.get("/info/"); // now resolves to /api/contact/info/
        return response.data;
    }
    catch (error) {
        console.error("Error fetching contact info:", error);
        throw error;
    }
};
export const getContactHero = async () => {
    try {
        const response = await api.get("/hero/"); // resolves to /api/contact/hero/
        return response.data;
    }
    catch (error) {
        console.error("Error fetching contact hero:", error);
        throw error;
    }
};
export const createContactMessage = async (data) => {
    try {
        const response = await api.post("/messages/", data); // /api/contact/messages/
        return response.data;
    }
    catch (error) {
        console.error("Error creating contact message:", error);
        throw error;
    }
};
