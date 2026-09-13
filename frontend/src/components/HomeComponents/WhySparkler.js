import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { HomeApi } from "../../api/api";
/* ---------------- Sparkles (static visual effect) ---------------- */
const generateSparkles = (count) => Array.from({ length: count }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 3,
}));
/* ---------------- Component ---------------- */
export default function WhySparkler() {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    // Reduce sparkle count on mobile for performance
    const sparkles = useMemo(() => generateSparkles(window.innerWidth < 640 ? 16 : 30), []);
    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const data = await HomeApi.getHomepageData();
                setFeatures(data.features || []);
            }
            catch (error) {
                console.error("Failed to fetch features:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchFeatures();
    }, []);
    /* ---------- Loading ---------- */
    if (loading) {
        return (_jsx("section", { className: "py-16 sm:py-24 bg-[#1A1A1A] text-center text-gold text-sm sm:text-base", children: "Loading features..." }));
    }
    if (!features.length)
        return null;
    return (_jsxs("section", { className: "relative py-16 sm:py-24 overflow-hidden bg-[#1A1A1A]", children: [_jsx("div", { className: "absolute inset-0 pointer-events-none", children: sparkles.map((s, i) => (_jsx(motion.div, { className: "absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#A78BFA]/60", style: { top: s.top, left: s.left }, animate: { y: [0, -8, 0], opacity: [0.2, 0.8, 0.2] }, transition: {
                        duration: s.duration,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: s.delay,
                    } }, i))) }), _jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#C084FC]/10 top-0 left-1/4 blur-3xl animate-pulse-slow" }), _jsx("div", { className: "absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-[#A78BFA]/20 bottom-10 right-1/3 blur-2xl animate-pulse-slower" })] }), _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 z-10", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 1, ease: "easeOut" }, className: "mb-12 sm:mb-16 text-center", children: [_jsx("h2", { className: "text-3xl sm:text-4xl md:text-5xl font-heading text-[#EDEDED]", children: "Why Sparkler?" }), _jsx("p", { className: "mt-3 text-sm sm:text-base md:text-lg text-[#BDBDBD] max-w-2xl mx-auto", children: "Experience the elegance, trust, and craftsmanship that makes our jewelry stand out. Every piece is a blend of precision and timeless beauty." })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10", children: features.map((f, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: {
                                duration: 0.8,
                                delay: 0.15 * index,
                                ease: [0.16, 1, 0.3, 1],
                            }, whileHover: { scale: 1.05 }, className: "\n                group relative\n                flex items-start gap-4\n                p-5 sm:p-6\n                bg-[#0D0D0D]/70\n                border border-[#A78BFA]/30\n                rounded-2xl\n                shadow-lg\n                transition-all duration-500\n                hover:shadow-[0_10px_50px_rgba(167,139,250,0.4)]\n              ", children: [_jsx(motion.span, { className: "\n                  flex-shrink-0\n                  w-9 h-9 sm:w-10 sm:h-10\n                  rounded-full\n                  bg-[#C9A24D]/30\n                  text-[#C9A24D]\n                  font-bold\n                  flex items-center justify-center\n                  text-lg sm:text-xl\n                  group-hover:bg-[#B08B3E]\n                  group-hover:text-[#1A1A1A]\n                  transition-colors duration-300\n                ", whileHover: { scale: 1.2 }, transition: { type: "spring", stiffness: 300 }, children: "\u2714" }), _jsx(motion.p, { className: "\n                  text-sm sm:text-base md:text-lg\n                  text-[#EDEDED]\n                  font-medium\n                  group-hover:text-[#C9A24D]\n                ", whileHover: { x: 4 }, transition: { type: "spring", stiffness: 300 }, children: f.title })] }, f.title))) })] })] }));
}
