import axios from "axios";

// ---------------- BASE CONFIG ----------------
const BASE_URL = "http://127.0.0.1:8000/api"; // Match your Django URLs
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- TYPES ----------------

// Product type matching Django Product model
export interface ShopSetProduct {
  id: number;
  name: string;
  description?: string | null;
  gem: "diamond" | "ruby" | "emerald" | "sapphire";
  metal: "gold" | "silver" | "platinum";
  price: number;
  carat: number;
  availability: "in_stock" | "out_of_stock";
  image_main: string;
  image_secondary?: string | null;
  created_at: string;
}

// Page-level hero image type
export interface PageHeroImage {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  background_image: string;
  created_at: string;
}

// Query parameters for filtering/search/ordering/pagination
export interface ShopSetQueryParams {
  gem?: "diamond" | "ruby" | "emerald" | "sapphire";
  metal?: "gold" | "silver" | "platinum";
  availability?: "in_stock" | "out_of_stock";
  price_gte?: number;
  price_lte?: number;
  ordering?: "price" | "-price" | "name" | "-name" | "carat" | "-carat";
  search?: string;
  page?: number;
}

// ---------------- API FUNCTIONS ----------------

/**
 * Get all shop sets with optional filters, search, ordering, and pagination
 */
export const getShopSets = async (
  params?: ShopSetQueryParams
): Promise<{ results: ShopSetProduct[]; count?: number; next?: string; previous?: string }> => {
  try {
    const response = await api.get<ShopSetProduct[] | { results: ShopSetProduct[] }>("/shop_sets/products/", {
      params,
    });

    // Handle paginated response or plain array
    if (Array.isArray(response.data)) {
      return { results: response.data };
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching shop sets:", error);
    throw error;
  }
};

/**
 * Get a single shop set product by ID
 */
export const getShopSetById = async (id: number): Promise<ShopSetProduct> => {
  try {
    const response = await api.get<ShopSetProduct>(`/shop_sets/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching shop set product ${id}:`, error);
    throw error;
  }
};

/**
 * Get the latest page-level hero image
 */
export const getHeroImage = async (): Promise<PageHeroImage | null> => {
  try {
    const response = await api.get<PageHeroImage>("/shop_sets/hero/");
    return response.data ?? null;
  } catch (error) {
    console.error("Error fetching hero image:", error);
    return null;
  }
};

/**
 * Helper: Map frontend filter values to backend values
 */
export const mapFiltersToBackend = (filters: {
  gem?: "Diamond" | "Ruby" | "Emerald" | "Sapphire";
  metal?: "Gold" | "Silver" | "Platinum";
  availability?: "in_stock" | "out_of_stock";
  price_gte?: number;
  price_lte?: number;
  ordering?: "price" | "-price" | "name" | "-name" | "carat" | "-carat";
  carat?: number;
}) => {
  const gemMap: Record<string, ShopSetQueryParams["gem"]> = {
    Diamond: "diamond",
    Ruby: "ruby",
    Emerald: "emerald",
    Sapphire: "sapphire",
  };

  const metalMap: Record<string, ShopSetQueryParams["metal"]> = {
    Gold: "gold",
    Silver: "silver",
    Platinum: "platinum",
  };

  const availabilityMap: Record<string, ShopSetQueryParams["availability"]> = {
    in_stock: "in_stock",
    out_of_stock: "out_of_stock",
  };

  const backendFilters: ShopSetQueryParams = {};

  if (filters.gem) backendFilters.gem = gemMap[filters.gem];
  if (filters.metal) backendFilters.metal = metalMap[filters.metal];
  if (filters.availability) backendFilters.availability = availabilityMap[filters.availability];
  if (filters.price_gte) backendFilters.price_gte = filters.price_gte;
  if (filters.price_lte) backendFilters.price_lte = filters.price_lte;
  if (filters.ordering) backendFilters.ordering = filters.ordering;
  if (filters.carat) backendFilters.price_lte = filters.carat; // optional, adjust if backend supports filtering by carat

  return backendFilters;
};
