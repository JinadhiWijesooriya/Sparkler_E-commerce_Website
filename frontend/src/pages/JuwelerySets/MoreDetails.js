"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Diamond, Hexagon, ShieldCheck, Sparkles, ChevronLeft, Maximize2, Package, ShoppingCart, MessageCircle } from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency";
import ProductCard from "../../components/product/ProductCard";
import { getShopSetById, getShopSets } from "../../api/shopSetsApi";
import { useCart } from "../../context/useCart";
/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */
const SpecItem = ({ icon: Icon, label, value }) => (_jsxs("div", { className: "flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-[#C9A24D]/50 transition-all", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-[#C9A24D]/10 flex items-center justify-center text-[#C9A24D] group-hover:scale-110 transition-transform", children: _jsx(Icon, { size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white/40 text-xs uppercase tracking-widest font-bold", children: label }), _jsx("p", { className: "text-white font-medium", children: value || "N/A" })] })] }));
/* ---------------- MAP API PRODUCT TO FRONTEND TYPE ---------------- */
const mapAPIProductToCard = (p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description ?? "Handcrafted luxury jewelry set.",
    images: [p.image_main, p.image_secondary || p.image_main],
    product_type: "set",
});
export default function MoreDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currency = useCurrency();
    const formatPrice = currency?.format ?? ((p) => `LKR ${p.toLocaleString()}`);
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [selectedImage, setSelectedImage] = useState("/placeholder.jpg");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    /* ---------------- LOAD PRODUCT & RELATED ---------------- */
    useEffect(() => {
        if (!id)
            return;
        const loadData = async () => {
            try {
                setLoading(true);
                const productData = await getShopSetById(Number(id));
                setProduct(productData);
                setSelectedImage(productData.image_main);
                const allProducts = await getShopSets();
                setRelated(allProducts.results
                    .filter((p) => p.id !== productData.id)
                    .slice(0, 4)
                    .map(mapAPIProductToCard));
            }
            catch (err) {
                console.error("Failed to load product", err);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);
    const handleAddToCart = () => {
        if (!product)
            return;
        addToCart(product.id, "set", quantity);
    };
    const handleInquiry = () => {
        if (!product)
            return;
        const whatsappNumber = "94705696254";
        const message = `Hello Sparkler! I am interested in this magnificent jewelry set:
- Name: ${product.name}
- Gem: ${product.gem}
- Metal: ${product.metal}
- Price: ${formatPrice(product.price)}
- Ref ID: #${product.id}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
    };
    if (loading) {
        return (_jsxs("div", { className: "min-h-screen bg-black flex flex-col items-center justify-center", children: [_jsx("div", { className: "w-16 h-16 border-4 border-[#C9A24D]/20 border-t-[#C9A24D] rounded-full animate-spin mb-4" }), _jsx("p", { className: "text-[#C9A24D] font-bold tracking-widest uppercase text-sm animate-pulse", children: "Unveiling Elegance..." })] }));
    }
    if (!product) {
        return (_jsxs("div", { className: "min-h-screen bg-black flex flex-col items-center justify-center text-center px-4", children: [_jsx("h2", { className: "text-4xl font-bold text-white mb-4", children: "Masterpiece Not Found" }), _jsxs("button", { onClick: () => navigate("/sets"), className: "text-[#C9A24D] flex items-center gap-2 hover:underline", children: [_jsx(ChevronLeft, { size: 20 }), " Back to Collection"] })] }));
    }
    const images = [product.image_main, product.image_secondary].filter(Boolean);
    /* ---------------- HELPER: SPLIT TO CHAPTERS ---------------- */
    const descriptionChapters = (product?.description || "A harmonious blend of precious metals and ethereal gemstones, designed to tell a story of timeless grace and sophistication.")
        .split("\n")
        .filter(line => line.trim().length > 0);
    const chapterIcons = [Sparkles, Diamond, ShieldCheck, Hexagon];
    return (_jsxs(motion.section, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "min-h-screen bg-black text-white pb-24", children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 pt-8 mb-8", children: _jsxs("button", { onClick: () => navigate("/sets"), className: "group flex items-center gap-2 text-white/40 hover:text-[#C9A24D] transition-colors", children: [_jsx("div", { className: "p-2 rounded-full border border-white/10 group-hover:border-[#C9A24D]/50 transition-all", children: _jsx(ChevronLeft, { size: 18 }) }), _jsx("span", { className: "text-sm font-bold uppercase tracking-widest", children: "Back to Collection" })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { layoutId: `set-image-${product.id}`, className: "relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.img, { initial: { opacity: 0, scale: 1.1 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { duration: 0.5 }, src: selectedImage, alt: product.name, className: "w-full h-full object-cover" }, selectedImage) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }), _jsx("button", { className: "absolute bottom-6 right-6 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#C9A24D] hover:text-black transition-all", children: _jsx(Maximize2, { size: 24 }) })] }), _jsx("div", { className: "flex gap-4 overflow-x-auto scrollbar-hide pb-2", children: images.map((img, idx) => (_jsx("button", { onClick: () => setSelectedImage(img), className: `relative w-24 h-24 aspect-square rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === img ? "border-[#C9A24D] scale-95" : "border-white/10 hover:border-white/30"}`, children: _jsx("img", { src: img, alt: "", className: "w-full h-full object-cover" }) }, idx))) })] }), _jsxs("div", { className: "space-y-10 py-4", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs(motion.div, { initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 }, className: "flex items-center gap-2 text-[#C9A24D]", children: [_jsx(Sparkles, { size: 16 }), _jsx("span", { className: "text-xs font-bold uppercase tracking-[0.3em]", children: "Jewelry Set" })] }), _jsx("h1", { className: "text-5xl md:text-6xl font-black tracking-tighter leading-none", children: product.name }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("p", { className: "text-4xl font-bold text-[#C9A24D]", children: formatPrice(product.price) }), _jsx("div", { className: "px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider", children: product.availability === "in_stock" ? "Available" : "Bespoke Only" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(SpecItem, { icon: Diamond, label: "Main Gem", value: product.gem }), _jsx(SpecItem, { icon: Package, label: "Metal", value: product.metal }), _jsx(SpecItem, { icon: Hexagon, label: "Carat Total", value: `${product.carat}ct` }), _jsx(SpecItem, { icon: ShieldCheck, label: "Origin", value: "Authentic Craft" })] }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A24D]/30" }), _jsx("h3", { className: "text-lg font-bold uppercase tracking-[0.3em] text-[#C9A24D]", children: "The Artisan's Vision" }), _jsx("div", { className: "h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A24D]/30" })] }), _jsxs("div", { className: "space-y-10 relative", children: [_jsx("div", { className: "absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C9A24D]/50 via-white/10 to-transparent" }), descriptionChapters.map((chapter, idx) => {
                                                const Icon = chapterIcons[idx % chapterIcons.length];
                                                return (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { delay: idx * 0.1 }, className: "relative pl-12 group", children: [_jsx("div", { className: "absolute left-0 top-0 w-10 h-10 rounded-full bg-black border border-[#C9A24D]/30 flex items-center justify-center text-[#C9A24D] group-hover:border-[#C9A24D] group-hover:bg-[#C9A24D]/5 shadow-lg shadow-[#C9A24D]/10 transition-all z-10", children: _jsx(Icon, { size: 16 }) }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-[#C9A24D] text-[10px] font-bold uppercase tracking-[0.2em] opacity-60", children: ["Chapter ", idx + 1] }), _jsxs("p", { className: "text-white/70 leading-relaxed text-lg italic font-light group-hover:text-white transition-colors", children: ["\"", chapter.trim(), "\""] })] })] }, idx));
                                            })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("span", { className: "text-white/40 font-bold uppercase tracking-widest text-xs", children: "Quantity" }), _jsxs("div", { className: "flex items-center bg-white/5 border border-white/10 rounded-full p-1", children: [_jsx("button", { onClick: () => setQuantity(q => Math.max(1, q - 1)), className: "w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors", children: "-" }), _jsx("span", { className: "w-12 text-center font-bold", children: quantity }), _jsx("button", { onClick: () => setQuantity(q => q + 1), className: "w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors", children: "+" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("button", { onClick: handleAddToCart, className: "flex-1 py-5 rounded-full bg-white text-black font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-[#C9A24D] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98]", children: [_jsx(ShoppingCart, { size: 20 }), "Add to Cart"] }), _jsxs("button", { onClick: handleInquiry, className: "flex-1 py-5 rounded-full border border-white/20 text-white font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-[0.98]", children: [_jsx(MessageCircle, { size: 20 }), "Expert Quote"] })] })] }), _jsx("p", { className: "text-center text-white/30 text-xs font-medium uppercase tracking-widest", children: "Exquisite presentation box & certificate included" })] })] }), related.length > 0 && (_jsxs("div", { className: "max-w-7xl mx-auto px-4 mt-32", children: [_jsxs("div", { className: "flex items-end justify-between mb-12", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[#C9A24D] text-xs font-bold uppercase tracking-[0.3em] mb-2", children: "Heritage Collection" }), _jsxs("h2", { className: "text-4xl font-black tracking-tighter", children: ["Related ", _jsx("span", { className: "text-[#C9A24D]", children: "Masterpieces" })] })] }), _jsx("button", { onClick: () => navigate("/sets"), className: "px-6 py-2 rounded-full border border-white/20 hover:border-[#C9A24D] hover:text-[#C9A24D] transition-all text-sm font-bold uppercase tracking-widest", children: "Explore All" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8", children: related.map((p) => (_jsx(ProductCard, { product: p, onClick: (id) => {
                                navigate(`/productSet/${id}`);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            } }, p.id))) })] }))] }));
}
