"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { getJewelryTypes, getGems, getMetals, getHeroSections, } from "../api/customApi";
import { getHomepageData } from "../api/homeApi";
export default function CustomJewelry() {
    const configuratorRef = useRef(null);
    // ---------------- STATE ----------------
    const [jewelryTypes, setJewelryTypes] = useState([]);
    const [gems, setGems] = useState([]);
    const [metals, setMetals] = useState([]);
    const [hero, setHero] = useState(null);
    const [advertisement, setAdvertisement] = useState(null);
    const [selectedJewelry, setSelectedJewelry] = useState(null);
    const [selectedGem, setSelectedGem] = useState(null);
    const [selectedMetal, setSelectedMetal] = useState(null);
    const [sparkles] = useState(() => Array.from({ length: 25 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.2,
        duration: `${Math.random() * 3 + 2}s`,
    })));
    // ---------------- FETCH DATA ----------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jewelryRes, gemsRes, metalsRes, heroRes, homepageData] = await Promise.all([
                    getJewelryTypes(),
                    getGems(),
                    getMetals(),
                    getHeroSections(),
                    getHomepageData(),
                ]);
                setJewelryTypes(jewelryRes);
                setGems(gemsRes);
                setMetals(metalsRes);
                if (heroRes.length > 0)
                    setHero(heroRes[0]);
                if (homepageData.ads && homepageData.ads.length > 0) {
                    const activeAds = homepageData.ads.filter(ad => ad.is_active);
                    if (activeAds.length > 0)
                        setAdvertisement(activeAds[0]);
                }
            }
            catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    // ---------------- COMPUTED ----------------
    const previewImage = useMemo(() => {
        // Just show the advertisement image if no selection
        if (advertisement?.image)
            return advertisement.image;
        return "/previews/default.jpg";
    }, [advertisement]);
    const scrollToConfigurator = () => {
        configuratorRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    // ---------------- WHATSAPP ----------------
    const handleSubmitRequest = () => {
        const whatsappNumber = "94705696254"; // your WhatsApp number
        const lines = ["Hello! I would like to request a custom jewelry design."];
        if (selectedJewelry) {
            const jewelry = jewelryTypes.find(j => j.id === selectedJewelry)?.name;
            lines.push(`Jewelry Type: ${jewelry}`);
        }
        if (selectedGem) {
            const gem = gems.find(g => g.id === selectedGem)?.name;
            lines.push(`Gemstone: ${gem}`);
        }
        if (selectedMetal) {
            const metal = metals.find(m => m.id === selectedMetal)?.name;
            lines.push(`Metal: ${metal}`);
        }
        if (lines.length === 1)
            lines.push("No options selected yet.");
        lines.push("\nPlease assist me with this custom request.");
        const message = lines.join("\n");
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };
    // ---------------- RENDER ----------------
    return (_jsxs("section", { className: "relative bg-[#1A1A1A] text-[#EDEDED] overflow-hidden", children: [_jsxs("div", { className: `relative h-[70vh] sm:h-[80vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-0
                   bg-cover bg-center bg-blend-overlay`, style: { backgroundImage: `url(${hero?.image || "/previews/default.jpg"})` }, children: [_jsx("div", { className: "absolute inset-0 bg-black/50 z-10" }), _jsxs(motion.div, { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1 }, className: "relative z-20 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#C9A24D] drop-shadow-xl mb-4 sm:mb-6", children: hero?.title || "Craft Your Luxury Jewelry" }), _jsx("p", { className: "text-[#BDBDBD] text-sm sm:text-base md:text-lg mb-6 sm:mb-10", children: hero?.subtitle || "Design your perfect piece by choosing the type, gemstone, and metal." }), _jsx("div", { onClick: scrollToConfigurator, className: "inline-block px-10 sm:px-16 py-3 sm:py-4 text-lg sm:text-xl rounded-full cursor-pointer bg-[#C9A24D] hover:bg-[#B08B3E] transition-transform hover:scale-105", children: "Start Designing" })] })] }), _jsxs(motion.div, { ref: configuratorRef, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.8 }, className: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 bg-[#1A1A1A]/90 p-6 sm:p-12 md:p-16 rounded-3xl border border-[#C9A24D]/30 relative -mt-24 sm:-mt-32 z-20 backdrop-blur-md", children: [_jsxs("div", { className: "relative rounded-3xl overflow-hidden border border-[#C9A24D]/30 h-[300px] sm:h-[400px] md:h-[500px]", children: [_jsx("img", { src: previewImage, alt: "Jewelry Preview", className: "w-full h-full object-cover rounded-3xl" }), sparkles.map((s, i) => (_jsx(motion.div, { className: "absolute w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#C9A24D] rounded-full", initial: { opacity: 0 }, animate: { opacity: [0, s.opacity, 0] }, transition: {
                                    repeat: Infinity,
                                    duration: parseFloat(s.duration),
                                    repeatType: "loop",
                                    ease: "easeInOut",
                                }, style: { top: s.top, left: s.left } }, i)))] }), _jsxs("div", { className: "flex flex-col gap-6 sm:gap-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[#C9A24D] font-bold text-lg sm:text-xl mb-2 sm:mb-3", children: "Jewelry Type" }), _jsx("div", { className: "flex gap-2 sm:gap-4 flex-wrap", children: jewelryTypes.map((type) => (_jsx(motion.div, { onClick: () => setSelectedJewelry(type.id), whileHover: { scale: 1.05 }, className: `cursor-pointer px-3 sm:px-4 py-2 sm:py-4 rounded-2xl border-2 transition text-center
                    ${selectedJewelry === type.id ? "border-[#C9A24D]" : "border-transparent hover:border-[#B08B3E]"}`, children: _jsx("p", { className: "text-sm sm:text-base text-[#EDEDED]", children: type.name }) }, type.id))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[#C9A24D] font-bold text-lg sm:text-xl mb-2 sm:mb-3", children: "Gemstone" }), _jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto py-1", children: gems.map((gem) => (_jsx(motion.div, { onClick: () => setSelectedGem(gem.id), whileHover: { scale: 1.1 }, className: `flex-shrink-0 w-20 sm:w-24 h-20 sm:h-24 rounded-xl cursor-pointer border-2 bg-cover bg-center transition
                    ${selectedGem === gem.id ? "border-[#C9A24D]" : "border-transparent hover:border-[#B08B3E]"}`, style: { backgroundImage: `url(${gem.image || "/previews/default.jpg"})` } }, gem.id))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[#C9A24D] font-bold text-lg sm:text-xl mb-2 sm:mb-3", children: "Metal" }), _jsx("div", { className: "flex gap-2 sm:gap-4 flex-wrap", children: metals.map((metal) => (_jsx(motion.div, { onClick: () => setSelectedMetal(metal.id), whileHover: { scale: 1.05 }, className: `cursor-pointer px-3 sm:px-4 py-2 sm:py-4 rounded-2xl border-2 transition text-center
                    ${selectedMetal === metal.id ? "border-[#C9A24D]" : "border-transparent hover:border-[#B08B3E]"}`, children: _jsx("p", { className: "text-sm sm:text-base text-[#EDEDED]", children: metal.name }) }, metal.id))) })] }), _jsx("div", { onClick: handleSubmitRequest, className: "px-10 sm:px-14 py-3 sm:py-4 text-lg sm:text-xl rounded-full cursor-pointer text-[#1A1A1A] bg-[#C9A24D] hover:bg-[#B08B3E] font-semibold text-center transition-transform hover:scale-105", children: "Submit Custom Request" })] })] })] }));
}
