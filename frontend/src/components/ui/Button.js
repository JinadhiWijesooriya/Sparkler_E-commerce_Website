"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
export default function Button({ children, variant = "primary", className = "", onClick, }) {
    return (_jsxs(motion.button, { onClick: onClick, whileHover: { scale: 1.07 }, whileTap: { scale: 0.95 }, whileFocus: { outline: "none" }, className: `
        relative px-7 py-3 sm:px-8 sm:py-4 rounded-3xl text-base sm:text-lg font-semibold uppercase tracking-wide transition-all duration-300 transform select-none
        ${variant === "primary"
            ? "bg-[#C9A24D] text-[#1A1A1A] hover:bg-[#B08B3E]"
            : "border border-[#C9A24D] text-[#C9A24D] bg-transparent hover:bg-[#C9A24D] hover:text-[#1A1A1A]"}
        ${className}
      `, children: [variant === "primary" && (_jsx("span", { className: "absolute inset-0 rounded-3xl bg-gradient-to-r from-[#C9A24D]/30 via-[#FFD700]/20 to-[#B08B3E]/30 opacity-70 blur-xl pointer-events-none animate-pulse" })), _jsx("span", { className: "relative z-10", children: children })] }));
}
