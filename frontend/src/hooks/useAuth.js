"use client";
import { useContext } from "react";
import { AuthContext } from "../context/authContextValue";
// Enhanced hook ensuring user object is always typed correctly
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    // Optional: ensure name & email are always defined
    const safeUser = context.user
        ? { ...context.user, name: context.user.name || "", email: context.user.email || "" }
        : null;
    return {
        ...context,
        user: safeUser,
    };
}
