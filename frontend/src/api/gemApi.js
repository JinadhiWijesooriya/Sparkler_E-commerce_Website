import axios from "axios";
const API_BASE_URL = "http://127.0.0.1:8000/api/gems";
export const getGems = async (params) => {
    const response = await axios.get(`${API_BASE_URL}/gems/`, { params });
    return response.data;
};
export const getGemById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/gems/${id}/`);
    return response.data;
};
export const getGemHero = async () => {
    const response = await axios.get(`${API_BASE_URL}/gem-hero/`);
    return response.data.length > 0 ? response.data[0] : null;
};
