declare const api: import("axios").AxiosInstance;
export declare const setTokens: (access: string, refresh: string) => void;
export declare const getAccessToken: () => string | null;
export declare const getRefreshToken: () => string | null;
export declare const clearTokens: () => void;
export interface User {
    id: string;
    email: string;
    name?: string;
}
export interface LoginPayload {
    email: string;
    password: string;
}
export interface RegisterPayload {
    email: string;
    password: string;
    first_name?: string;
    phone?: string;
}
export interface LoginResponse {
    user: User;
    access: string;
    refresh: string;
}
export interface ForgotPasswordPayload {
    email: string;
}
export interface ForgotPasswordResponse {
    message: string;
}
export interface ChangePasswordPayload {
    old_password: string;
    new_password: string;
}
export interface BackendCartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string | null;
}
export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    total_price: number;
}
export interface Order {
    full_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    country: string;
}
export interface CheckoutResponse {
    message: string;
    order_id?: string;
}
export declare const loginUser: (email: string, password: string) => Promise<LoginResponse>;
export declare const registerUser: (payload: RegisterPayload) => Promise<LoginResponse>;
export declare const refreshAccessToken: (refreshToken: string) => Promise<string | null>;
export declare const logoutUser: () => Promise<void>;
export declare const updateProfile: (payload: {
    email: string;
    name: string;
    phone?: string;
}) => Promise<{
    user: User;
}>;
export declare const changePassword: (payload: ChangePasswordPayload) => Promise<{
    message: string;
}>;
export declare const forgotPassword: (payload: ForgotPasswordPayload) => Promise<ForgotPasswordResponse>;
export declare const getCart: () => Promise<CartItem[]>;
export declare const addToCart: (shop_product?: number, sets_product?: number, quantity?: number) => Promise<CartItem[]>;
export declare const updateCartItem: (itemId: number, quantity: number) => Promise<CartItem[]>;
export declare const removeCartItem: (itemId: number) => Promise<CartItem[]>;
export declare const checkout: (order: Order) => Promise<CheckoutResponse>;
export default api;
