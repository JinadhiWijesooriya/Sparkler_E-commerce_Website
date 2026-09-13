"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { getArticles, getHeroSection, } from "../api/blogApi";
export default function Blog() {
    const [hero, setHero] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    /* ---------------- FETCH HERO ---------------- */
    const fetchHero = async () => {
        try {
            const data = await getHeroSection();
            setHero(data);
        }
        catch {
            setError("Failed to load hero section.");
        }
    };
    /* ---------------- FETCH ARTICLES ---------------- */
    const fetchArticles = async () => {
        try {
            const data = await getArticles({ ordering: "-created_at", page: 1 });
            setArticles(data);
        }
        catch {
            setError("Failed to load articles.");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchHero();
        fetchArticles();
    }, []);
    /* ---------------- LOADING ---------------- */
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen text-[#C9A24D] text-lg sm:text-xl", children: "Loading..." }));
    }
    /* ---------------- ERROR ---------------- */
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen text-red-500 text-lg", children: error }));
    }
    /* ---------------- WHATSAPP HANDLER ---------------- */
    const handleWhatsAppConsultation = () => {
        const whatsappNumber = "94705696254"; // your number
        const message = `Hello! I would like to request a consultation regarding your jewelry and articles. I’m interested in learning more about your products and getting personalized guidance.`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank"); // Opens WhatsApp
    };
    return (_jsxs("section", { className: "bg-[#1A1A1A] text-[#EDEDED]", children: [hero && (_jsxs("section", { className: "relative h-[50vh] sm:h-[60vh] md:h-[65vh] flex items-center justify-center", children: [_jsx(motion.img, { initial: { scale: 1.08 }, animate: { scale: 1 }, transition: { duration: 2, ease: "easeOut" }, src: hero.image, alt: hero.title, className: "absolute inset-0 w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#1A1A1A]" }), _jsxs(motion.div, { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.35, duration: 0.9 }, className: "relative z-10 text-center max-w-3xl px-4 sm:px-6", children: [_jsx("p", { className: "text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#C9A24D] mb-4 sm:mb-6", children: "Journal" }), _jsx("h1", { className: "text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-6", children: hero.title }), _jsx("p", { className: "text-sm sm:text-base md:text-lg text-[#BDBDBD] mb-6 sm:mb-10", children: hero.subtitle }), articles.length > 0 && (_jsx(Link, { to: `/blog/${articles[0].id}`, children: _jsx(Button, { className: "px-6 sm:px-14 py-2 sm:py-4 rounded-full text-sm sm:text-base", children: "Explore Featured Story" }) }))] })] })), articles.length > 0 && (_jsx("section", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20", children: _jsxs(motion.div, { className: "relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center", children: [_jsx(motion.img, { initial: { opacity: 0, x: -50 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 1 }, src: articles[0].featured_image, alt: articles[0].title, className: "rounded-3xl w-full h-64 sm:h-80 md:h-[460px] object-cover shadow-[0_20px_60px_rgba(0,0,0,0.5)]" }), _jsxs(motion.div, { initial: { opacity: 0, x: 50 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 1 }, className: "mt-8 md:mt-0", children: [_jsx("span", { className: "text-xs sm:text-sm tracking-[0.3em] uppercase text-[#C9A24D]", children: "Featured Story" }), _jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl mt-4 sm:mt-6 mb-4 sm:mb-6", children: articles[0].title }), _jsx("p", { className: "text-sm sm:text-base md:text-lg text-[#BDBDBD] mb-6 sm:mb-12 leading-relaxed", children: articles[0].description }), _jsx(Link, { to: `/blog/${articles[0].id}`, children: _jsx(Button, { className: "px-6 sm:px-16 py-2 sm:py-4 rounded-full text-sm sm:text-base", children: "Read Full Article" }) })] })] }) })), _jsxs("section", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-28", children: [_jsx(motion.h2, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 }, className: "text-2xl sm:text-3xl md:text-4xl text-center mb-12 sm:mb-20", children: "Latest Articles" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-14", children: articles.slice(1).map((article, i) => (_jsxs(motion.article, { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.1, duration: 0.8 }, whileHover: { y: -6 }, className: "bg-[#1F1F1F] rounded-3xl overflow-hidden\n                border border-[#C9A24D]/20 hover:border-[#C9A24D]/50\n                shadow-lg hover:shadow-2xl transition", children: [_jsx("img", { src: article.featured_image, alt: article.title, className: "h-48 sm:h-60 w-full object-cover" }), _jsxs("div", { className: "p-6 sm:p-8 space-y-4", children: [_jsx("span", { className: "text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#C9A24D]", children: article.category }), _jsx("h3", { className: "text-lg sm:text-xl md:text-2xl", children: article.title }), _jsx("p", { className: "text-sm sm:text-base text-[#BDBDBD] leading-relaxed", children: article.description }), _jsx(Link, { to: `/blog/${article.id}`, className: "inline-block text-sm text-[#C9A24D] hover:text-[#B08B3E] transition", children: "Read Article \u2192" })] })] }, article.id))) })] }), _jsxs("section", { className: "relative bg-[#151515] py-16 sm:py-24 text-center px-4 sm:px-6", children: [_jsx(motion.h2, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "text-2xl sm:text-3xl md:text-4xl text-[#C9A24D] mb-6 sm:mb-8", children: "Experience True Craftsmanship" }), _jsx("p", { className: "text-sm sm:text-base md:text-lg text-[#BDBDBD] max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-14", children: "Explore handcrafted jewelry collections or book a private gemstone consultation with our experts." }), _jsxs("div", { className: "flex justify-center gap-3 sm:gap-6 flex-wrap", children: [_jsx(Link, { to: "/shop", children: _jsx(Button, { className: "px-6 sm:px-16 py-2 sm:py-4 rounded-full text-sm sm:text-base", children: "Shop Jewelry" }) }), _jsx(Button, { variant: "outline", className: "px-6 sm:px-16 py-2 sm:py-4 rounded-full text-sm sm:text-base", onClick: handleWhatsAppConsultation, children: "Book Consultation" })] })] })] }));
}
