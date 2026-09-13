"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, easeOut, useAnimation } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

import ProductCard from "../../components/product/ProductCard";
import ProductFilters from "../../components/product/ProductFilters";
import {
  getShopSets,
  getHeroImage,
  type ShopSetProduct,
  type PageHeroImage,
  type ShopSetQueryParams,
} from "../../api/shopSetsApi";

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

  const productRef = useRef<HTMLDivElement>(null);
  const gradientControls = useAnimation();

  const [products, setProducts] = useState<ShopSetProduct[]>([]);
  const [hero, setHero] = useState<PageHeroImage | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingHero, setLoadingHero] = useState(true);

  /* ---------------- IMAGE HELPER ---------------- */
  const getImageUrl = (url?: string) =>
    !url
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
        if (heroData) setHero(heroData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHero(false);
      }
    };
    fetchHero();
  }, []);

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = useCallback(
    async (filters?: ShopSetQueryParams) => {
      setLoadingProducts(true);
      try {
        const finalFilters = { ...(search ? { search } : {}), ...filters };
        const data = await getShopSets(finalFilters);
        setProducts(data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    },
    [search]
  );

  /* ---------------- INITIAL FETCH ---------------- */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ---------------- APPLY FILTERS ---------------- */
  const handleApplyFilters = async (filters: ShopSetQueryParams) => {
    await fetchProducts({ ...filters, ...(search ? { search } : {}) });
    productRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------- SCROLL ---------------- */
  const scrollToProducts = () => {
    if (productRef.current) {
      const yOffset = -120;
      const y =
        productRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen bg-[#1A1A1A] text-[#EDEDED] relative overflow-hidden">
      {/* ================= HERO ================= */}
      <div className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        {loadingHero ? (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center animate-pulse">
            <p className="text-[#C9A24D] font-bold text-lg sm:text-2xl">
              Loading hero...
            </p>
          </div>
        ) : hero ? (
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: easeOut }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getImageUrl(hero.background_image)})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <p className="text-[#C9A24D] font-bold text-lg sm:text-2xl">
              Hero image not available
            </p>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40" />

        {/* Hero Text */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-4 sm:px-6"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#C9A24D] mb-4 sm:mb-6"
          >
            {hero?.title || "Timeless Jewelry Sets"}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="max-w-xl sm:max-w-2xl mx-auto text-[#EDEDED]/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-6"
          >
            {hero?.subtitle || "Crafted to perfection. Designed to be worn together."}
          </motion.p>
          <motion.button
            onClick={scrollToProducts}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-[#C9A24D] text-black font-semibold shadow-lg hover:shadow-2xl transition-all"
          >
            Explore Collections
          </motion.button>
        </motion.div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 z-0">
        <div className="absolute inset-0 pointer-events-none">
          {sparkles.map((s, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gradient-to-tr from-[#C084FC]/60 to-[#F472B6]/60"
              style={{ top: s.top, left: s.left }}
              animate={{ y: [0, -8, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                repeatType: "mirror",
                delay: s.delay,
              }}
            />
          ))}
          <motion.div
            animate={gradientControls}
            className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full top-0 left-1/4 blur-3xl"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10" ref={productRef}>
          {/* Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
            viewport={{ once: true }}
            className="w-full lg:w-1/4 mb-8 lg:mb-0"
          >
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
              className="sticky top-24 lg:top-28 rounded-3xl bg-[#0D0D0D]/80 border border-[#C9A24D]/20 p-4 sm:p-6 shadow-2xl"
            >
              <ProductFilters onApply={handleApplyFilters} />
            </motion.div>
          </motion.aside>

          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            {loadingProducts ? (
              <p className="text-center text-[#C9A24D]">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-center text-[#C9A24D]">No products found.</p>
            ) : (
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.35, ease: easeOut }}
                  >
                    <ProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        description: product.description ?? "",
                        images: [product.image_main, product.image_secondary || product.image_main],
                        price: product.price,
                        product_type: "set",
                      }}
                      onClick={(id) => navigate(`/productSet/${id}`)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
