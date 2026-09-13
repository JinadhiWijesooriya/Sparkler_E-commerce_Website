import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HomeApi } from "../../api/api";
/* ---------------- Sparkles (static visual effect) ---------------- */
const sparkles = Array.from({ length: 40 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
}));
/* ---------------- Component ---------------- */
export default function FeaturedCollections() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const data = await HomeApi.getHomepageData();
                setCollections(data.collections || []);
            }
            catch (error) {
                console.error("Failed to load collections", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCollections();
    }, []);
    /* ---------------- Loading ---------------- */
    if (loading) {
        return (_jsx("section", { className: "py-16 sm:py-24 bg-[#1A1A1A] text-center text-[#C9A24D] text-sm sm:text-base", children: "Loading collections..." }));
    }
    if (!collections.length)
        return null;
    return (_jsxs("section", { className: "relative py-16 sm:py-24 overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#1F1F1F] via-[#1A1A1A] to-[#0D0D0D]" }), _jsxs("div", { className: "absolute inset-0", children: [_jsx("div", { className: "absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#C9A24D]/10 top-10 left-1/4 blur-3xl animate-pulse-slow" }), _jsx("div", { className: "absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-[#C9A24D]/20 bottom-20 right-1/3 blur-2xl animate-pulse-slower" })] }), _jsx("div", { className: "absolute inset-0 pointer-events-none", children: sparkles.map((s, i) => (_jsx(motion.div, { className: "absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#C9A24D] rounded-full opacity-40", style: { top: s.top, left: s.left }, animate: { y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }, transition: {
                                duration: s.duration,
                                repeat: Infinity,
                                repeatType: "mirror",
                                delay: s.delay,
                            } }, i))) })] }), _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 z-10", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, className: "mb-10 sm:mb-14 text-center md:text-left", children: [_jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl font-heading text-[#EDEDED]", children: "Featured Collections" }), _jsx("p", { className: "mt-3 text-sm sm:text-base text-[#BDBDBD] max-w-xl mx-auto md:mx-0", children: "Explore our most loved jewelry collections, crafted with precision, heritage, and timeless elegance." })] }), _jsx("div", { className: "\n            grid\n            grid-cols-1\n            sm:grid-cols-2\n            md:grid-cols-3\n            lg:grid-cols-4\n            gap-6 sm:gap-8\n          ", children: collections.map((c, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: {
                                duration: 0.7,
                                delay: index * 0.15,
                                ease: [0.16, 1, 0.3, 1],
                            }, whileHover: { y: -6, scale: 1.03 }, className: "\n                group relative\n                rounded-2xl sm:rounded-3xl\n                overflow-hidden\n                border border-[#C9A24D]/30\n                bg-black/40\n                shadow-xl\n              ", children: [_jsx(Link, { to: `/collections/${c.slug}`, children: _jsxs("div", { className: "relative h-56 sm:h-64 md:h-72 overflow-hidden", children: [_jsx("img", { src: c.image, alt: c.name, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" })] }) }), _jsx("div", { className: "absolute inset-0 flex items-end p-4 sm:p-6", children: _jsxs("div", { className: "w-full space-y-3", children: [_jsx("h3", { className: "text-lg sm:text-xl font-semibold text-[#EDEDED]", children: c.name }), _jsx(Link, { to: "/sets", className: "\n                      inline-flex items-center justify-center\n                      rounded-full\n                      border border-[#C9A24D]/60\n                      px-4 sm:px-5\n                      py-2\n                      text-xs sm:text-sm\n                      font-medium\n                      text-[#C9A24D]\n                      backdrop-blur-sm\n                      transition-all duration-300\n                      hover:bg-[#C9A24D]\n                      hover:text-black\n                      hover:shadow-[0_0_25px_rgba(201,162,77,0.5)]\n                    ", children: "Explore Collection \u2192" })] }) }), _jsx("div", { className: "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_60px_rgba(201,162,77,0.15)]" })] }, c.slug))) })] })] }));
}
