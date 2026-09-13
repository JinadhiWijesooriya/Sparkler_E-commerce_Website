"use client";

import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  refreshAccessToken,
} from "./accountsApi";

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
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization =
        `Bearer ${token}`;
    }
    return config;
  }
);

// ======================
// RESPONSE INTERCEPTOR
// ======================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return Promise.reject(error);
      }

      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (!newAccessToken) throw new Error("Refresh failed");

        setTokens(newAccessToken, refreshToken);
        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as Record<string, string>).Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        clearTokens();
      }
    }

    return Promise.reject(error);
  }
);

// ======================
// BACKEND TYPES (MATCH DRF)
// ======================
export interface User {
  email: string;
  name?: string;
}

export interface Bid {
  user: User;
  amount: number;
  timestamp: string;
}

export interface AuctionItem {
  id: number;
  name: string;
  image: string;
  description: string;
  starting_price: number;
  current_bid: number;
  bid_increment: number;
  end_time: string;     // ISO string from backend
  time_left: number;    // seconds remaining (computed server-side)
  ending_price?: number;     // optional maximum bid limit
  is_active?: boolean;

  bids: Bid[];
}

// ======================
// PAGE BACKGROUND TYPE
// ======================
export interface AuctionPageBackground {
  image: string;
}

// ======================
// UI TYPES
// ======================
export interface BidHistoryBid {
  user: {
    name: string;
    email: string;
  };
  amount: number;
  timestamp: string;
}

export interface AuctionItemUI extends AuctionItem {
  bids: BidHistoryBid[];
}

// ======================
// HELPERS
// ======================
const formatBid = (bid: Bid): BidHistoryBid => ({
  user: {
    name: bid.user.name || bid.user.email,
    email: bid.user.email,
  },
  amount: bid.amount,
  timestamp: bid.timestamp,
});

// Optional helper if UI needs formatted time
export const secondsToHMS = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { h, m, s };
};

// ======================
// AUCTIONS API
// ======================

// Fetch all auctions
export const getAuctions = async (): Promise<AuctionItemUI[]> => {
  try {
    const res = await api.get<AuctionItem[]>("/auctions/");
    return res.data.map((item) => ({
      ...item,
      bids: item.bids
        .map(formatBid)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime()
        ),
    }));
  } catch (error) {
    console.error("Error fetching auctions:", error);
    throw error;
  }
};

// Fetch single auction
export const getAuctionById = async (
  id: number
): Promise<AuctionItemUI> => {
  try {
    const res = await api.get<AuctionItem>(`/auctions/${id}/`);
    return {
      ...res.data,
      bids: res.data.bids
        .map(formatBid)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime()
        ),
    };
  } catch (error) {
    console.error(`Error fetching auction ${id}`, error);
    throw error;
  }
};

// Place bid
export const placeBid = async (
  auctionId: number,
  amount: number
): Promise<BidHistoryBid> => {
  try {
    const res = await api.post<Bid>(
      `/auctions/${auctionId}/place_bid/`,
      { amount }
    );
    return formatBid(res.data);
  } catch (error) {
    const err = error as AxiosError<{ error?: string }>;
    throw {
      error:
        err.response?.data?.error ||
        "Failed to place bid. Please try again.",
    };
  }
};


// ======================
// PAGE BACKGROUND API
// ======================

// Fetch active auction page background
export const getAuctionPageBackground = async (): Promise<string | null> => {
  try {
    const res = await api.get<AuctionPageBackground[]>("/auction-page-background/");
    return res.data.length ? res.data[0].image : null;
  } catch (error) {
    // <-- handle 404 / missing endpoint gracefully
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn("Auction page background endpoint not found (404). Using default background.");
    } else {
      console.warn("Failed to fetch auction page background:", error);
    }
    return null; // fallback to no background
  }
};

// ======================
// DEFAULT EXPORT
// ======================
export default api;
