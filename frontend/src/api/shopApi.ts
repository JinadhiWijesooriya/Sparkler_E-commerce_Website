import axios from "axios";

// ---------------- BASE CONFIG ----------------
const BASE_URL = "http://127.0.0.1:8000/api";
const MEDIA_BASE_URL = "http://127.0.0.1:8000";

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- TYPES ----------------

// Product Image
export interface ProductImage {
  id: number;
  image: string;
  alt_text?: string | null;
}

// Product
export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  gem: "Sapphire" | "Ruby" | "Emerald" | "Diamond";
  carat: number;
  metal: "Gold" | "Silver" | "Platinum";
  certification: boolean;
  availability: boolean;
  images: ProductImage[];
}

// Shop Page Hero
export interface ShopHero {
  id: number;
  title: string;
  subtitle?: string | null;
  background_image: string;
  created_at: string;
}

// Query params
export interface ProductQueryParams {
  gem?: "Sapphire" | "Ruby" | "Emerald" | "Diamond";
  metal?: "Gold" | "Silver" | "Platinum";
  availability?: boolean;
  price_gte?: number;
  price_lte?: number;
  ordering?: "price" | "-price" | "name" | "-name" | "carat" | "-carat";
  search?: string;
}

// ---------------- HELPERS ----------------

// Attach full media URL safely
const withMediaUrl = (path?: string | null) => {
  if (!path) return ""; // handle null or undefined
  if (path.startsWith("http") || path.startsWith("https")) return path; // already full URL
  return `${MEDIA_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

// ---------------- API FUNCTIONS ----------------

//  Get shop hero
export const getShopHero = async (): Promise<ShopHero | null> => {
  try {
    const response = await api.get<ShopHero | null>("/shop/hero/");

    if (!response.data) return null;

    return {
      ...response.data,
      background_image: withMediaUrl(response.data.background_image),
    };
  } catch (error) {
    console.error("Error fetching shop hero:", error);
    return null;
  }
};

//Get all products
export const getProducts = async (
  params?: ProductQueryParams
): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>("/shop/products/", { params });

    return response.data.map((product) => ({
      ...product,
      images: product.images?.length
        ? product.images.map((img) => ({
            ...img,
            image: withMediaUrl(img.image),
          }))
        : [], // empty array if no images
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Get single product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await api.get<Product>(`/shop/products/${id}/`);

    return {
      ...response.data,
      images: response.data.images?.length
        ? response.data.images.map((img) => ({
            ...img,
            image: withMediaUrl(img.image),
          }))
        : [],
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};
