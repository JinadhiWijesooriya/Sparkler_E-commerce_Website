"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
export default function Badge({ label }) {
    return (_jsx(motion.span, { whileHover: { scale: 1.1, boxShadow: "0 0 12px rgba(201,162,77,0.6)" }, whileTap: { scale: 0.95 }, className: "inline-block text-xs font-semibold px-4 py-1.5 rounded-full \n                 bg-gradient-to-r from-[#C9A24D]/40 to-[#B08B3E]/40 \n                 text-[#EDEDED] border border-[#C9A24D]/50 shadow-md \n                 tracking-wide uppercase select-none transition-all duration-300", children: label }));
}
