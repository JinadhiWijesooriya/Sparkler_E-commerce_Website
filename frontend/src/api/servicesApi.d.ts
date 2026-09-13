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
export declare const getHeroSections: () => Promise<HeroSection[]>;
export declare const getServices: (params?: ServiceQueryParams) => Promise<Service[]>;
export declare const getServiceById: (id: number) => Promise<Service | null>;
