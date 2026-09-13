import { createContext } from "react";
import type { AuthContextType } from "./authTypes";

// Only exports context to avoid Fast Refresh ESLint warning
export const AuthContext = createContext<AuthContextType | null>(null);
