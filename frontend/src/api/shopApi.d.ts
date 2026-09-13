export interface ProductImage {
    id: number;
    image: string;
    alt_text?: string | null;
}
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
export interface ShopHero {
    id: number;
    title: string;
    subtitle?: string | null;
    background_image: string;
    created_at: string;
}
export interface ProductQueryParams {
    gem?: "Sapphire" | "Ruby" | "Emerald" | "Diamond";
    metal?: "Gold" | "Silver" | "Platinum";
    availability?: boolean;
    price_gte?: number;
    price_lte?: number;
    ordering?: "price" | "-price" | "name" | "-name" | "carat" | "-carat";
    search?: string;
}
export declare const getShopHero: () => Promise<ShopHero | null>;
export declare const getProducts: (params?: ProductQueryParams) => Promise<Product[]>;
export declare const getProductById: (id: number) => Promise<Product | null>;
