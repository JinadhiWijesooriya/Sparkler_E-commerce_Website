import axios from "axios";

// ---------------- BASE URL ----------------
const BASE_URL = "http://127.0.0.1:8000/api/contact"; // include /api/contact

// ---------------- AXIOS INSTANCE ----------------
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------------- TYPES ----------------
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

// ---------------- API FUNCTIONS ----------------

export const getContactInfo = async (): Promise<ContactInfo> => {
  try {
    const response = await api.get<ContactInfo>("/info/"); // now resolves to /api/contact/info/
    return response.data;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    throw error;
  }
};

export const getContactHero = async (): Promise<ContactHero> => {
  try {
    const response = await api.get<ContactHero>("/hero/"); // resolves to /api/contact/hero/
    return response.data;
  } catch (error) {
    console.error("Error fetching contact hero:", error);
    throw error;
  }
};

export const createContactMessage = async (data: ContactMessage): Promise<ContactMessage> => {
  try {
    const response = await api.post<ContactMessage>("/messages/", data); // /api/contact/messages/
    return response.data;
  } catch (error) {
    console.error("Error creating contact message:", error);
    throw error;
  }
};
