// ---------------- USER & AUTH TYPES ----------------
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (email: string, name?: string, phone?: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}
