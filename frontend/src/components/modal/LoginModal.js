"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import SignUpModal from "./SignUpModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
export default function LoginModal({ onClose, onSuccess }) {
    const { login } = useAuth();
    const [showSignUp, setShowSignUp] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
            onSuccess?.();
            onClose();
        }
        catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError("An unexpected error occurred.");
            }
        }
        finally {
            setLoading(false);
        }
    };
    // Toggle between SignUp & ForgotPassword modals
    if (showSignUp)
        return _jsx(SignUpModal, { onClose: () => setShowSignUp(false), onSuccess: onSuccess });
    if (showForgot)
        return _jsx(ForgotPasswordModal, { onClose: () => setShowForgot(false) });
    return (_jsxs(motion.div, { initial: { opacity: 0, y: -50, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -50, scale: 0.95 }, transition: { duration: 0.5, ease: "easeOut" }, className: "w-full max-w-md bg-[#1A1A1A] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden relative border border-[#C9A24D]/40", children: [_jsxs("div", { className: "bg-gradient-to-r from-[#1A1A1A] to-[#111111] px-8 py-6 text-center rounded-t-3xl border-b border-[#C9A24D]/30 relative overflow-hidden", children: [_jsx("h1", { className: "text-3xl font-bold text-[#C9A24D] tracking-widest drop-shadow-md animate-pulse", children: "SPARKLER" }), _jsx("p", { className: "mt-2 text-sm text-[#EDEDED]/80", children: "Authentic Sri Lankan Gems & Jewelry" }), _jsx(motion.div, { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C9A24D] via-[#B08B3E] to-[#C9A24D]", animate: { x: ["-100%", "100%"] }, transition: { duration: 2, repeat: Infinity, ease: "linear" } })] }), _jsxs("div", { className: "px-8 py-10 space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-semibold text-[#EDEDED]", children: "Welcome Back" }), _jsx("p", { className: "text-sm text-[#BDBDBD] mt-1", children: "Sign in to manage your account" })] }), error && _jsx("div", { className: "text-center text-sm text-red-500", children: error }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#EDEDED]/90 mb-2", children: "Email Address" }), _jsx("input", { type: "email", placeholder: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full px-5 py-3 rounded-2xl border bg-[#111111] text-[#EDEDED]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#EDEDED]/90 mb-2", children: "Password" }), _jsx("input", { type: "password", placeholder: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full px-5 py-3 rounded-2xl border bg-[#111111] text-[#EDEDED]" })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "button", onClick: () => setShowForgot(true), className: "text-sm text-[#C9A24D]", children: "Forgot password?" }) }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-3 rounded-2xl bg-[#C9A24D] text-[#1A1A1A] font-semibold text-lg disabled:opacity-50", children: loading ? "Signing in..." : "Sign In" })] }), _jsxs("div", { className: "text-center text-sm text-[#BDBDBD]", children: ["Don\u2019t have an account?", " ", _jsx("button", { onClick: () => setShowSignUp(true), className: "text-[#C9A24D]", children: "Create one" })] })] }), _jsx("button", { onClick: onClose, className: "absolute top-4 right-4 text-[#C9A24D] text-2xl", children: "\u00D7" })] }));
}
