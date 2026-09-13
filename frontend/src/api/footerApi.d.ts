/**
 * Matches backend PLATFORM_CHOICES exactly
 */
export type SocialPlatform = "instagram" | "facebook" | "linkedin" | "youtube" | "tiktok";
export interface SocialLink {
    id: number;
    name: SocialPlatform;
    url: string;
    order: number;
}
/**
 * Get all social links (ordered by backend)
 */
export declare const getSocialLinks: () => Promise<SocialLink[]>;
/**
 * Create a new social link
 */
export declare const createSocialLink: (data: Omit<SocialLink, "id">) => Promise<SocialLink>;
/**
 * Update an existing social link
 */
export declare const updateSocialLink: (id: number, data: Partial<Omit<SocialLink, "id">>) => Promise<SocialLink>;
/**
 * Delete a social link
 */
export declare const deleteSocialLink: (id: number) => Promise<void>;
