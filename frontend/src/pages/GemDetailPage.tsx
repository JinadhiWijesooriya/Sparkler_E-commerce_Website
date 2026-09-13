"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Diamond,
    MapPin,
    Hexagon,
    ShieldCheck,
    Maximize2,
    ChevronLeft,
    ArrowRight,
    Sparkles,
    type LucideIcon
} from "lucide-react";

import { getGemById, getGems, type Gem } from "../api/gemApi";
import { useCurrency } from "../hooks/useCurrency";
import ProductCard from "../components/product/ProductCard";

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

const SpecItem = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string | number | null }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-[#C9A24D]/50 transition-all">
        <div className="w-10 h-10 rounded-xl bg-[#C9A24D]/10 flex items-center justify-center text-[#C9A24D] group-hover:scale-110 transition-transform">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">{label}</p>
            <p className="text-white font-medium">{value || "N/A"}</p>
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function GemDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const currency = useCurrency();
    const formatPrice = currency?.format ?? ((p: number) => `LKR ${p.toLocaleString()}`);

    const [gem, setGem] = useState<Gem | null>(null);
    const [relatedGems, setRelatedGems] = useState<Gem[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getGemById(Number(id));
                setGem(data);
                setSelectedImage(data.images[0]?.image || "/placeholder.jpg");

                // Load related gems by type
                const allGems = await getGems({ gem_type: data.gem_type });
                setRelatedGems(allGems.filter(g => g.id !== data.id).slice(0, 4));
            } catch (err) {
                console.error("Failed to load gem details:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    const handleInquiry = () => {
        if (!gem) return;
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
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#C9A24D]/20 border-t-[#C9A24D] rounded-full animate-spin mb-4" />
                <p className="text-[#C9A24D] font-bold tracking-widest uppercase text-sm animate-pulse">Revealing Brilliance...</p>
            </div>
        );
    }

    if (!gem) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl font-bold text-white mb-4">Gemstone Not Found</h2>
                <button
                    onClick={() => navigate("/gems")}
                    className="text-[#C9A24D] flex items-center gap-2 hover:underline"
                >
                    <ChevronLeft size={20} /> Back to Collection
                </button>
            </div>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-black text-white pb-24"
        >
            {/* ---------------- NAVIGATION ---------------- */}
            <div className="max-w-7xl mx-auto px-4 pt-8 mb-8">
                <button
                    onClick={() => navigate("/gems")}
                    className="group flex items-center gap-2 text-white/40 hover:text-[#C9A24D] transition-colors"
                >
                    <div className="p-2 rounded-full border border-white/10 group-hover:border-[#C9A24D]/50 transition-all">
                        <ChevronLeft size={18} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Treasures</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* ---------------- LEFT: GALLERY ---------------- */}
                <div className="space-y-6">
                    <motion.div
                        layoutId={`gem-image-${gem.id}`}
                        className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group"
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                src={selectedImage}
                                alt={gem.name}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <button className="absolute bottom-6 right-6 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#C9A24D] hover:text-black transition-all">
                            <Maximize2 size={24} />
                        </button>
                    </motion.div>

                    <div className="grid grid-cols-4 gap-4">
                        {gem.images.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => setSelectedImage(img.image)}
                                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === img.image ? "border-[#C9A24D] scale-95" : "border-white/10 hover:border-white/30"
                                    }`}
                            >
                                <img src={img.image} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ---------------- RIGHT: INFO ---------------- */}
                <div className="space-y-10 py-4">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-2 text-[#C9A24D]"
                        >
                            <Sparkles size={16} />
                            <span className="text-xs font-bold uppercase tracking-[0.3em]">{gem.gem_type}</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                            {gem.name}
                        </h1>
                        <div className="flex items-center gap-6">
                            <p className="text-4xl font-bold text-[#C9A24D]">
                                {formatPrice(gem.price)}
                            </p>
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                {gem.availability ? "In Stock" : "Reserved"}
                            </div>
                        </div>
                    </div>

                    {/* Core Specs Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <SpecItem icon={Diamond} label="Weight" value={`${gem.weight_carat} Carats`} />
                        <SpecItem icon={Hexagon} label="Shape" value={gem.shape} />
                        <SpecItem icon={MapPin} label="Origin" value={gem.origin} />
                        <SpecItem icon={ShieldCheck} label="Clarity" value={gem.clarity} />
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold uppercase tracking-widest text-[#C9A24D]">Eternal Story</h3>
                        <p className="text-white/60 leading-relaxed text-lg italic font-light">
                            "{gem.description || "This exceptional specimen represents the pinnacle of natural brilliance, carefully selected for its unparalleled fire and character."}"
                        </p>
                    </div>

                    {/* Additional Details Accordion-style */}
                    <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex justify-between items-center text-sm py-2">
                            <span className="text-white/40 font-bold uppercase tracking-wider">Treatment</span>
                            <span className="text-white font-medium">{gem.treatment || "Natural / Unheated"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-2">
                            <span className="text-white/40 font-bold uppercase tracking-wider">Dimensions</span>
                            <span className="text-white font-medium">{gem.dimensions || "Inquire for details"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-2">
                            <span className="text-white/40 font-bold uppercase tracking-wider">Certification</span>
                            <span className="text-white font-medium">{gem.certification || "GIC Certified"}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-8">
                        <button
                            onClick={handleInquiry}
                            className="w-full py-6 rounded-full bg-[#C9A24D] text-black font-black uppercase tracking-[0.2em] group relative overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(201,162,77,0.4)] active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                Inquire via Expert
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </span>
                        </button>
                        <p className="text-center text-white/30 text-xs mt-4 font-medium uppercase tracking-widest">
                            Secured worldwide shipping available
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------------- RELATED SECTION ---------------- */}
            {relatedGems.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 mt-32">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="text-[#C9A24D] text-xs font-bold uppercase tracking-[0.3em] mb-2">Similar Finds</p>
                            <h2 className="text-4xl font-black tracking-tighter">Rare <span className="text-[#C9A24D]">Alternatives</span></h2>
                        </div>
                        <button
                            onClick={() => navigate("/gems")}
                            className="px-6 py-2 rounded-full border border-white/20 hover:border-[#C9A24D] hover:text-[#C9A24D] transition-all text-sm font-bold uppercase tracking-widest"
                        >
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedGems.map((g) => (
                            <ProductCard
                                key={g.id}
                                product={{
                                    id: g.id,
                                    name: `${g.name} (${g.weight_carat}ct)`,
                                    price: g.price,
                                    images: g.images.length ? g.images.map(img => img.image) : ["/placeholder.jpg"]
                                }}
                                onClick={(id) => navigate(`/gem/${id}`)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </motion.section>
    );
}
