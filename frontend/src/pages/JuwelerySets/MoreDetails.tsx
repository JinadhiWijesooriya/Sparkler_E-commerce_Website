"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond,
  Hexagon,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  Maximize2,
  Package,
  ShoppingCart,
  MessageCircle,
  type LucideIcon
} from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency";
import ProductCard from "../../components/product/ProductCard";
import type { ProductCardType } from "../../components/product/ProductCard";
import type { ShopSetProduct } from "../../api/shopSetsApi";
import { getShopSetById, getShopSets } from "../../api/shopSetsApi";
import { useCart } from "../../context/useCart";

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

/* ---------------- MAP API PRODUCT TO FRONTEND TYPE ---------------- */
const mapAPIProductToCard = (p: ShopSetProduct): ProductCardType => ({
  id: p.id,
  name: p.name,
  price: p.price,
  description: p.description ?? "Handcrafted luxury jewelry set.",
  images: [p.image_main, p.image_secondary || p.image_main],
  product_type: "set",
});

export default function MoreDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currency = useCurrency();
  const formatPrice = currency?.format ?? ((p: number) => `LKR ${p.toLocaleString()}`);

  const { addToCart } = useCart();

  const [product, setProduct] = useState<ShopSetProduct | null>(null);
  const [related, setRelated] = useState<ProductCardType[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("/placeholder.jpg");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD PRODUCT & RELATED ---------------- */
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const productData = await getShopSetById(Number(id));
        setProduct(productData);
        setSelectedImage(productData.image_main);

        const allProducts = await getShopSets();
        setRelated(
          allProducts.results
            .filter((p) => p.id !== productData.id)
            .slice(0, 4)
            .map(mapAPIProductToCard)
        );
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id, "set", quantity);
  };

  const handleInquiry = () => {
    if (!product) return;
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
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#C9A24D]/20 border-t-[#C9A24D] rounded-full animate-spin mb-4" />
        <p className="text-[#C9A24D] font-bold tracking-widest uppercase text-sm animate-pulse">Unveiling Elegance...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-bold text-white mb-4">Masterpiece Not Found</h2>
        <button
          onClick={() => navigate("/sets")}
          className="text-[#C9A24D] flex items-center gap-2 hover:underline"
        >
          <ChevronLeft size={20} /> Back to Collection
        </button>
      </div>
    );
  }

  const images = [product.image_main, product.image_secondary].filter(Boolean) as string[];

  /* ---------------- HELPER: SPLIT TO CHAPTERS ---------------- */
  const descriptionChapters = (product?.description || "A harmonious blend of precious metals and ethereal gemstones, designed to tell a story of timeless grace and sophistication.")
    .split("\n")
    .filter(line => line.trim().length > 0);

  const chapterIcons = [Sparkles, Diamond, ShieldCheck, Hexagon];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white pb-24"
    >
      {/* ---------------- NAVIGATION ---------------- */}
      <div className="max-w-7xl mx-auto px-4 pt-8 mb-8">
        <button
          onClick={() => navigate("/sets")}
          className="group flex items-center gap-2 text-white/40 hover:text-[#C9A24D] transition-colors"
        >
          <div className="p-2 rounded-full border border-white/10 group-hover:border-[#C9A24D]/50 transition-all">
            <ChevronLeft size={18} />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">Back to Collection</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ---------------- LEFT: GALLERY ---------------- */}
        <div className="space-y-6">
          <motion.div
            layoutId={`set-image-${product.id}`}
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
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <button className="absolute bottom-6 right-6 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#C9A24D] hover:text-black transition-all">
              <Maximize2 size={24} />
            </button>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-24 h-24 aspect-square rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === img ? "border-[#C9A24D] scale-95" : "border-white/10 hover:border-white/30"
                  }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Description Chapters (Moved to take full height or appearing under gallery if needed, but keeping on right for now per flow) */}
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
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Jewelry Set</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
              {product.name}
            </h1>
            <div className="flex items-center gap-6">
              <p className="text-4xl font-bold text-[#C9A24D]">
                {formatPrice(product.price)}
              </p>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                {product.availability === "in_stock" ? "Available" : "Bespoke Only"}
              </div>
            </div>
          </div>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 gap-4">
            <SpecItem icon={Diamond} label="Main Gem" value={product.gem} />
            <SpecItem icon={Package} label="Metal" value={product.metal} />
            <SpecItem icon={Hexagon} label="Carat Total" value={`${product.carat}ct`} />
            <SpecItem icon={ShieldCheck} label="Origin" value="Authentic Craft" />
          </div>

          {/* The Artisan's Vision - CHAPTERS */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A24D]/30"></div>
              <h3 className="text-lg font-bold uppercase tracking-[0.3em] text-[#C9A24D]">The Artisan's Vision</h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A24D]/30"></div>
            </div>

            <div className="space-y-10 relative">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C9A24D]/50 via-white/10 to-transparent" />

              {descriptionChapters.map((chapter, idx) => {
                const Icon = chapterIcons[idx % chapterIcons.length];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-12 group"
                  >
                    {/* Chapter marker */}
                    <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-black border border-[#C9A24D]/30 flex items-center justify-center text-[#C9A24D] group-hover:border-[#C9A24D] group-hover:bg-[#C9A24D]/5 shadow-lg shadow-[#C9A24D]/10 transition-all z-10">
                      <Icon size={16} />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[#C9A24D] text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Chapter {idx + 1}</p>
                      <p className="text-white/70 leading-relaxed text-lg italic font-light group-hover:text-white transition-colors">
                        "{chapter.trim()}"
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quantity & Cart Actions */}
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Quantity</span>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >-</button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >+</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-5 rounded-full bg-white text-black font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-[#C9A24D] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98]"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={handleInquiry}
                className="flex-1 py-5 rounded-full border border-white/20 text-white font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-[0.98]"
              >
                <MessageCircle size={20} />
                Expert Quote
              </button>
            </div>
          </div>

          <p className="text-center text-white/30 text-xs font-medium uppercase tracking-widest">
            Exquisite presentation box & certificate included
          </p>
        </div>
      </div>

      {/* ---------------- RELATED SECTION ---------------- */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#C9A24D] text-xs font-bold uppercase tracking-[0.3em] mb-2">Heritage Collection</p>
              <h2 className="text-4xl font-black tracking-tighter">Related <span className="text-[#C9A24D]">Masterpieces</span></h2>
            </div>
            <button
              onClick={() => navigate("/sets")}
              className="px-6 py-2 rounded-full border border-white/20 hover:border-[#C9A24D] hover:text-[#C9A24D] transition-all text-sm font-bold uppercase tracking-widest"
            >
              Explore All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={(id) => {
                  navigate(`/productSet/${id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
