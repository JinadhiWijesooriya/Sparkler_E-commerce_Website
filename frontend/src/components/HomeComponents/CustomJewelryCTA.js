"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { HomeApi } from "../../api/api";
/* ---------------- Sparkles (visual effect) ---------------- */
const generateSparkles = () => Array.from({ length: 40 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
    opacity: 0.3 + Math.random() * 0.5,
}));
/* ---------------- Component ---------------- */
export default function CustomJewelryCTA() {
    const [cta, setCta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sparkles] = useState(generateSparkles);
    useEffect(() => {
        const fetchCTA = async () => {
            try {
                const data = await HomeApi.getHomepageData();
                if (data.cta?.is_active)
                    setCta(data.cta);
            }
            catch (error) {
                console.error("Failed to fetch custom jewelry CTA:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCTA();
    }, []);
    /* ---------------- Loading ---------------- */
    if (loading) {
        return (_jsx("section", { className: "py-16 sm:py-28 text-center text-[#C9A24D] bg-[#1A1A1A] text-sm sm:text-base", children: "Loading..." }));
    }
    if (!cta)
        return null;
    return (_jsxs("section", { className: "relative py-16 sm:py-28 overflow-hidden text-[#EDEDED]", children: [_jsxs("div", { className: "absolute inset-0", children: [_jsx("img", { src: cta.background_image, alt: cta.title, className: "w-full h-full object-cover brightness-75" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-[#1A1A1A]/70" })] }), sparkles.map((s, i) => (_jsx(motion.div, { className: "absolute rounded-full bg-[#C9A24D]", style: {
                    top: s.top,
                    left: s.left,
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                }, animate: { y: [0, -10, 0], opacity: [s.opacity, 1, s.opacity] }, transition: {
                    duration: s.duration,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: s.delay,
                } }, i))), _jsxs("div", { className: "relative max-w-3xl mx-auto px-4 sm:px-6 text-center z-10", children: [_jsx(motion.h2, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, className: "\n            text-3xl sm:text-4xl md:text-5xl\n            font-heading\n            mb-3 sm:mb-4\n            tracking-tight\n            text-[#C9A24D]\n          ", children: cta.title }), _jsx(motion.p, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }, className: "\n            text-sm sm:text-lg md:text-xl\n            text-[#BDBDBD]\n            mb-6 sm:mb-8\n          ", children: cta.subtitle }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }, children: _jsx(Link, { to: "/custom", children: _jsx(Button, { variant: "primary", className: "\n                bg-[#C9A24D]\n                text-[#1A1A1A]\n                py-3\n                px-6 sm:px-8\n                text-sm sm:text-base\n                rounded-3xl\n                font-semibold\n                shadow-lg\n                transition-all duration-300\n                hover:bg-[#B08B3E]\n                hover:shadow-[0_0_40px_rgba(201,162,77,0.5)]\n                transform hover:-translate-y-1\n                active:scale-95\n              ", children: "Start Custom Design" }) }) })] })] }));
}
