"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HomeApi } from "../../api/api";
import { AnimatePresence } from "framer-motion";
/* ---------------- Sparkles ---------------- */
const generateSparkles = () => Array.from({ length: 30 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 3,
}));
/* ---------------- HELPERS ---------------- */
const limitDescription = (desc, maxLength = 100) => !desc ? "" : desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;
function PopularProductCard({ product, maxDescriptionLength = 100, onClick, }) {
    const images = Array.isArray(product.images)
        ? product.images.filter((img) => Boolean(img))
        : [];
    const firstImage = images[0] ?? "/placeholder.jpg";
    const [activeImage, setActiveImage] = useState(firstImage);
    return (_jsxs(motion.div, { className: "bg-[#1A1A1A] border border-[#C9A24D]/30 rounded-3xl overflow-hidden cursor-pointer flex flex-col", whileHover: { scale: 1.03 }, onClick: () => onClick?.(product.id), children: [_jsxs("div", { className: "relative w-full", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.img, { src: activeImage, alt: product.name, className: "w-full h-64 object-cover", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }, activeImage) }), images.length > 1 && (_jsx("div", { className: "absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2", children: images.slice(0, 3).map((img, idx) => (_jsx("img", { src: img, alt: `thumbnail-${idx}`, onClick: (e) => {
                                e.stopPropagation();
                                setActiveImage(img);
                            }, className: `w-10 h-10 rounded-lg cursor-pointer border-2 object-cover ${activeImage === img ? "border-[#C9A24D]" : "border-transparent"}` }, idx))) }))] }), _jsxs("div", { className: "p-4 flex flex-col justify-between flex-1", children: [_jsx("h3", { className: "text-[#C9A24D] font-semibold", children: product.name }), _jsx("p", { className: "text-[#BDBDBD] text-sm mt-1", children: limitDescription(product.description, maxDescriptionLength) }), _jsxs("p", { className: "text-xl font-bold text-[#C9A24D] mt-2", children: ["LKR ", product.price] })] })] }));
}
/* ---------------- PopularProducts Component ---------------- */
export default function PopularProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sparkles] = useState(generateSparkles);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await HomeApi.getHomepageData();
                const popularProducts = data.products.filter((p) => p.is_popular);
                setProducts(popularProducts);
            }
            catch (error) {
                console.error("Failed to fetch popular products:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    if (loading) {
        return (_jsx("section", { className: "py-12 sm:py-16 text-center text-[#C9A24D] bg-[#1A1A1A] text-sm sm:text-base", children: "Loading popular products..." }));
    }
    if (products.length === 0)
        return null;
    return (_jsxs("section", { className: "relative py-12 sm:py-16 overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/popular-bg.jpg')]", children: [_jsx("div", { className: "absolute inset-0 bg-black/70" }), _jsx("div", { className: "absolute inset-0 pointer-events-none", children: sparkles.map((s, i) => (_jsx(motion.div, { className: "absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#C9A24D]/50", style: { top: s.top, left: s.left }, animate: { y: [0, -6, 0], opacity: [0.2, 0.8, 0.2] }, transition: {
                        duration: s.duration,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: s.delay,
                    } }, i))) }), _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 z-10", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, className: "mb-10 sm:mb-12 text-center md:text-left", children: [_jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl font-heading text-[#EDEDED] drop-shadow-lg", children: "Popular Products" }), _jsx("p", { className: "mt-2 text-sm sm:text-base text-[#BDBDBD] max-w-2xl mx-auto md:mx-0", children: "Discover our most loved jewelry pieces. Each product combines elegance, craftsmanship, and luxury designed to dazzle." })] }), _jsx(motion.div, { className: "\n            grid\n            grid-cols-1\n            sm:grid-cols-2\n            md:grid-cols-3\n            lg:grid-cols-4\n            gap-6 sm:gap-8\n          ", initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: { visible: { transition: { staggerChildren: 0.15 } } }, children: products.map((p, index) => (_jsx(motion.div, { variants: {
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }, children: _jsx(PopularProductCard, { product: {
                                    id: index,
                                    name: p.name,
                                    price: p.price,
                                    images: p.images.map((img) => img.image),
                                    description: p.description,
                                } }) }, index))) })] })] }));
}
