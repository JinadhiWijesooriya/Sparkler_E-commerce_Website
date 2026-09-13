"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Gem, Sparkles, Package, ArrowRight, Loader2, X, Compass } from "lucide-react";
import React from "react";
// API Imports
import { getProducts } from "../../api/shopApi";
import { getShopSets } from "../../api/shopSetsApi";
import { getGems } from "../../api/gemApi";
const CATEGORIES = [
    { name: "All Collections", icon: Compass, target: "all" },
    { name: "Fine Jewelry", icon: Package, target: "product" },
    { name: "Jewelry Sets", icon: Gem, target: "set" },
    { name: "Gemstones", icon: Gem, target: "gem" },
];
/* -------------------- COMPONENT -------------------- */
export default function SearchBar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [catOpen, setCatOpen] = useState(false);
    const [results, setResults] = useState({ products: [], sets: [], gems: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef(null);
    /* -------------------- SEARCH LOGIC -------------------- */
    const performSearch = useCallback(async (searchTerm) => {
        if (!searchTerm.trim()) {
            setResults({ products: [], sets: [], gems: [] });
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const [productRes, setRes, gemRes] = await Promise.all([
                getProducts({ search: searchTerm }),
                getShopSets({ search: searchTerm }),
                getGems({ search: searchTerm })
            ]);
            setResults({
                products: productRes.slice(0, 3),
                sets: setRes.results.slice(0, 3),
                gems: gemRes.slice(0, 3)
            });
            setShowResults(true);
        }
        catch (error) {
            console.error("Search failed:", error);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /* -------------------- DEBOUNCE -------------------- */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query)
                performSearch(query);
            else {
                setResults({ products: [], sets: [], gems: [] });
                setShowResults(false);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [query, performSearch]);
    /* -------------------- NAVIGATION -------------------- */
    const handleResultClick = (type, id) => {
        setShowResults(false);
        setQuery("");
        if (type === 'product')
            navigate(`/product/${id}`);
        if (type === 'set')
            navigate(`/productSet/${id}`);
        if (type === 'gem')
            navigate(`/gem/${id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleSearchSubmit = () => {
        if (!query.trim())
            return;
        setShowResults(false);
        let url = `/shop?search=${encodeURIComponent(query)}`;
        if (category.target === 'set')
            url = `/sets?search=${encodeURIComponent(query)}`;
        if (category.target === 'gem')
            url = `/gems?search=${encodeURIComponent(query)}`;
        navigate(url);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter")
            handleSearchSubmit();
        if (e.key === "Escape")
            setShowResults(false);
    };
    /* -------------------- CLICK OUTSIDE -------------------- */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setCatOpen(false);
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const hasResults = results.products.length > 0 || results.sets.length > 0 || results.gems.length > 0;
    return (_jsxs("div", { ref: containerRef, className: "relative w-full max-w-2xl z-[80]", children: [_jsxs("div", { className: `flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-300 border backdrop-blur-2xl shadow-2xl ${showResults ? 'bg-black/90 border-[#C9A24D]/50 shadow-[#C9A24D]/10' : 'bg-white/5 border-white/10 hover:border-white/20'}`, children: [_jsxs("div", { className: "relative border-r border-white/10 pr-3 hidden sm:block", children: [_jsxs("button", { onClick: () => setCatOpen((p) => !p), className: "flex items-center gap-2 text-xs text-[#C9A24D] font-bold uppercase tracking-widest hover:text-white transition-colors", children: [_jsx(category.icon, { size: 14 }), _jsx("span", { className: "truncate max-w-[80px]", children: category.name.split(' ')[0] }), _jsx(ChevronDown, { size: 12, className: `transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}` })] }), _jsx(AnimatePresence, { children: catOpen && (_jsx(motion.div, { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 15 }, className: "absolute left-0 mt-6 w-56 bg-black/95 border border-white/10 text-white rounded-[1.5rem] shadow-2xl overflow-hidden backdrop-blur-xl", children: _jsx("div", { className: "p-2 space-y-1", children: CATEGORIES.map((c) => (_jsxs("button", { onClick: () => {
                                                setCategory(c);
                                                setCatOpen(false);
                                            }, className: `flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all rounded-xl ${category.name === c.name ? 'bg-[#C9A24D] text-black' : 'hover:bg-white/5 text-white/60'}`, children: [_jsx(c.icon, { size: 16 }), c.name] }, c.name))) }) })) })] }), _jsxs("div", { className: "flex-1 flex items-center gap-3", children: [isLoading ? (_jsx(Loader2, { size: 18, className: "text-[#C9A24D] animate-spin" })) : (_jsx(Search, { size: 18, className: "text-[#C9A24D]" })), _jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), onFocus: () => query && setShowResults(true), onKeyDown: handleKeyDown, placeholder: `Search ${category.target === 'all' ? 'everything' : category.name.toLowerCase()}...`, className: "w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none font-medium h-6" }), query && (_jsx("button", { onClick: () => setQuery(""), className: "text-white/20 hover:text-white transition-colors", children: _jsx(X, { size: 16 }) }))] })] }), _jsx(AnimatePresence, { children: showResults && (query.length > 0) && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, className: "absolute top-full left-0 right-0 mt-4 bg-black/95 border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl z-[90]", children: [_jsx("div", { className: "max-h-[70vh] overflow-y-auto scrollbar-hide p-6 space-y-8", children: !hasResults && !isLoading ? (_jsxs("div", { className: "py-12 text-center space-y-3", children: [_jsx("div", { className: "w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto", children: _jsx(Search, { size: 24, className: "text-white/20" }) }), _jsxs("p", { className: "text-white/40 text-sm font-bold uppercase tracking-widest", children: ["No treasures found matching \"", query, "\""] })] })) : (_jsxs(_Fragment, { children: [results.products.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-[#C9A24D] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2", children: [_jsx(Package, { size: 12 }), " Fine Jewelry"] }), _jsx("div", { className: "grid gap-2", children: results.products.map(p => (_jsxs("button", { onClick: () => handleResultClick('product', p.id), className: "flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-left", children: [_jsx("img", { src: p.images?.[0]?.image || '/placeholder.jpg', className: "w-12 h-12 rounded-xl object-cover border border-white/10", alt: "" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-bold text-white group-hover:text-[#C9A24D] transition-colors", children: p.name }), _jsxs("p", { className: "text-[#C9A24D] text-xs font-medium", children: ["LKR ", p.price.toLocaleString()] })] }), _jsx(ArrowRight, { size: 14, className: "text-white/0 group-hover:text-[#C9A24D] group-hover:translate-x-1 transition-all" })] }, p.id))) })] })), results.sets.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-[#8B5CF6] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2", children: [_jsx(Gem, { size: 12 }), " Jewelry Sets"] }), _jsx("div", { className: "grid gap-2", children: results.sets.map(s => (_jsxs("button", { onClick: () => handleResultClick('set', s.id), className: "flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-left", children: [_jsx("img", { src: s.image_main, className: "w-12 h-12 rounded-xl object-cover border border-white/10", alt: "" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-bold text-white group-hover:text-[#8B5CF6] transition-colors", children: s.name }), _jsxs("p", { className: "text-[#8B5CF6] text-xs font-medium", children: ["LKR ", s.price.toLocaleString()] })] }), _jsx(ArrowRight, { size: 14, className: "text-white/0 group-hover:text-[#8B5CF6] group-hover:translate-x-1 transition-all" })] }, s.id))) })] })), results.gems.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-[#3B82F6] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2", children: [_jsx(Sparkles, { size: 12 }), " Rare Gemstones"] }), _jsx("div", { className: "grid gap-2", children: results.gems.map(g => (_jsxs("button", { onClick: () => handleResultClick('gem', g.id), className: "flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-left", children: [_jsx("img", { src: g.images?.[0]?.image || '/placeholder.jpg', className: "w-12 h-12 rounded-xl object-cover border border-white/10", alt: "" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-bold text-white group-hover:text-[#3B82F6] transition-colors", children: g.name }), _jsxs("p", { className: "text-[#3B82F6] text-xs font-medium", children: ["LKR ", g.price.toLocaleString()] })] }), _jsx(ArrowRight, { size: 14, className: "text-white/0 group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all" })] }, g.id))) })] }))] })) }), hasResults && (_jsx("div", { className: "p-4 bg-white/5 border-t border-white/10 text-center", children: _jsxs("button", { onClick: handleSearchSubmit, className: "text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A24D] hover:text-white transition-colors", children: ["View all results for \"", query, "\""] }) }))] })) })] }));
}
