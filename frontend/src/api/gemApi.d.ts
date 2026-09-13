export interface GemImage {
    id: number;
    image: string;
    alt_text: string | null;
}
export interface Gem {
    id: number;
    name: string;
    gem_type: string;
    weight_carat: number;
    shape: string;
    color: string;
    origin: string;
    clarity: string | null;
    treatment: string | null;
    dimensions: string | null;
    price: number;
    description: string | null;
    certification: string | null;
    availability: boolean;
    images: GemImage[];
    created_at: string;
}
export interface GemHero {
    id: number;
    title: string;
    subtitle: string | null;
    background_image: string;
}
export interface GemQueryParams {
    gem_type?: string;
    origin?: string;
    shape?: string;
    search?: string;
}
export declare const getGems: (params?: GemQueryParams) => Promise<Gem[]>;
export declare const getGemById: (id: number) => Promise<Gem>;
export declare const getGemHero: () => Promise<GemHero | null>;
