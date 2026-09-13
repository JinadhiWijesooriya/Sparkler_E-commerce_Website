"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
export default function Loader() {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-24 gap-4 bg-[#1A1A1A]", children: [_jsxs(motion.div, { animate: { rotate: 360 }, transition: { repeat: Infinity, duration: 1.6, ease: "linear" }, className: "relative w-16 h-16 rounded-full border-2 border-[#C9A24D]/40", children: [_jsx(motion.div, { animate: { rotate: -360 }, transition: { repeat: Infinity, duration: 1.2, ease: "linear" }, className: "absolute inset-1 rounded-full border-2 border-transparent border-t-[#C9A24D] border-r-[#B08B3E]" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("div", { className: "w-3 h-3 rounded-full bg-[#C9A24D] shadow-[0_0_15px_rgba(201,162,77,0.8)]" }) })] }), _jsx("p", { className: "text-sm tracking-widest uppercase text-[#BDBDBD]", children: "Loading" })] }));
}
