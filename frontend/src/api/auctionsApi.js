"use client";
import axios, { AxiosError, } from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens, refreshAccessToken, } from "./accountsApi";
// ======================
// BASE API CONFIG
// ======================
const API_BASE_URL = "http://127.0.0.1:8000/api";
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
// ======================
// REQUEST INTERCEPTOR
// ======================
api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization =
            `Bearer ${token}`;
    }
    return config;
});
// ======================
// RESPONSE INTERCEPTOR
// ======================
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (!originalRequest)
        return Promise.reject(error);
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            clearTokens();
            return Promise.reject(error);
        }
        try {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (!newAccessToken)
                throw new Error("Refresh failed");
            setTokens(newAccessToken, refreshToken);
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;
            return api(originalRequest);
        }
        catch {
            clearTokens();
        }
    }
    return Promise.reject(error);
});
// ======================
// HELPERS
// ======================
const formatBid = (bid) => ({
    user: {
        name: bid.user.name || bid.user.email,
        email: bid.user.email,
    },
    amount: bid.amount,
    timestamp: bid.timestamp,
});
// Optional helper if UI needs formatted time
export const secondsToHMS = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { h, m, s };
};
// ======================
// AUCTIONS API
// ======================
// Fetch all auctions
export const getAuctions = async () => {
    try {
        const res = await api.get("/auctions/");
        return res.data.map((item) => ({
            ...item,
            bids: item.bids
                .map(formatBid)
                .sort((a, b) => new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()),
        }));
    }
    catch (error) {
        console.error("Error fetching auctions:", error);
        throw error;
    }
};
// Fetch single auction
export const getAuctionById = async (id) => {
    try {
        const res = await api.get(`/auctions/${id}/`);
        return {
            ...res.data,
            bids: res.data.bids
                .map(formatBid)
                .sort((a, b) => new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()),
        };
    }
    catch (error) {
        console.error(`Error fetching auction ${id}`, error);
        throw error;
    }
};
// Place bid
export const placeBid = async (auctionId, amount) => {
    try {
        const res = await api.post(`/auctions/${auctionId}/place_bid/`, { amount });
        return formatBid(res.data);
    }
    catch (error) {
        const err = error;
        throw {
            error: err.response?.data?.error ||
                "Failed to place bid. Please try again.",
        };
    }
};
// ======================
// PAGE BACKGROUND API
// ======================
// Fetch active auction page background
export const getAuctionPageBackground = async () => {
    try {
        const res = await api.get("/auction-page-background/");
        return res.data.length ? res.data[0].image : null;
    }
    catch (error) {
        // <-- handle 404 / missing endpoint gracefully
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.warn("Auction page background endpoint not found (404). Using default background.");
        }
        else {
            console.warn("Failed to fetch auction page background:", error);
        }
        return null; // fallback to no background
    }
};
// ======================
// DEFAULT EXPORT
// ======================
export default api;
