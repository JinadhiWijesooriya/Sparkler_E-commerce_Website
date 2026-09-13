"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const images = ["/ring.jpg", "/ring2.jpg", "/ring3.jpg"];
export default function ProductGallery() {
    const [active, setActive] = useState(images[0]);
    return (_jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsx("div", { className: "flex md:flex-col gap-4", children: images.map((img) => (_jsx(motion.img, { src: img, alt: "Thumbnail", onClick: () => setActive(img), whileHover: { scale: 1.1, rotate: 1 }, className: `w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl cursor-pointer border-2 transition-all duration-300 ${active === img
                        ? "border-[#C9A24D] shadow-lg scale-110"
                        : "border-transparent hover:border-[#C9A24D]/50 hover:shadow-md"}` }, img))) }), _jsxs("div", { className: "relative w-full max-w-md", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.img, { src: active, alt: "Main Product", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.5, ease: "easeOut" }, className: "w-full object-cover rounded-3xl border border-[#C9A24D]/30 shadow-[0_20px_60px_rgba(201,162,77,0.5)]" }, active) }), _jsx("div", { className: "absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-t from-[#C9A24D]/10 via-transparent to-transparent animate-pulse-slow" }), _jsx(motion.button, { whileHover: { scale: 1.05, boxShadow: "0 0 20px rgba(201,162,77,0.5)" }, whileTap: { scale: 0.95 }, className: "absolute bottom-4 right-4 bg-[#C9A24D] text-[#1A1A1A] px-6 py-2 rounded-2xl font-bold shadow-lg hover:bg-[#B08B3E] transition-all duration-300", children: "Add to Cart" })] })] }));
}
