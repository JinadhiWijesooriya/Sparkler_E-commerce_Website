import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { HomeApi } from "../../api/api";
/* ------------------ Animations ------------------ */
const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.15,
        },
    },
};
const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};
/* Trust line animation */
const trustContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.25,
        },
    },
};
const trustItem = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};
/* ------------------ Component ------------------ */
export default function HeroSection() {
    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchHero = async () => {
            try {
                const data = await HomeApi.getHomepageData();
                if (data.hero?.is_active) {
                    setHero(data.hero);
                }
            }
            catch (error) {
                console.error("Failed to load hero section", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchHero();
    }, []);
    if (loading) {
        return (_jsx("section", { className: "min-h-[100svh] bg-[#1A1A1A] flex items-center justify-center", children: _jsx("div", { className: "animate-pulse text-gold text-base sm:text-lg", children: "Loading..." }) }));
    }
    if (!hero)
        return null;
    const trustItems = [
        "🌍 Global Shipping",
        "💎 Certified Gemstones",
        "🛡️ Lifetime Warranty",
    ];
    return (_jsxs("section", { className: "relative min-h-[100svh] md:min-h-[85vh] flex items-center justify-center bg-[#1A1A1A] overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0", children: [_jsx(motion.img, { src: hero.background_image, alt: hero.title, className: "w-full h-full object-cover object-center", initial: { scale: 1.08 }, animate: { scale: 1 }, transition: { duration: 6, ease: [0.16, 1, 0.3, 1] } }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/80" })] }), "/*", _jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "\n          relative z-10\n          w-full max-w-3xl\n          mx-4 sm:mx-6\n          text-center\n          px-5 sm:px-8 md:px-10\n          py-8 sm:py-10 md:py-12\n          backdrop-blur-xl\n          bg-black/30\n          border border-gold/40\n          rounded-2xl md:rounded-3xl\n          shadow-2xl\n        ", children: [_jsx(motion.span, { variants: itemVariants, className: "\n            inline-block\n            px-4 py-1\n            text-[10px] sm:text-xs\n            tracking-widest uppercase\n            bg-gold/20 text-gold\n            rounded-full font-semibold\n          ", children: hero.badge_text }), _jsx(motion.h1, { variants: itemVariants, className: "\n            mt-4\n            text-3xl sm:text-4xl md:text-6xl\n            font-heading\n            text-gold\n            leading-tight\n          ", children: hero.title }), _jsx(motion.p, { variants: itemVariants, className: "mt-4 text-sm sm:text-base md:text-xl text-textPrimary", children: hero.subtitle }), _jsxs(motion.div, { variants: itemVariants, className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5", children: [_jsx(Link, { to: "/shop", className: "w-full sm:w-auto", children: _jsx(Button, { variant: "primary", className: "px-8 py-3 text-base md:text-lg", children: "Shop Our Collection" }) }), _jsx(Link, { to: "/custom", className: "w-full sm:w-auto", children: _jsx(Button, { variant: "outline", className: "px-8 py-3 text-base md:text-lg", children: "Design With Us" }) })] }), _jsx(motion.div, { variants: trustContainer, initial: "hidden", animate: "visible", className: "mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] sm:text-sm text-textSecondary", children: trustItems.map((item, index) => (_jsxs(motion.span, { variants: trustItem, className: "flex items-center gap-2", children: [item, index !== trustItems.length - 1 && (_jsx("span", { className: "opacity-50", children: "\u2022" }))] }, index))) })] })] }));
}
