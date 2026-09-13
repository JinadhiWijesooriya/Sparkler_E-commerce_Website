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
export interface PageHeroImage {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    background_image: string;
    created_at: string;
}
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
/**
 * Get all shop sets with optional filters, search, ordering, and pagination
 */
export declare const getShopSets: (params?: ShopSetQueryParams) => Promise<{
    results: ShopSetProduct[];
    count?: number;
    next?: string;
    previous?: string;
}>;
/**
 * Get a single shop set product by ID
 */
export declare const getShopSetById: (id: number) => Promise<ShopSetProduct>;
/**
 * Get the latest page-level hero image
 */
export declare const getHeroImage: () => Promise<PageHeroImage | null>;
/**
 * Helper: Map frontend filter values to backend values
 */
export declare const mapFiltersToBackend: (filters: {
    gem?: "Diamond" | "Ruby" | "Emerald" | "Sapphire";
    metal?: "Gold" | "Silver" | "Platinum";
    availability?: "in_stock" | "out_of_stock";
    price_gte?: number;
    price_lte?: number;
    ordering?: "price" | "-price" | "name" | "-name" | "carat" | "-carat";
    carat?: number;
}) => ShopSetQueryParams;
