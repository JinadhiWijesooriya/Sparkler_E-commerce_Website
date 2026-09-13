import axios from "axios";
// ---------------- BASE CONFIG ----------------
const BASE_URL = "http://127.0.0.1:8000/api"; // Match your Django URLs
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
// ---------------- API FUNCTIONS ----------------
/**
 * Get all shop sets with optional filters, search, ordering, and pagination
 */
export const getShopSets = async (params) => {
    try {
        const response = await api.get("/shop_sets/products/", {
            params,
        });
        // Handle paginated response or plain array
        if (Array.isArray(response.data)) {
            return { results: response.data };
        }
        return response.data;
    }
    catch (error) {
        console.error("Error fetching shop sets:", error);
        throw error;
    }
};
/**
 * Get a single shop set product by ID
 */
export const getShopSetById = async (id) => {
    try {
        const response = await api.get(`/shop_sets/products/${id}/`);
        return response.data;
    }
    catch (error) {
        console.error(`Error fetching shop set product ${id}:`, error);
        throw error;
    }
};
/**
 * Get the latest page-level hero image
 */
export const getHeroImage = async () => {
    try {
        const response = await api.get("/shop_sets/hero/");
        return response.data ?? null;
    }
    catch (error) {
        console.error("Error fetching hero image:", error);
        return null;
    }
};
/**
 * Helper: Map frontend filter values to backend values
 */
export const mapFiltersToBackend = (filters) => {
    const gemMap = {
        Diamond: "diamond",
        Ruby: "ruby",
        Emerald: "emerald",
        Sapphire: "sapphire",
    };
    const metalMap = {
        Gold: "gold",
        Silver: "silver",
        Platinum: "platinum",
    };
    const availabilityMap = {
        in_stock: "in_stock",
        out_of_stock: "out_of_stock",
    };
    const backendFilters = {};
    if (filters.gem)
        backendFilters.gem = gemMap[filters.gem];
    if (filters.metal)
        backendFilters.metal = metalMap[filters.metal];
    if (filters.availability)
        backendFilters.availability = availabilityMap[filters.availability];
    if (filters.price_gte)
        backendFilters.price_gte = filters.price_gte;
    if (filters.price_lte)
        backendFilters.price_lte = filters.price_lte;
    if (filters.ordering)
        backendFilters.ordering = filters.ordering;
    if (filters.carat)
        backendFilters.price_lte = filters.carat; // optional, adjust if backend supports filtering by carat
    return backendFilters;
};
