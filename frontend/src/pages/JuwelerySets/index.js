"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, easeOut, useAnimation } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import ProductFilters from "../../components/product/ProductFilters";
import { getShopSets, getHeroImage, } from "../../api/shopSetsApi";
/* ---------------- ANIMATION ---------------- */
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };
/* ---------------- SPARKLES ---------------- */
const sparkles = Array.from({ length: 40 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 3,
}));
export default function SetPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const productRef = useRef(null);
    const gradientControls = useAnimation();
    const [products, setProducts] = useState([]);
    const [hero, setHero] = useState(null);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingHero, setLoadingHero] = useState(true);
    /* ---------------- IMAGE HELPER ---------------- */
    const getImageUrl = (url) => !url
        ? "/placeholder.jpg"
        : url.startsWith("http")
            ? url
            : `http://127.0.0.1:8000/${url.startsWith("/") ? url.slice(1) : url}`;
    /* ---------------- GRADIENT ANIMATION ---------------- */
    useEffect(() => {
        gradientControls.start({
            background: [
                "radial-gradient(circle at top, rgba(192,132,252,0.15), transparent 70%)",
                "radial-gradient(circle at bottom, rgba(244,114,182,0.15), transparent 70%)",
                "radial-gradient(circle at top, rgba(192,132,252,0.15), transparent 70%)",
            ],
            transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        });
    }, [gradientControls]);
    /* ---------------- FETCH HERO ---------------- */
    useEffect(() => {
        const fetchHero = async () => {
            setLoadingHero(true);
            try {
                const heroData = await getHeroImage();
                if (heroData)
                    setHero(heroData);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoadingHero(false);
            }
        };
        fetchHero();
    }, []);
    /* ---------------- FETCH PRODUCTS ---------------- */
    const fetchProducts = useCallback(async (filters) => {
        setLoadingProducts(true);
        try {
            const finalFilters = { ...(search ? { search } : {}), ...filters };
            const data = await getShopSets(finalFilters);
            setProducts(data.results);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoadingProducts(false);
        }
    }, [search]);
    /* ---------------- INITIAL FETCH ---------------- */
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    /* ---------------- APPLY FILTERS ---------------- */
    const handleApplyFilters = async (filters) => {
        await fetchProducts({ ...filters, ...(search ? { search } : {}) });
        productRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    /* ---------------- SCROLL ---------------- */
    const scrollToProducts = () => {
        if (productRef.current) {
            const yOffset = -120;
            const y = productRef.current.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };
    return (_jsxs("section", { className: "min-h-screen bg-[#1A1A1A] text-[#EDEDED] relative overflow-hidden", children: [_jsxs("div", { className: "relative h-[60vh] sm:h-[65vh] md:h-[70vh] flex flex-col items-center justify-center overflow-hidden", children: [loadingHero ? (_jsx("div", { className: "absolute inset-0 bg-black/80 flex items-center justify-center animate-pulse", children: _jsx("p", { className: "text-[#C9A24D] font-bold text-lg sm:text-2xl", children: "Loading hero..." }) })) : hero ? (_jsx(motion.div, { initial: { scale: 1.1, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 2.5, ease: easeOut }, className: "absolute inset-0 bg-cover bg-center", style: { backgroundImage: `url(${getImageUrl(hero.background_image)})` } })) : (_jsx("div", { className: "absolute inset-0 bg-black/80 flex items-center justify-center", children: _jsx("p", { className: "text-[#C9A24D] font-bold text-lg sm:text-2xl", children: "Hero image not available" }) })), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40" }), _jsxs(motion.div, { variants: stagger, initial: "hidden", animate: "visible", className: "relative z-10 text-center px-4 sm:px-6", children: [_jsx(motion.h1, { variants: fadeUp, className: "text-4xl sm:text-5xl md:text-6xl font-bold text-[#C9A24D] mb-4 sm:mb-6", children: hero?.title || "Timeless Jewelry Sets" }), _jsx(motion.p, { variants: fadeUp, className: "max-w-xl sm:max-w-2xl mx-auto text-[#EDEDED]/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-6", children: hero?.subtitle || "Crafted to perfection. Designed to be worn together." }), _jsx(motion.button, { onClick: scrollToProducts, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "px-8 py-3 rounded-full bg-[#C9A24D] text-black font-semibold shadow-lg hover:shadow-2xl transition-all", children: "Explore Collections" })] })] }), _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 z-0", children: [_jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [sparkles.map((s, i) => (_jsx(motion.div, { className: "absolute w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gradient-to-tr from-[#C084FC]/60 to-[#F472B6]/60", style: { top: s.top, left: s.left }, animate: { y: [0, -8, 0], opacity: [0.2, 0.8, 0.2] }, transition: {
                                    duration: s.duration,
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    delay: s.delay,
                                } }, i))), _jsx(motion.div, { animate: gradientControls, className: "absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full top-0 left-1/4 blur-3xl" })] }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10", ref: productRef, children: [_jsx(motion.aside, { initial: { opacity: 0, x: -40 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8, ease: easeOut }, viewport: { once: true }, className: "w-full lg:w-1/4 mb-8 lg:mb-0", children: _jsx(motion.div, { whileHover: { y: -3 }, transition: { duration: 0.3 }, className: "sticky top-24 lg:top-28 rounded-3xl bg-[#0D0D0D]/80 border border-[#C9A24D]/20 p-4 sm:p-6 shadow-2xl", children: _jsx(ProductFilters, { onApply: handleApplyFilters }) }) }), _jsx("div", { className: "w-full lg:w-3/4", children: loadingProducts ? (_jsx("p", { className: "text-center text-[#C9A24D]", children: "Loading products..." })) : products.length === 0 ? (_jsx("p", { className: "text-center text-[#C9A24D]", children: "No products found." })) : (_jsx(motion.div, { variants: stagger, initial: "hidden", whileInView: "visible", viewport: { once: true }, className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6", children: products.map((product) => (_jsx(motion.div, { variants: fadeUp, whileHover: { y: -6 }, transition: { duration: 0.35, ease: easeOut }, children: _jsx(ProductCard, { product: {
                                                id: product.id,
                                                name: product.name,
                                                description: product.description ?? "",
                                                images: [product.image_main, product.image_secondary || product.image_main],
                                                price: product.price,
                                                product_type: "set",
                                            }, onClick: (id) => navigate(`/productSet/${id}`) }) }, product.id))) })) })] })] })] }));
}
