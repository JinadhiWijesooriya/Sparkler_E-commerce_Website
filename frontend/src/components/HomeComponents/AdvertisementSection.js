"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HomeApi } from "../../api/api";
export default function AdvertisementSection() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState(null); // Track which ad is expanded
    const scrollRef = useRef(null);
    const isDown = useRef(false);
    const hasDragged = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    /* ---------------- Fetch Ads ---------------- */
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const data = await HomeApi.getHomepageData();
                setAds(data.ads || []);
            }
            catch (err) {
                console.error("Failed to load ads", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);
    /* ---------------- Drag Handlers ---------------- */
    const handleMouseDown = (e) => {
        if (!scrollRef.current)
            return;
        isDown.current = true;
        hasDragged.current = false;
        startX.current = e.pageX;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };
    const handleMouseMove = (e) => {
        if (!isDown.current || !scrollRef.current)
            return;
        const walk = e.pageX - startX.current;
        if (Math.abs(walk) > 6) {
            hasDragged.current = true;
            scrollRef.current.scrollLeft = scrollLeft.current - walk * 1.5;
        }
    };
    const stopDragging = () => {
        isDown.current = false;
    };
    if (loading) {
        return (_jsx("section", { className: "py-16 text-center bg-[#1A1A1A] text-[#C9A24D]", children: "Loading advertisements..." }));
    }
    if (!ads.length)
        return null;
    return (_jsx("section", { className: "relative py-16 bg-[#1A1A1A] overflow-hidden", children: _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto px-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold text-[#EDEDED]", children: "Exclusive Offers" }), _jsx("p", { className: "mt-3 max-w-2xl mx-auto text-[#BDBDBD]", children: "Handcrafted elegance and premium promotions designed just for you." })] }), _jsx("div", { ref: scrollRef, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: stopDragging, onMouseLeave: stopDragging, className: "flex gap-6 overflow-x-auto pb-6 cursor-grab active:cursor-grabbing select-none", children: ads.map((ad, index) => {
                        const promo = ad.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "");
                        const isExpanded = expandedIndex === index;
                        const shortDescription = ad.description.length > 100
                            ? ad.description.slice(0, 100) + "..."
                            : ad.description;
                        return (_jsxs(motion.div, { whileHover: { scale: 1.05 }, className: "min-w-[320px] relative rounded-3xl overflow-hidden shadow-xl", children: [_jsx("img", { src: ad.image, alt: ad.title, draggable: false, className: "w-full h-80 object-cover" }), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-transparent p-6 flex flex-col justify-end", children: [_jsx(motion.h3, { initial: { y: 20, opacity: 0 }, whileInView: { y: 0, opacity: 1 }, transition: { duration: 0.6, delay: 0.1 }, className: "text-[#e5a212] text-xl md:text-2xl font-bold", children: ad.title }), _jsxs(motion.p, { initial: { y: 20, opacity: 0 }, whileInView: { y: 0, opacity: 1 }, transition: { duration: 0.6, delay: 0.2 }, className: "text-white text-sm md:text-base mt-1 mb-4", children: [isExpanded ? ad.description : shortDescription, " ", ad.description.length > 100 && (_jsx("span", { className: "text-[#C9A24D] font-semibold cursor-pointer hover:underline", onClick: () => setExpandedIndex(isExpanded ? null : index), children: isExpanded ? "Show Less" : "Read More" }))] }), _jsx(Link, { to: `/shop?promo=${promo}`, onClick: (e) => {
                                                if (hasDragged.current)
                                                    e.preventDefault();
                                            }, className: "inline-block w-fit bg-[#C9A24D] text-black px-5 py-2 rounded-full font-semibold hover:bg-[#B08B3E] transition", children: "Shop Now" })] })] }, index));
                    }) })] }) }));
}
