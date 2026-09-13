export interface HeroSection {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    created_at: string;
}
export interface ArticleImage {
    id: number;
    image: string;
    caption?: string | null;
}
export interface Article {
    id: number;
    title: string;
    category: string;
    description: string;
    content: string;
    featured_image: string;
    images: ArticleImage[];
    created_at: string;
}
export interface ArticleQueryParams {
    category?: string;
    search?: string;
    ordering?: "created_at" | "-created_at";
    page?: number;
}
/**
 * Fetch all articles with optional filters, search, and ordering
 * @param params ArticleQueryParams
 * @returns Article[]
 */
export declare const getArticles: (params?: ArticleQueryParams) => Promise<Article[]>;
/**
 * Fetch a single article by ID
 * @param id Article ID
 * @returns Article
 */
export declare const getArticleById: (id: number) => Promise<Article>;
/**
 * Fetch the latest hero section (if multiple, returns the first)
 * @returns HeroSection
 */
export declare const getHeroSection: () => Promise<HeroSection | null>;
