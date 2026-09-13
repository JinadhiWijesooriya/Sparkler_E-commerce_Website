"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Gem,
  Sparkles,
  Package,
  ArrowRight,
  Loader2,
  X,
  Compass,
  type LucideIcon
} from "lucide-react";
import React from "react";

// API Imports
import { getProducts, type Product as APIProduct } from "../../api/shopApi";
import { getShopSets, type ShopSetProduct } from "../../api/shopSetsApi";
import { getGems, type Gem as APIGem } from "../../api/gemApi";

/* -------------------- TYPES -------------------- */
interface SearchResults {
  products: APIProduct[];
  sets: ShopSetProduct[];
  gems: APIGem[];
}

interface Category {
  name: string;
  icon: LucideIcon;
  target: "all" | "product" | "set" | "gem";
}

const CATEGORIES: Category[] = [
  { name: "All Collections", icon: Compass, target: "all" },
  { name: "Fine Jewelry", icon: Package, target: "product" },
  { name: "Jewelry Sets", icon: Gem, target: "set" },
  { name: "Gemstones", icon: Gem, target: "gem" },
];

/* -------------------- COMPONENT -------------------- */
export default function SearchBar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [catOpen, setCatOpen] = useState(false);
  const [results, setResults] = useState<SearchResults>({ products: [], sets: [], gems: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  /* -------------------- SEARCH LOGIC -------------------- */
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults({ products: [], sets: [], gems: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [productRes, setRes, gemRes] = await Promise.all([
        getProducts({ search: searchTerm }),
        getShopSets({ search: searchTerm }),
        getGems({ search: searchTerm })
      ]);

      setResults({
        products: productRes.slice(0, 3),
        sets: setRes.results.slice(0, 3),
        gems: gemRes.slice(0, 3)
      });
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------- DEBOUNCE -------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) performSearch(query);
      else {
        setResults({ products: [], sets: [], gems: [] });
        setShowResults(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  /* -------------------- NAVIGATION -------------------- */
  const handleResultClick = (type: 'product' | 'set' | 'gem', id: number) => {
    setShowResults(false);
    setQuery("");
    if (type === 'product') navigate(`/product/${id}`);
    if (type === 'set') navigate(`/productSet/${id}`);
    if (type === 'gem') navigate(`/gem/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = () => {
    if (!query.trim()) return;
    setShowResults(false);

    let url = `/shop?search=${encodeURIComponent(query)}`;
    if (category.target === 'set') url = `/sets?search=${encodeURIComponent(query)}`;
    if (category.target === 'gem') url = `/gems?search=${encodeURIComponent(query)}`;

    navigate(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearchSubmit();
    if (e.key === "Escape") setShowResults(false);
  };

  /* -------------------- CLICK OUTSIDE -------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setCatOpen(false);
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = results.products.length > 0 || results.sets.length > 0 || results.gems.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl z-[80]">
      <div className={`flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-300 border backdrop-blur-2xl shadow-2xl ${showResults ? 'bg-black/90 border-[#C9A24D]/50 shadow-[#C9A24D]/10' : 'bg-white/5 border-white/10 hover:border-white/20'
        }`}>
        {/* CATEGORY SELECTOR */}
        <div className="relative border-r border-white/10 pr-3 hidden sm:block">
          <button
            onClick={() => setCatOpen((p) => !p)}
            className="flex items-center gap-2 text-xs text-[#C9A24D] font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            <category.icon size={14} />
            <span className="truncate max-w-[80px]">{category.name.split(' ')[0]}</span>
            <ChevronDown size={12} className={`transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {catOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute left-0 mt-6 w-56 bg-black/95 border border-white/10 text-white rounded-[1.5rem] shadow-2xl overflow-hidden backdrop-blur-xl"
              >
                <div className="p-2 space-y-1">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setCategory(c);
                        setCatOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all rounded-xl ${category.name === c.name ? 'bg-[#C9A24D] text-black' : 'hover:bg-white/5 text-white/60'
                        }`}
                    >
                      <c.icon size={16} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SEARCH INPUT */}
        <div className="flex-1 flex items-center gap-3">
          {isLoading ? (
            <Loader2 size={18} className="text-[#C9A24D] animate-spin" />
          ) : (
            <Search size={18} className="text-[#C9A24D]" />
          )}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowResults(true)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${category.target === 'all' ? 'everything' : category.name.toLowerCase()}...`}
            className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none font-medium h-6"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-white/20 hover:text-white transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* RESULTS DROPDOWN */}
      <AnimatePresence>
        {showResults && (query.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-full left-0 right-0 mt-4 bg-black/95 border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl z-[90]"
          >
            <div className="max-h-[70vh] overflow-y-auto scrollbar-hide p-6 space-y-8">
              {!hasResults && !isLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Search size={24} className="text-white/20" />
                  </div>
                  <p className="text-white/40 text-sm font-bold uppercase tracking-widest">No treasures found matching "{query}"</p>
                </div>
              ) : (
                <>
                  {/* PRODUCTS SECTION */}
                  {results.products.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[#C9A24D] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <Package size={12} /> Fine Jewelry
                      </h4>
                      <div className="grid gap-2">
                        {results.products.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleResultClick('product', p.id)}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-left"
                          >
                            <img src={p.images?.[0]?.image || '/placeholder.jpg'} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-white group-hover:text-[#C9A24D] transition-colors">{p.name}</p>
                              <p className="text-[#C9A24D] text-xs font-medium">LKR {p.price.toLocaleString()}</p>
                            </div>
                            <ArrowRight size={14} className="text-white/0 group-hover:text-[#C9A24D] group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SETS SECTION */}
                  {results.sets.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[#8B5CF6] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <Gem size={12} /> Jewelry Sets
                      </h4>
                      <div className="grid gap-2">
                        {results.sets.map(s => (
                          <button
                            key={s.id}
                            onClick={() => handleResultClick('set', s.id)}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-left"
                          >
                            <img src={s.image_main} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{s.name}</p>
                              <p className="text-[#8B5CF6] text-xs font-medium">LKR {s.price.toLocaleString()}</p>
                            </div>
                            <ArrowRight size={14} className="text-white/0 group-hover:text-[#8B5CF6] group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* GEMS SECTION */}
                  {results.gems.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[#3B82F6] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <Sparkles size={12} /> Rare Gemstones
                      </h4>
                      <div className="grid gap-2">
                        {results.gems.map(g => (
                          <button
                            key={g.id}
                            onClick={() => handleResultClick('gem', g.id)}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-left"
                          >
                            <img src={g.images?.[0]?.image || '/placeholder.jpg'} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-white group-hover:text-[#3B82F6] transition-colors">{g.name}</p>
                              <p className="text-[#3B82F6] text-xs font-medium">LKR {g.price.toLocaleString()}</p>
                            </div>
                            <ArrowRight size={14} className="text-white/0 group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* FOOTER */}
            {hasResults && (
              <div className="p-4 bg-white/5 border-t border-white/10 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A24D] hover:text-white transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
