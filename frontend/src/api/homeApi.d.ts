export interface Hero {
    badge_text: string;
    title: string;
    subtitle: string;
    background_image: string;
    is_active: boolean;
}
export interface Feature {
    title: string;
    is_active: boolean;
}
export interface Collection {
    name: string;
    image: string;
    slug: string;
    is_featured: boolean;
}
export interface CustomJewelryCTA {
    title: string;
    subtitle: string;
    background_image: string;
    is_active: boolean;
}
export interface Advertisement {
    title: string;
    description: string;
    image: string;
    link: string;
    is_active: boolean;
}
export interface ProductImage {
    image: string;
}
export interface Product {
    name: string;
    description: string;
    price: number;
    is_popular: boolean;
    images: ProductImage[];
}
export interface HomepageData {
    hero: Hero | null;
    features: Feature[];
    collections: Collection[];
    cta: CustomJewelryCTA | null;
    ads: Advertisement[];
    products: Product[];
}
export declare const getHomepageData: () => Promise<HomepageData>;
