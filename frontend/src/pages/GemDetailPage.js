"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Diamond, MapPin, Hexagon, ShieldCheck, Maximize2, ChevronLeft, ArrowRight, Sparkles } from "lucide-react";
import { getGemById, getGems } from "../api/gemApi";
import { useCurrency } from "../hooks/useCurrency";
import ProductCard from "../components/product/ProductCard";
/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */
const SpecItem = ({ icon: Icon, label, value }) => (_jsxs("div", { className: "flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-[#C9A24D]/50 transition-all", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-[#C9A24D]/10 flex items-center justify-center text-[#C9A24D] group-hover:scale-110 transition-transform", children: _jsx(Icon, { size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white/40 text-xs uppercase tracking-widest font-bold", children: label }), _jsx("p", { className: "text-white font-medium", children: value || "N/A" })] })] }));
/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */
export default function GemDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currency = useCurrency();
    const formatPrice = currency?.format ?? ((p) => `LKR ${p.toLocaleString()}`);
    const [gem, setGem] = useState(null);
    const [relatedGems, setRelatedGems] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!id)
            return;
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getGemById(Number(id));
                setGem(data);
                setSelectedImage(data.images[0]?.image || "/placeholder.jpg");
                // Load related gems by type
                const allGems = await getGems({ gem_type: data.gem_type });
                setRelatedGems(allGems.filter(g => g.id !== data.id).slice(0, 4));
            }
            catch (err) {
                console.error("Failed to load gem details:", err);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);
    const handleInquiry = () => {
        if (!gem)
            return;
        const whatsappNumber = "94705696254";
        const message = `Hello Sparkler! I am interested in this exquisite gemstone:
- Name: ${gem.name}
- Type: ${gem.gem_type}
- Weight: ${gem.weight_carat}ct
- Price: ${formatPrice(gem.price)}
- Ref ID: #${gem.id}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
    };
    if (loading) {
        return (_jsxs("div", { className: "min-h-screen bg-black flex flex-col items-center justify-center", children: [_jsx("div", { className: "w-16 h-16 border-4 border-[#C9A24D]/20 border-t-[#C9A24D] rounded-full animate-spin mb-4" }), _jsx("p", { className: "text-[#C9A24D] font-bold tracking-widest uppercase text-sm animate-pulse", children: "Revealing Brilliance..." })] }));
    }
    if (!gem) {
        return (_jsxs("div", { className: "min-h-screen bg-black flex flex-col items-center justify-center text-center px-4", children: [_jsx("h2", { className: "text-4xl font-bold text-white mb-4", children: "Gemstone Not Found" }), _jsxs("button", { onClick: () => navigate("/gems"), className: "text-[#C9A24D] flex items-center gap-2 hover:underline", children: [_jsx(ChevronLeft, { size: 20 }), " Back to Collection"] })] }));
    }
    return (_jsxs(motion.section, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "min-h-screen bg-black text-white pb-24", children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 pt-8 mb-8", children: _jsxs("button", { onClick: () => navigate("/gems"), className: "group flex items-center gap-2 text-white/40 hover:text-[#C9A24D] transition-colors", children: [_jsx("div", { className: "p-2 rounded-full border border-white/10 group-hover:border-[#C9A24D]/50 transition-all", children: _jsx(ChevronLeft, { size: 18 }) }), _jsx("span", { className: "text-sm font-bold uppercase tracking-widest", children: "Back to Treasures" })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { layoutId: `gem-image-${gem.id}`, className: "relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.img, { initial: { opacity: 0, scale: 1.1 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { duration: 0.5 }, src: selectedImage, alt: gem.name, className: "w-full h-full object-cover" }, selectedImage) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }), _jsx("button", { className: "absolute bottom-6 right-6 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#C9A24D] hover:text-black transition-all", children: _jsx(Maximize2, { size: 24 }) })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: gem.images.map((img) => (_jsx("button", { onClick: () => setSelectedImage(img.image), className: `relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === img.image ? "border-[#C9A24D] scale-95" : "border-white/10 hover:border-white/30"}`, children: _jsx("img", { src: img.image, alt: "", className: "w-full h-full object-cover" }) }, img.id))) })] }), _jsxs("div", { className: "space-y-10 py-4", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs(motion.div, { initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 }, className: "flex items-center gap-2 text-[#C9A24D]", children: [_jsx(Sparkles, { size: 16 }), _jsx("span", { className: "text-xs font-bold uppercase tracking-[0.3em]", children: gem.gem_type })] }), _jsx("h1", { className: "text-5xl md:text-6xl font-black tracking-tighter leading-none", children: gem.name }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("p", { className: "text-4xl font-bold text-[#C9A24D]", children: formatPrice(gem.price) }), _jsx("div", { className: "px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider", children: gem.availability ? "In Stock" : "Reserved" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(SpecItem, { icon: Diamond, label: "Weight", value: `${gem.weight_carat} Carats` }), _jsx(SpecItem, { icon: Hexagon, label: "Shape", value: gem.shape }), _jsx(SpecItem, { icon: MapPin, label: "Origin", value: gem.origin }), _jsx(SpecItem, { icon: ShieldCheck, label: "Clarity", value: gem.clarity })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-bold uppercase tracking-widest text-[#C9A24D]", children: "Eternal Story" }), _jsxs("p", { className: "text-white/60 leading-relaxed text-lg italic font-light", children: ["\"", gem.description || "This exceptional specimen represents the pinnacle of natural brilliance, carefully selected for its unparalleled fire and character.", "\""] })] }), _jsxs("div", { className: "pt-6 border-t border-white/10 space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center text-sm py-2", children: [_jsx("span", { className: "text-white/40 font-bold uppercase tracking-wider", children: "Treatment" }), _jsx("span", { className: "text-white font-medium", children: gem.treatment || "Natural / Unheated" })] }), _jsxs("div", { className: "flex justify-between items-center text-sm py-2", children: [_jsx("span", { className: "text-white/40 font-bold uppercase tracking-wider", children: "Dimensions" }), _jsx("span", { className: "text-white font-medium", children: gem.dimensions || "Inquire for details" })] }), _jsxs("div", { className: "flex justify-between items-center text-sm py-2", children: [_jsx("span", { className: "text-white/40 font-bold uppercase tracking-wider", children: "Certification" }), _jsx("span", { className: "text-white font-medium", children: gem.certification || "GIC Certified" })] })] }), _jsxs("div", { className: "pt-8", children: [_jsx("button", { onClick: handleInquiry, className: "w-full py-6 rounded-full bg-[#C9A24D] text-black font-black uppercase tracking-[0.2em] group relative overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(201,162,77,0.4)] active:scale-[0.98]", children: _jsxs("span", { className: "relative z-10 flex items-center justify-center gap-3", children: ["Inquire via Expert", _jsx(ArrowRight, { className: "group-hover:translate-x-2 transition-transform" })] }) }), _jsx("p", { className: "text-center text-white/30 text-xs mt-4 font-medium uppercase tracking-widest", children: "Secured worldwide shipping available" })] })] })] }), relatedGems.length > 0 && (_jsxs("div", { className: "max-w-7xl mx-auto px-4 mt-32", children: [_jsxs("div", { className: "flex items-end justify-between mb-12", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[#C9A24D] text-xs font-bold uppercase tracking-[0.3em] mb-2", children: "Similar Finds" }), _jsxs("h2", { className: "text-4xl font-black tracking-tighter", children: ["Rare ", _jsx("span", { className: "text-[#C9A24D]", children: "Alternatives" })] })] }), _jsx("button", { onClick: () => navigate("/gems"), className: "px-6 py-2 rounded-full border border-white/20 hover:border-[#C9A24D] hover:text-[#C9A24D] transition-all text-sm font-bold uppercase tracking-widest", children: "View All" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8", children: relatedGems.map((g) => (_jsx(ProductCard, { product: {
                                id: g.id,
                                name: `${g.name} (${g.weight_carat}ct)`,
                                price: g.price,
                                images: g.images.length ? g.images.map(img => img.image) : ["/placeholder.jpg"]
                            }, onClick: (id) => navigate(`/gem/${id}`) }, g.id))) })] }))] }));
}
