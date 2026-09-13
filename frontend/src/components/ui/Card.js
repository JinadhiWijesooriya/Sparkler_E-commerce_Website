"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
export default function Card({ children }) {
    return (_jsxs(motion.div, { whileHover: { scale: 1.03, boxShadow: "0 15px 40px rgba(201,162,77,0.5)" }, whileTap: { scale: 0.97 }, className: "relative bg-[#1A1A1A] border border-[#C9A24D]/30 rounded-3xl p-6 shadow-lg overflow-hidden transition-all duration-300", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-full rounded-3xl pointer-events-none bg-gradient-to-t from-[#C9A24D]/10 via-transparent to-transparent animate-pulse-slow" }), _jsx("div", { className: "absolute top-4 right-4 w-2 h-2 bg-[#C9A24D] rounded-full opacity-70 animate-pulse" }), _jsx("div", { className: "relative z-10", children: children })] }));
}
