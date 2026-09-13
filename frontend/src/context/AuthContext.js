"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AuthContext } from "./authContextValue";
import { loginUser, registerUser, logoutUser as apiLogoutUser, updateProfile as apiUpdateProfile, changePassword as apiChangePassword, setTokens, clearTokens, } from "../api/accountsApi";
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // ---------------- LOGIN ----------------
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginUser(email, password);
            setTokens(res.access, res.refresh);
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // ---------------- SIGNUP ----------------
    const signup = async (email, password, name, phone) => {
        setLoading(true);
        setError(null);
        try {
            // Map `name` to `first_name` to match backend
            const payload = {
                email,
                password,
                first_name: name || "", // ✅ changed here
                phone: phone || "",
            };
            const res = await registerUser(payload);
            setTokens(res.access, res.refresh);
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Signup failed");
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // ---------------- LOGOUT ----------------
    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await apiLogoutUser();
        }
        catch {
            setError("Logout failed");
        }
        finally {
            setUser(null);
            clearTokens();
            localStorage.removeItem("user");
            setLoading(false);
        }
    };
    // ---------------- UPDATE PROFILE ----------------
    const updateProfile = async (email, name, phone) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await apiUpdateProfile({ email, name: name || "", phone: phone || "" });
            setUser(updated.user);
            localStorage.setItem("user", JSON.stringify(updated.user));
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Update profile failed");
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // ---------------- CHANGE PASSWORD ----------------
    const changePassword = async (oldPassword, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            await apiChangePassword({ old_password: oldPassword, new_password: newPassword });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Change password failed");
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // ---------------- AUTO-LOAD USER ----------------
    useEffect(() => {
        const loadUser = () => {
            const stored = localStorage.getItem("user");
            if (stored)
                setUser(JSON.parse(stored));
            else
                clearTokens();
        };
        loadUser();
    }, []);
    const contextValue = {
        user,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        loading,
        error,
    };
    return _jsx(AuthContext.Provider, { value: contextValue, children: children });
}
