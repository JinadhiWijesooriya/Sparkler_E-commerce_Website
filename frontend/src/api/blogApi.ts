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

// ---------------- TYPES ----------------

// Hero Section
export interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  image: string; // URL to hero image
  created_at: string;
}

// Article Images
export interface ArticleImage {
  id: number;
  image: string; // URL to image
  caption?: string | null;
}

// Articles
export interface Article {
  id: number;
  title: string;
  category: string;
  description: string;
  content: string; // full content
  featured_image: string; // URL to featured image
  images: ArticleImage[];
  created_at: string; // ISO string
}

// Query parameters for filtering/search/ordering
export interface ArticleQueryParams {
  category?: string;
  search?: string;
  ordering?: "created_at" | "-created_at";
  page?: number; // for DRF pagination
}

// ---------------- API FUNCTIONS ----------------

/**
 * Fetch all articles with optional filters, search, and ordering
 * @param params ArticleQueryParams
 * @returns Article[]
 */
export const getArticles = async (
  params?: ArticleQueryParams
): Promise<Article[]> => {
  try {
    const response = await api.get<{ results: Article[] }>("/blog/articles/", {
      params,
    });
    return response.data.results || response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Error fetching articles:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Fetch a single article by ID
 * @param id Article ID
 * @returns Article
 */
export const getArticleById = async (id: number): Promise<Article> => {
  try {
    const response = await api.get<Article>(`/blog/articles/${id}/`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error(`Error fetching article ${id}:`, err.response?.data || err.message);
    throw err;
  }
};

/**
 * Fetch the latest hero section (if multiple, returns the first)
 * @returns HeroSection
 */
export const getHeroSection = async (): Promise<HeroSection | null> => {
  try {
    const response = await api.get<HeroSection[]>("/blog/hero/");
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Error fetching hero section:", err.response?.data || err.message);
    return null;
  }
};
