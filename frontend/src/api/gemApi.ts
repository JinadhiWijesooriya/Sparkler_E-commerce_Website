import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/gems";

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

export const getGems = async (params?: GemQueryParams): Promise<Gem[]> => {
    const response = await axios.get(`${API_BASE_URL}/gems/`, { params });
    return response.data;
};

export const getGemById = async (id: number): Promise<Gem> => {
    const response = await axios.get(`${API_BASE_URL}/gems/${id}/`);
    return response.data;
};

export const getGemHero = async (): Promise<GemHero | null> => {
    const response = await axios.get(`${API_BASE_URL}/gem-hero/`);
    return response.data.length > 0 ? response.data[0] : null;
};
