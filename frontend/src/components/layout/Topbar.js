"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaShoppingCart, FaGem, FaChevronDown } from "react-icons/fa";
import CurrencySwitcher from "../common/CurrencySwitcher";
import SearchBar from "../common/SearchBar";
import LoginModal from "../modal/LoginModal";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/useCart";
export default function TopBar() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, error } = useAuth();
    const { items } = useCart();
    const cartItemCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;
    /* ---------------- Disable scroll when modal open ---------------- */
    useEffect(() => {
        document.body.style.overflow = isLoginOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isLoginOpen]);
    /* ---------------- Logout ---------------- */
    const handleLogout = async () => {
        try {
            await logout(); // auto-refresh-safe
            setIsProfileOpen(false);
            window.location.href = "/";
        }
        catch (err) {
            console.error("Logout failed:", err);
        }
    };
    /* ---------------- Username shortener ---------------- */
    const displayName = (name) => {
        if (!name)
            return "";
        return name.length > 10 ? name.slice(0, 10) + "…" : name;
    };
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "relative z-[60] bg-[#1A1A1A] border-b border-[#C9A24D]/30 shadow-md", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: [_jsxs("div", { className: "flex items-center justify-between gap-4 relative", children: [_jsxs("div", { onClick: () => (window.location.href = "/"), className: "flex items-center gap-2 cursor-pointer flex-shrink-0 group", children: [_jsx(FaGem, { className: "text-[#C9A24D] text-2xl group-hover:scale-110 transition-transform" }), _jsx("span", { className: "text-[#EDEDED] font-serif tracking-wide group-hover:text-[#C9A24D] text-sm sm:text-base md:text-lg whitespace-nowrap", children: "Authentic Sri Lankan Gems" })] }), _jsx("div", { className: "flex-1 hidden lg:block", children: _jsx(SearchBar, {}) }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0", children: [_jsx(CurrencySwitcher, {}), !user ? (_jsxs("button", { onClick: () => setIsLoginOpen(true), className: "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-[#C9A24D]/50 text-[#EDEDED] hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition flex-shrink-0", children: [_jsx(FaUser, {}), _jsx("span", { className: "hidden sm:inline", children: "Login" })] })) : (_jsxs("div", { className: "relative", onMouseEnter: () => setIsProfileOpen(true), onMouseLeave: () => setIsProfileOpen(false), children: [_jsxs("button", { className: "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-[#C9A24D]/50 text-[#EDEDED] hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition flex-shrink-0 whitespace-nowrap", children: [_jsx(FaUser, {}), _jsx("span", { className: "hidden sm:inline max-w-[120px] truncate", children: displayName(user.name) }), _jsx(FaChevronDown, { className: "text-sm" })] }), _jsx(AnimatePresence, { children: isProfileOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, className: "absolute right-0 mt-2 w-40 bg-[#1A1A1A] border border-[#C9A24D]/40 rounded-lg shadow-lg overflow-hidden z-50", children: [_jsx("button", { onClick: () => {
                                                                    setIsProfileOpen(false);
                                                                    window.location.href = "/dashboard";
                                                                }, className: "w-full text-left px-4 py-2 hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition", children: "Dashboard" }), _jsx("button", { onClick: handleLogout, className: "w-full text-left px-4 py-2 hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition", children: "Logout" })] })) })] })), _jsxs("button", { onClick: () => (window.location.href = "/cart"), className: "relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-[#C9A24D]/50 text-[#EDEDED] hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition flex-shrink-0 group", children: [_jsx(FaShoppingCart, { className: "text-lg" }), _jsx("span", { className: "hidden sm:inline", children: "Cart" }), cartItemCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1A1A1A] group-hover:border-[#C9A24D] transition-colors", children: cartItemCount }))] })] })] }), _jsx("div", { className: "mt-3 lg:hidden relative z-10", children: _jsx(SearchBar, {}) })] }) }), _jsx(AnimatePresence, { children: isLoginOpen && !user && (_jsxs(motion.div, { className: "fixed inset-0 z-[100] flex items-center justify-center", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [_jsx("div", { className: "absolute inset-0 bg-black/60", onClick: () => setIsLoginOpen(false) }), _jsx(LoginModal, { onClose: () => setIsLoginOpen(false), onSuccess: () => setIsLoginOpen(false) })] })) }), error && (_jsx("div", { className: "fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50", children: error }))] }));
}
