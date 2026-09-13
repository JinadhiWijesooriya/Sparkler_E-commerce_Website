"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Product as ProductType } from "../../api/homeApi";
import { HomeApi } from "../../api/api";
import { AnimatePresence } from "framer-motion";

/* ---------------- Sparkles ---------------- */
const generateSparkles = () =>
  Array.from({ length: 30 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 3,
  }));

/* ---------------- HELPERS ---------------- */
const limitDescription = (desc?: string, maxLength = 100) =>
  !desc ? "" : desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;

/* ---------------- PopularProductCard ---------------- */
interface PopularProductCardType {
  id: number;
  name: string;
  price: number;
  description?: string;
  images: string[];
}

interface PopularProductCardProps {
  product: PopularProductCardType;
  maxDescriptionLength?: number;
  onClick?: (id: number) => void;
}

function PopularProductCard({
  product,
  maxDescriptionLength = 100,
  onClick,
}: PopularProductCardProps) {
  const images: string[] = Array.isArray(product.images)
    ? product.images.filter((img): img is string => Boolean(img))
    : [];

  const firstImage = images[0] ?? "/placeholder.jpg";
  const [activeImage, setActiveImage] = useState(firstImage);

  return (
    <motion.div
      className="bg-[#1A1A1A] border border-[#C9A24D]/30 rounded-3xl overflow-hidden cursor-pointer flex flex-col"
      whileHover={{ scale: 1.03 }}
      onClick={() => onClick?.(product.id)}
    >
      {/* IMAGE CAROUSEL */}
      <div className="relative w-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={product.name}
            className="w-full h-64 object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {images.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumbnail-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(img);
                }}
                className={`w-10 h-10 rounded-lg cursor-pointer border-2 object-cover ${
                  activeImage === img ? "border-[#C9A24D]" : "border-transparent"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <h3 className="text-[#C9A24D] font-semibold">{product.name}</h3>
        <p className="text-[#BDBDBD] text-sm mt-1">
          {limitDescription(product.description, maxDescriptionLength)}
        </p>
        {/* ⚡ CURRENCY UPDATED TO LKR */}
        <p className="text-xl font-bold text-[#C9A24D] mt-2">LKR {product.price}</p>
      </div>
    </motion.div>
  );
}

/* ---------------- PopularProducts Component ---------------- */
export default function PopularProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sparkles] = useState(generateSparkles);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await HomeApi.getHomepageData();
        const popularProducts = data.products.filter((p) => p.is_popular);
        setProducts(popularProducts);
      } catch (error) {
        console.error("Failed to fetch popular products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 text-center text-[#C9A24D] bg-[#1A1A1A] text-sm sm:text-base">
        Loading popular products...
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/popular-bg.jpg')]">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#C9A24D]/50"
            style={{ top: s.top, left: s.left }}
            animate={{ y: [0, -6, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              repeatType: "mirror",
              delay: s.delay,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-12 text-center md:text-left"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-[#EDEDED] drop-shadow-lg">
            Popular Products
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#BDBDBD] max-w-2xl mx-auto md:mx-0">
            Discover our most loved jewelry pieces. Each product combines
            elegance, craftsmanship, and luxury designed to dazzle.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6 sm:gap-8
          "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {products.map((p, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <PopularProductCard
                product={{
                  id: index,
                  name: p.name,
                  price: p.price,
                  images: p.images.map((img) => img.image),
                  description: p.description,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
