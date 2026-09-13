"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Wrench, Diamond, Watch, Zap, Edit, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";
import { getServices, getHeroSections, } from "../api/servicesApi";
const ICON_MAP = {
    wrench: Wrench,
    diamond: Diamond,
    watch: Watch,
    zap: Zap,
    edit: Edit,
};
export default function Services() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedCards, setExpandedCards] = useState([]); // Track expanded cards
    useEffect(() => {
        const fetchData = async () => {
            try {
                const heroData = await getHeroSections();
                if (heroData.length > 0) {
                    const h = heroData[0];
                    setHero({
                        id: h.id,
                        badgeText: h.badge_text,
                        title: h.title,
                        subtitle: h.subtitle,
                        backgroundImage: h.background_image,
                    });
                }
                const serviceData = await getServices();
                const mappedServices = serviceData.map((s) => ({
                    id: s.id,
                    title: s.title,
                    icon: ICON_MAP[s.icon] || Wrench,
                    description: s.description,
                    estimatedCost: s.estimated_cost,
                    videoUrl: s.video_url ?? null,
                    beforeAfterImages: s.images.map((img) => img.image),
                }));
                setServices(mappedServices);
            }
            catch (error) {
                console.error("Failed to load services:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const toggleCard = (id) => {
        setExpandedCards((prev) => prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]);
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center h-96 text-[#C9A24D] font-bold", children: "Loading..." }));
    }
    const handleWhatsAppRequest = (service) => {
        const whatsappNumber = "94705696254"; // your number
        const message = `Hello! I would like to request your service:
- Service: ${service.title}
- Estimated Cost: ${service.estimatedCost}`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank"); // Opens WhatsApp in a new tab
    };
    return (_jsxs("section", { className: "relative text-[#EDEDED] overflow-hidden", children: [hero && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 }, className: "relative w-full bg-cover bg-center", style: { backgroundImage: `url(${hero.backgroundImage})` }, children: [_jsx("div", { className: "absolute inset-0 bg-black/60" }), _jsx("div", { className: "absolute -top-32 -left-32 w-64 sm:w-96 h-64 sm:h-96 bg-[#bf1363]/30 blur-[120px] animate-pulse-slow" }), _jsx("div", { className: "absolute -bottom-32 -right-32 w-64 sm:w-96 h-64 sm:h-96 bg-[#C9A24D]/20 blur-[120px] animate-pulse-slow" }), _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-24 sm:py-32 text-center", children: [_jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "text-[#C9A24D] tracking-widest uppercase mb-4 sm:mb-6 text-xs sm:text-sm md:text-base", children: hero.badgeText }), _jsx(motion.h1, { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3, duration: 1 }, className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6 sm:mb-8", children: hero.title }), _jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "max-w-3xl mx-auto text-[#C9A24D] text-sm sm:text-base md:text-lg mb-10 sm:mb-14", children: hero.subtitle }), _jsx(motion.div, { whileHover: { scale: 1.05 }, className: "inline-block cursor-pointer", onClick: () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }), children: _jsx(Button, { className: "px-10 sm:px-14 py-3 sm:py-5 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] text-base sm:text-lg font-semibold rounded-full shadow-lg", children: "Explore Our Services" }) })] })] })), _jsxs("div", { id: "services", className: "relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-20 sm:py-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 rounded-3xl overflow-visible bg-[#1A1A1A]", children: [_jsx("div", { className: "absolute -top-32 -left-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#bf1363]/40 blur-[150px] animate-pulse-slow" }), _jsx("div", { className: "absolute -bottom-32 -right-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#bf1363]/30 blur-[120px] animate-pulse-slow" }), _jsx("div", { className: "absolute top-1/2 left-1/3 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-[#bf1363]/20 blur-[100px] animate-pulse-slow" }), services.map((service, index) => {
                        const isExpanded = expandedCards.includes(service.id);
                        const shortDescription = service.description.length > 120
                            ? service.description.slice(0, 120) + "..."
                            : service.description;
                        return (_jsxs(motion.div, { onClick: () => setSelectedService(service), initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1, duration: 0.5 }, whileHover: {
                                scale: 1.05,
                                y: -3,
                                boxShadow: "0 20px 50px rgba(191,19,99,0.2)",
                            }, className: "relative cursor-pointer group", children: [_jsx(motion.div, { className: "absolute inset-0 rounded-3xl pointer-events-none", initial: { opacity: 0 }, whileHover: { opacity: 1 }, transition: { duration: 0.5 }, style: {
                                        background: "radial-gradient(circle, rgba(191,19,99,0.2) 0%, transparent 70%)",
                                        mixBlendMode: "screen",
                                    } }), _jsxs("div", { className: "rounded-3xl bg-[#1F1F1F]/90 border border-[#C9A24D]/20 p-6 sm:p-8 shadow-2xl flex flex-col justify-start gap-4 min-h-[280px]", children: [_jsx(service.icon, { className: "w-12 sm:w-16 h-12 sm:h-16 text-[#C9A24D]" }), _jsx("h3", { className: "text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-[#C9A24D]", children: service.title }), _jsxs("p", { className: "text-[#C9A24D] text-sm sm:text-base flex-1", children: [isExpanded ? service.description : shortDescription, " ", service.description.length > 120 && (_jsx("button", { onClick: (e) => {
                                                        e.stopPropagation();
                                                        toggleCard(service.id);
                                                    }, className: "text-[#C9A24D]/70 hover:text-[#C9A24D] font-semibold ml-1 text-sm", children: isExpanded ? "Read less" : "Read more" }))] }), _jsx("span", { className: "text-[#C9A24D] font-semibold mt-2 sm:mt-3", children: service.estimatedCost })] })] }, service.id));
                    })] }), _jsx(AnimatePresence, { children: selectedService && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 backdrop-blur-sm bg-black/60", onClick: () => setSelectedService(null), children: _jsxs(motion.div, { onClick: (e) => e.stopPropagation(), initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.3 }, className: "relative w-full max-w-4xl sm:max-w-5xl bg-[#1A1A1A] rounded-3xl border border-[#C9A24D]/30 shadow-2xl overflow-x-hidden", children: [_jsx("button", { onClick: () => setSelectedService(null), "aria-label": "Close modal", className: "absolute top-4 sm:top-6 right-4 sm:right-6 text-[#C9A24D] hover:text-[#B08B3E] z-10", children: _jsx(X, { className: "w-8 sm:w-9 h-8 sm:h-9" }) }), _jsxs(motion.div, { className: "p-6 sm:p-14 space-y-8 sm:space-y-10 max-h-[85vh] overflow-y-auto", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between gap-2 sm:gap-4", children: [_jsx("h2", { className: "text-3xl sm:text-4xl font-extrabold text-[#C9A24D]", children: selectedService.title }), _jsxs("span", { className: "text-lg sm:text-xl font-semibold text-[#C9A24D]", children: ["LKR.", selectedService.estimatedCost] })] }), _jsx("p", { className: "text-[#C9A24D] leading-relaxed text-sm sm:text-base", children: selectedService.description }), selectedService.videoUrl && (_jsxs("div", { className: "text-center space-y-4", children: [_jsx("h3", { className: "text-lg sm:text-xl font-semibold tracking-wide text-[#C9A24D]", children: "Watch Our Work" }), _jsx("video", { src: selectedService.videoUrl, autoPlay: true, loop: true, muted: true, controls: true, className: "mx-auto w-full max-w-md sm:max-w-lg rounded-2xl border border-[#C9A24D]/20 shadow-lg" }, selectedService.videoUrl)] })), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6", children: selectedService.beforeAfterImages.map((img, i) => (_jsx("img", { src: img, className: "w-full h-48 sm:h-56 rounded-2xl object-cover border border-[#C9A24D]/20", alt: `${selectedService.title} comparison ${i + 1}` }, i))) }), _jsx("div", { className: "text-center pt-4 sm:pt-6", children: _jsx(Button, { className: "px-12 sm:px-16 py-3 sm:py-4 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-full shadow-lg", onClick: () => handleWhatsAppRequest(selectedService), children: "Request Consultation" }) })] })] }) })) }), _jsx("style", { children: `
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1) }
          50% { transform: scale(1.05) }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      ` })] }));
}
