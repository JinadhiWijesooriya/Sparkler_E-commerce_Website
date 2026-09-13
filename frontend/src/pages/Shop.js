"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import ProductFilters from "../components/product/ProductFilters";
import { getProducts, getShopHero, } from "../api/shopApi";
/* ---------------- HELPER ---------------- */
const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
};
/* ---------------- SHOP PAGE ---------------- */
export default function ShopPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const productsRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    /* ---------------- SCROLL TO PRODUCTS ---------------- */
    const scrollToProducts = () => {
        productsRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    /* ---------------- FETCH HERO ---------------- */
    useEffect(() => {
        const loadHero = async () => {
            try {
                const heroData = await getShopHero();
                setHero(heroData);
            }
            catch (err) {
                console.error("Error loading hero:", err);
                setHero(null);
            }
        };
        loadHero();
    }, []);
    /* ---------------- FETCH PRODUCTS ---------------- */
    const fetchProducts = useCallback(async (filters) => {
        try {
            setLoading(true);
            setError(null);
            const finalFilters = {
                availability: true,
                ...(search ? { search } : {}),
                ...filters,
            };
            const data = await getProducts(finalFilters);
            const mapped = data.map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                description: p.description ? truncateText(p.description, 20) : "",
                images: p.images.length ? p.images.map((img) => img.image) : ["/placeholder.jpg"],
            }));
            setProducts(mapped);
        }
        catch (err) {
            console.error(err);
            setError("Failed to load products.");
            setProducts([]);
        }
        finally {
            setLoading(false);
        }
    }, [search] // <-- include search as dependency
    );
    /* ---------------- INITIAL FETCH ---------------- */
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    /* ---------------- APPLY FILTERS ---------------- */
    const handleApplyFilters = (filters) => {
        scrollToProducts();
        fetchProducts({
            ...filters,
            ...(search ? { search } : {}), // merge search query into filters
        });
    };
    /* ---------------- RENDER ---------------- */
    return (_jsxs("section", { className: "bg-[#1A1A1A] min-h-screen text-[#EDEDED] overflow-hidden", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1 }, className: "relative h-[60vh] flex items-center justify-center text-center px-4 sm:px-6 md:px-12 overflow-hidden", children: [hero?.background_image && (_jsx(motion.div, { initial: { scale: 1.1 }, animate: { scale: 1 }, transition: { duration: 3 }, className: "absolute inset-0 bg-cover bg-center", style: { backgroundImage: `url(${hero.background_image})` } })), _jsx("div", { className: "absolute inset-0 bg-black/70" }), _jsxs("div", { className: "relative z-10 max-w-3xl px-2 sm:px-4", children: [_jsx("h1", { className: "text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6", children: hero?.title ?? (_jsxs(_Fragment, { children: ["Discover ", _jsx("span", { className: "text-[#C9A24D]", children: "Exquisite Jewelry" })] })) }), _jsx("p", { className: "text-[#BDBDBD] text-base sm:text-lg mb-4 sm:mb-6", children: hero?.subtitle ?? "Handcrafted gems and timeless designs created to shine forever." }), _jsx("button", { onClick: scrollToProducts, className: "px-8 py-3 bg-[#C9A24D] rounded-full text-[#1A1A1A] font-semibold hover:scale-105 transition transform active:scale-95", children: "Shop Collection" })] })] }), _jsxs("div", { ref: productsRef, className: "max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10", children: [_jsx("aside", { className: "md:col-span-1 mb-8 md:mb-0 sticky top-20 z-10", children: _jsx(ProductFilters, { target: "product", onApply: handleApplyFilters }) }), _jsxs("div", { className: "md:col-span-3", children: [loading && (_jsx("p", { className: "text-center text-[#C9A24D] text-lg mb-6", children: "Loading products..." })), error && _jsx("p", { className: "text-center text-red-500 text-lg mb-6", children: error }), !loading && !error && products.length === 0 && (_jsx("p", { className: "text-center text-gray-400 text-lg mb-6", children: "No products found." })), !loading && !error && products.length > 0 && (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8", children: _jsx(AnimatePresence, { children: products.map((product, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 30 }, transition: { delay: index * 0.05 }, children: _jsx(ProductCard, { product: product, onClick: (id) => navigate(`/product/${id}`) }) }, product.id))) }) }))] })] })] }));
}
