import axios from "axios";

/* ---------------- Axios instance ---------------- */

const BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------- Types ---------------- */

/* Hero (NO buttons from backend) */
export interface Hero {
  badge_text: string;
  title: string;
  subtitle: string;
  background_image: string; // full media URL
  is_active: boolean;
}

/* Features */
export interface Feature {
  title: string;
  is_active: boolean;
}

/* Collections */
export interface Collection {
  name: string;
  image: string; // full media URL
  slug: string;
  is_featured: boolean;
}

/* Custom Jewelry CTA (no button logic in Hero) */
export interface CustomJewelryCTA {
  title: string;
  subtitle: string;
  background_image: string;
  is_active: boolean;
}

/* Advertisements */
export interface Advertisement {
  title: string;
  description: string;
  image: string;
  link: string;
  is_active: boolean;
}

/* Product Images */
export interface ProductImage {
  image: string;
}

/* Products */
export interface Product {
  name: string;
  description: string;
  price: number;
  is_popular: boolean;
  images: ProductImage[];
}

/* Homepage API response */
export interface HomepageData {
  hero: Hero | null;
  features: Feature[];
  collections: Collection[];
  cta: CustomJewelryCTA | null;
  ads: Advertisement[];
  products: Product[];
}

/* ---------------- API call ---------------- */

export const getHomepageData = async (): Promise<HomepageData> => {
  try {
    const { data } = await api.get<HomepageData>("/api/home/");
    return data;
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    throw error;
  }
};
