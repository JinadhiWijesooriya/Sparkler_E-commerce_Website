export interface JewelryType {
    id: number;
    name: string;
}
export interface Gem {
    id: number;
    name: string;
    multiplier: number;
    image: string;
}
export interface Metal {
    id: number;
    name: string;
    multiplier: number;
    image: string;
}
export interface SuggestedItem {
    id: number;
    jewelry_type: JewelryType;
    gem: Gem;
    metal: Metal;
    image: string;
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
    created_at: string;
}
export interface HeroSection {
    id: number;
    title: string;
    subtitle?: string | null;
    image: string;
}
export interface SuggestedItemQueryParams {
    jewelry_type?: number;
    gem?: number;
    metal?: number;
    search?: string;
}
export interface WishlistItem {
    id: number;
    user: number;
    suggested_item: number;
    suggested_item_detail: SuggestedItem;
    added_at: string;
}
export declare const getHeroSections: () => Promise<HeroSection[]>;
export declare const getJewelryTypes: () => Promise<JewelryType[]>;
export declare const getGems: () => Promise<Gem[]>;
export declare const getMetals: () => Promise<Metal[]>;
export declare const getSuggestedItems: (params?: SuggestedItemQueryParams) => Promise<SuggestedItem[]>;
export declare const getCustomOrders: () => Promise<CustomOrder[]>;
export declare const getCustomOrderById: (id: number) => Promise<CustomOrder>;
export declare const createCustomOrder: (data: Omit<CustomOrder, "id" | "created_at">) => Promise<CustomOrder>;
export declare const updateCustomOrder: (id: number, data: Partial<Omit<CustomOrder, "id" | "created_at">>) => Promise<CustomOrder>;
export declare const deleteCustomOrder: (id: number) => Promise<void>;
