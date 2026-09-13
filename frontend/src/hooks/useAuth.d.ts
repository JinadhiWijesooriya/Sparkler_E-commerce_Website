import type { AuthContextType, User } from "../context/authTypes";
export declare function useAuth(): AuthContextType & {
    user: User | null;
};
