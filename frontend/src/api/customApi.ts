import axios from "axios";

// ---------------- BASE CONFIG ----------------
const BASE_URL = "http://127.0.0.1:8000"; // Django backend
const MEDIA_URL = "/media/"; // Matches settings.MEDIA_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- TYPES ----------------
export interface JewelryType {
  id: number;
  name: string;
}

export interface Gem {
  id: number;
  name: string;
  multiplier: number;
  image: string; // Full URL
}

export interface Metal {
  id: number;
  name: string;
  multiplier: number;
  image: string; // Full URL
}

export interface SuggestedItem {
  id: number;
  jewelry_type: JewelryType;
  gem: Gem;
  metal: Metal;
  image: string; // Full URL
}

export interface CustomOrder {
  id: number;
  jewelry_type: number;
  gem: number;
  metal: number;
  quantity: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  notes?: string | null;
  price: number;
  created_at: string; // ISO date string
}

export interface HeroSection {
  id: number;
  title: string;
  subtitle?: string | null;
  image: string; // Full URL
}

// ---------------- QUERY PARAMS ----------------
export interface SuggestedItemQueryParams {
  jewelry_type?: number;
  gem?: number;
  metal?: number;
  search?: string;
}

export interface WishlistItem {
  id: number;
  user: number; // user id
  suggested_item: number;
  suggested_item_detail: SuggestedItem;
  added_at: string;
}

// ---------------- HELPERS ----------------
const prependMediaUrl = (path?: string, fallback = "/previews/default.jpg") =>
  path && !path.startsWith("http") ? `${BASE_URL}${MEDIA_URL}${path}` : path || fallback;

// ---------------- API FUNCTIONS ----------------

// -------- Hero Section --------
export const getHeroSections = async (): Promise<HeroSection[]> => {
  const response = await api.get<HeroSection[]>("/custom/hero-section/");
  return response.data.map((h) => ({
    ...h,
    image: prependMediaUrl(h.image),
  }));
};

// -------- Jewelry Types --------
export const getJewelryTypes = async (): Promise<JewelryType[]> => {
  const response = await api.get<JewelryType[]>("/custom/jewelry-types/");
  return response.data;
};

// -------- Gems --------
export const getGems = async (): Promise<Gem[]> => {
  const response = await api.get<Gem[]>("/custom/gems/");
  return response.data.map((g) => ({
    ...g,
    image: prependMediaUrl(g.image),
  }));
};

// -------- Metals --------
export const getMetals = async (): Promise<Metal[]> => {
  const response = await api.get<Metal[]>("/custom/metals/");
  return response.data.map((m) => ({
    ...m,
    image: prependMediaUrl(m.image),
  }));
};

// -------- Suggested Items --------
export const getSuggestedItems = async (
  params?: SuggestedItemQueryParams
): Promise<SuggestedItem[]> => {
  const response = await api.get<SuggestedItem[]>("/custom/suggested-items/", { params });
  return response.data.map((item) => ({
    ...item,
    image: prependMediaUrl(item.image),
    gem: { ...item.gem, image: prependMediaUrl(item.gem.image) },
    metal: { ...item.metal, image: prependMediaUrl(item.metal.image) },
  }));
};

// -------- Custom Orders --------
export const getCustomOrders = async (): Promise<CustomOrder[]> => {
  const response = await api.get<CustomOrder[]>("/custom/custom-orders/");
  return response.data;
};

export const getCustomOrderById = async (id: number): Promise<CustomOrder> => {
  const response = await api.get<CustomOrder>(`/custom/custom-orders/${id}/`);
  return response.data;
};

export const createCustomOrder = async (
  data: Omit<CustomOrder, "id" | "created_at">
): Promise<CustomOrder> => {
  const response = await api.post<CustomOrder>("/custom/custom-orders/", data);
  return response.data;
};

export const updateCustomOrder = async (
  id: number,
  data: Partial<Omit<CustomOrder, "id" | "created_at">>
): Promise<CustomOrder> => {
  const response = await api.put<CustomOrder>(`/custom/custom-orders/${id}/`, data);
  return response.data;
};

export const deleteCustomOrder = async (id: number): Promise<void> => {
  await api.delete(`/custom/custom-orders/${id}/`);
};


