"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import ProductFilters from "../components/product/ProductFilters";
import { getGems, getGemHero, } from "../api/gemApi";
/* ---------------- HELPER ---------------- */
const truncateText = (text, wordLimit) => {
    if (!text)
        return "";
    const words = text.split(" ");
    return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
};
/* ---------------- GEMS PAGE ---------------- */
export default function GemsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const gemsRef = useRef(null);
    const [gems, setGems] = useState([]);
    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    /* ---------------- SCROLL TO GEMS ---------------- */
    const scrollToGems = () => {
        gemsRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    /* ---------------- FETCH HERO ---------------- */
    useEffect(() => {
        const loadHero = async () => {
            try {
                const heroData = await getGemHero();
                setHero(heroData);
            }
            catch (err) {
                console.error("Error loading gem hero:", err);
                setHero(null);
            }
        };
        loadHero();
    }, []);
    /* ---------------- FETCH GEMS ---------------- */
    const fetchGems = useCallback(async (filters) => {
        try {
            setLoading(true);
            setError(null);
            const finalFilters = {
                ...(search ? { search } : {}),
                ...filters,
            };
            const data = await getGems(finalFilters);
            const mapped = data.map((g) => ({
                id: g.id,
                name: `${g.name} (${g.weight_carat}ct)`,
                price: g.price,
                description: g.description ? truncateText(g.description, 20) : `${g.gem_type} - ${g.shape}`,
                images: g.images.length ? g.images.map((img) => img.image) : ["/placeholder.jpg"],
            }));
            setGems(mapped);
        }
        catch (err) {
            console.error(err);
            setError("Failed to load gems.");
            setGems([]);
        }
        finally {
            setLoading(false);
        }
    }, [search]);
    /* ---------------- INITIAL FETCH ---------------- */
    useEffect(() => {
        fetchGems();
    }, [fetchGems]);
    /* ---------------- APPLY FILTERS ---------------- */
    const handleApplyFilters = (filters) => {
        scrollToGems();
        fetchGems({
            ...filters,
            ...(search ? { search } : {}),
        });
    };
    /* ---------------- RENDER ---------------- */
    return (_jsxs("section", { className: "bg-black min-h-screen text-[#EDEDED] overflow-hidden", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1 }, className: "relative h-[70vh] flex items-center justify-center text-center px-4 sm:px-6 md:px-12 overflow-hidden", children: [hero?.background_image && (_jsx(motion.div, { initial: { scale: 1.1 }, animate: { scale: 1 }, transition: { duration: 3 }, className: "absolute inset-0 bg-cover bg-center", style: { backgroundImage: `url(${hero.background_image})` } })), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" }), _jsxs("div", { className: "relative z-10 max-w-4xl px-2 sm:px-4", children: [_jsx(motion.span, { initial: { opacity: 0, letterSpacing: "0.1em" }, animate: { opacity: 1, letterSpacing: "0.4em" }, transition: { delay: 0.5, duration: 1 }, className: "text-[#C9A24D] text-xs sm:text-sm font-bold uppercase mb-4 block", children: "Premium Collection" }), _jsx("h1", { className: "text-5xl sm:text-6xl md:text-8xl font-black mb-4 sm:mb-8 tracking-tighter", children: hero?.title ?? (_jsxs(_Fragment, { children: ["Rare & ", _jsx("span", { className: "text-[#C9A24D]", children: "Eternal Gems" })] })) }), _jsx("p", { className: "text-white/60 text-lg sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed", children: hero?.subtitle ?? "Directly sourced from the heart of Ceylon. GSA & EGL certified treasures." }), _jsx("button", { onClick: scrollToGems, className: "px-10 py-4 bg-[#C9A24D] text-black font-black uppercase tracking-widest text-sm rounded-full hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(201,162,77,0.3)]", children: "Explore Treasures" })] })] }), _jsxs("div", { ref: gemsRef, className: "max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-4 gap-12", children: [_jsx("aside", { className: "md:col-span-1 mb-8 md:mb-0 sticky top-24 h-fit", children: _jsxs("div", { className: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6", children: [_jsx("h3", { className: "text-xl font-bold text-white mb-6 border-b border-white/10 pb-4", children: "Refine Search" }), _jsx(ProductFilters, { target: "gem", onApply: handleApplyFilters })] }) }), _jsxs("div", { className: "md:col-span-3", children: [loading && (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx("div", { className: "w-12 h-12 border-4 border-[#C9A24D]/20 border-t-[#C9A24D] rounded-full animate-spin mb-4" }), _jsx("p", { className: "text-[#C9A24D] font-bold animate-pulse", children: "Curating Collection..." })] })), error && (_jsx("div", { className: "bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center", children: _jsx("p", { className: "text-red-400 font-bold", children: error }) })), !loading && !error && gems.length === 0 && (_jsx("div", { className: "bg-white/5 border border-white/10 p-20 rounded-[3rem] text-center", children: _jsx("p", { className: "text-white/40 text-xl font-medium italic", children: "No gems currently match your criteria." }) })), !loading && !error && gems.length > 0 && (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8", children: _jsx(AnimatePresence, { mode: "popLayout", children: gems.map((gem, index) => (_jsx(motion.div, { layout: true, initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { duration: 0.4, delay: index * 0.05 }, children: _jsx(ProductCard, { product: { ...gem, product_type: "gem" }, onClick: (id) => navigate(`/gem/${id}`) }) }, gem.id))) }) }))] })] })] }));
}
