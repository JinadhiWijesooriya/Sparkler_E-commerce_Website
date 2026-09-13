export type ContactInfo = {
    email: string;
    phone: string;
    address: string;
};
export type ContactHero = {
    title: string;
    subtitle: string;
    background_image: string;
    map_url?: string;
};
export type ContactMessage = {
    id?: number;
    name: string;
    email: string;
    phone?: string | null;
    message: string;
    created_at?: string;
    read?: boolean;
};
export declare const getContactInfo: () => Promise<ContactInfo>;
export declare const getContactHero: () => Promise<ContactHero>;
export declare const createContactMessage: (data: ContactMessage) => Promise<ContactMessage>;
