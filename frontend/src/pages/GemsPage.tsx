"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

import ProductCard from "../components/product/ProductCard";
import ProductFilters from "../components/product/ProductFilters";
import {
    getGems,
    getGemHero,
    type Gem,
    type GemHero,
    type GemQueryParams,
} from "../api/gemApi";

/* ---------------- HELPER ---------------- */
const truncateText = (text: string, wordLimit: number) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
};

interface UiGem {
    id: number;
    name: string;
    price: number;
    images: string[];
    description?: string;
}

/* ---------------- GEMS PAGE ---------------- */
export default function GemsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";

    const gemsRef = useRef<HTMLDivElement | null>(null);

    const [gems, setGems] = useState<UiGem[]>([]);
    const [hero, setHero] = useState<GemHero | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* ---------------- SCROLL TO GEMS ---------------- */
    const scrollToGems = () => {
        gemsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    /* ---------------- FETCH HERO ---------------- */
    useEffect(() => {
        const loadHero = async () => {
            try {
                const heroData = await getGemHero();
                setHero(heroData);
            } catch (err) {
                console.error("Error loading gem hero:", err);
                setHero(null);
            }
        };
        loadHero();
    }, []);

    /* ---------------- FETCH GEMS ---------------- */
    const fetchGems = useCallback(
        async (filters?: GemQueryParams) => {
            try {
                setLoading(true);
                setError(null);

                const finalFilters: GemQueryParams = {
                    ...(search ? { search } : {}),
                    ...filters,
                };

                const data: Gem[] = await getGems(finalFilters);

                const mapped: UiGem[] = data.map((g) => ({
                    id: g.id,
                    name: `${g.name} (${g.weight_carat}ct)`,
                    price: g.price,
                    description: g.description ? truncateText(g.description, 20) : `${g.gem_type} - ${g.shape}`,
                    images: g.images.length ? g.images.map((img) => img.image) : ["/placeholder.jpg"],
                }));

                setGems(mapped);
            } catch (err) {
                console.error(err);
                setError("Failed to load gems.");
                setGems([]);
            } finally {
                setLoading(false);
            }
        },
        [search]
    );

    /* ---------------- INITIAL FETCH ---------------- */
    useEffect(() => {
        fetchGems();
    }, [fetchGems]);

    /* ---------------- APPLY FILTERS ---------------- */
    const handleApplyFilters = (filters: GemQueryParams) => {
        scrollToGems();
        fetchGems({
            ...filters,
            ...(search ? { search } : {}),
        });
    };

    /* ---------------- RENDER ---------------- */
    return (
        <section className="bg-black min-h-screen text-[#EDEDED] overflow-hidden">
            {/* ================= HERO ================= */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative h-[70vh] flex items-center justify-center text-center px-4 sm:px-6 md:px-12 overflow-hidden"
            >
                {hero?.background_image && (
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 3 }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${hero.background_image})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
                <div className="relative z-10 max-w-4xl px-2 sm:px-4">
                    <motion.span
                        initial={{ opacity: 0, letterSpacing: "0.1em" }}
                        animate={{ opacity: 1, letterSpacing: "0.4em" }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-[#C9A24D] text-xs sm:text-sm font-bold uppercase mb-4 block"
                    >
                        Premium Collection
                    </motion.span>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4 sm:mb-8 tracking-tighter">
                        {hero?.title ?? (
                            <>
                                Rare & <span className="text-[#C9A24D]">Eternal Gems</span>
                            </>
                        )}
                    </h1>
                    <p className="text-white/60 text-lg sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                        {hero?.subtitle ?? "Directly sourced from the heart of Ceylon. GSA & EGL certified treasures."}
                    </p>
                    <button
                        onClick={scrollToGems}
                        className="px-10 py-4 bg-[#C9A24D] text-black font-black uppercase tracking-widest text-sm rounded-full hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(201,162,77,0.3)]"
                    >
                        Explore Treasures
                    </button>
                </div>
            </motion.div>

            {/* ================= GEMS GRID ================= */}
            <div
                ref={gemsRef}
                className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-4 gap-12"
            >
                {/* Filters */}
                <aside className="md:col-span-1 mb-8 md:mb-0 sticky top-24 h-fit">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Refine Search</h3>
                        <ProductFilters target="gem" onApply={handleApplyFilters} />
                    </div>
                </aside>

                {/* Gem Grid */}
                <div className="md:col-span-3">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-[#C9A24D]/20 border-t-[#C9A24D] rounded-full animate-spin mb-4" />
                            <p className="text-[#C9A24D] font-bold animate-pulse">Curating Collection...</p>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
                            <p className="text-red-400 font-bold">{error}</p>
                        </div>
                    )}
                    {!loading && !error && gems.length === 0 && (
                        <div className="bg-white/5 border border-white/10 p-20 rounded-[3rem] text-center">
                            <p className="text-white/40 text-xl font-medium italic">No gems currently match your criteria.</p>
                        </div>
                    )}
                    {!loading && !error && gems.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {gems.map((gem, index) => (
                                    <motion.div
                                        key={gem.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        <ProductCard
                                            product={{ ...gem, product_type: "gem" }}
                                            onClick={(id) => navigate(`/gem/${id}`)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
