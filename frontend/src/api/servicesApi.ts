import axios from "axios";

// ---------------- BASE SETUP ----------------
const API_ROOT = "http://127.0.0.1:8000/api";
const BACKEND_ROOT = "http://127.0.0.1:8000"; // add root for full URLs

const api = axios.create({
  baseURL: API_ROOT,
  headers: { "Content-Type": "application/json" },
});

// ---------------- TYPES ----------------
export type HeroSection = {
  id: number;
  badge_text: string;
  title: string;
  subtitle: string;
  background_image: string;
};

export type ServiceImage = {
  id: number;
  image: string;
  is_before: boolean;
};

export type Service = {
  id: number;
  title: string;
  icon: "wrench" | "diamond" | "watch" | "zap" | "edit";
  description: string;
  estimated_cost: string;
  video_url?: string | null;
  images: ServiceImage[];
};

export interface ServiceQueryParams {
  search?: string;
  ordering?: "title" | "-title" | "estimated_cost" | "-estimated_cost";
}

// ---------------- API FUNCTIONS ----------------
export const getHeroSections = async (): Promise<HeroSection[]> => {
  try {
    const response = await api.get<HeroSection[]>("/hero/");
    // prepend backend root
    return response.data.map(h => ({
      ...h,
      background_image: h.background_image.startsWith("http")
        ? h.background_image
        : `${BACKEND_ROOT}${h.background_image}`,
    }));
  } catch (error) {
    console.error("Error fetching hero sections:", error);
    return [];
  }
};

export const getServices = async (params?: ServiceQueryParams): Promise<Service[]> => {
  try {
    const response = await api.get<Service[]>("/services/", { params });
    // prepend backend root for videos and images
    return response.data.map(s => ({
      ...s,
      video_url: s.video_url
        ? s.video_url.startsWith("http")
          ? s.video_url
          : `${BACKEND_ROOT}${s.video_url}`
        : null,
      images: s.images.map(img => ({
        ...img,
        image: img.image.startsWith("http") ? img.image : `${BACKEND_ROOT}${img.image}`,
      })),
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const getServiceById = async (id: number): Promise<Service | null> => {
  try {
    const response = await api.get<Service>(`/services/${id}/`);
    const s = response.data;
    return {
      ...s,
      video_url: s.video_url
        ? s.video_url.startsWith("http")
          ? s.video_url
          : `${BACKEND_ROOT}${s.video_url}`
        : null,
      images: s.images.map(img => ({
        ...img,
        image: img.image.startsWith("http") ? img.image : `${BACKEND_ROOT}${img.image}`,
      })),
    };
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    return null;
  }
};
