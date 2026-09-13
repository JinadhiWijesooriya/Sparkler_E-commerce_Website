import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import type { Collection } from "../../api/homeApi";
import { HomeApi } from "../../api/api";

/* ---------------- Sparkles (static visual effect) ---------------- */

const sparkles = Array.from({ length: 40 }).map(() => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 2,
  duration: 3 + Math.random() * 2,
}));

/* ---------------- Component ---------------- */

export default function FeaturedCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await HomeApi.getHomepageData();
        setCollections(data.collections || []);
      } catch (error) {
        console.error("Failed to load collections", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-[#1A1A1A] text-center text-[#C9A24D] text-sm sm:text-base">
        Loading collections...
      </section>
    );
  }

  if (!collections.length) return null;

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* ---------------- Background ---------------- */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F1F1F] via-[#1A1A1A] to-[#0D0D0D]" />

        <div className="absolute inset-0">
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#C9A24D]/10 top-10 left-1/4 blur-3xl animate-pulse-slow" />
          <div className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-[#C9A24D]/20 bottom-20 right-1/3 blur-2xl animate-pulse-slower" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {sparkles.map((s, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#C9A24D] rounded-full opacity-40"
              style={{ top: s.top, left: s.left }}
              animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                repeatType: "mirror",
                delay: s.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* ---------------- Content ---------------- */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        {/* ---------------- Header ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-14 text-center md:text-left"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-[#EDEDED]">
            Featured Collections
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#BDBDBD] max-w-xl mx-auto md:mx-0">
            Explore our most loved jewelry collections, crafted with precision,
            heritage, and timeless elegance.
          </p>
        </motion.div>

        {/* ---------------- Grid ---------------- */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6 sm:gap-8
          "
        >
          {collections.map((c, index) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="
                group relative
                rounded-2xl sm:rounded-3xl
                overflow-hidden
                border border-[#C9A24D]/30
                bg-black/40
                shadow-xl
              "
            >
              {/* Image */}
              <Link to={`/collections/${c.slug}`}>
                <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
              </Link>

              {/* Content */}
              <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                <div className="w-full space-y-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#EDEDED]">
                    {c.name}
                  </h3>

                  {/* Button */}
                  <Link
                    to="/sets"
                    className="
                      inline-flex items-center justify-center
                      rounded-full
                      border border-[#C9A24D]/60
                      px-4 sm:px-5
                      py-2
                      text-xs sm:text-sm
                      font-medium
                      text-[#C9A24D]
                      backdrop-blur-sm
                      transition-all duration-300
                      hover:bg-[#C9A24D]
                      hover:text-black
                      hover:shadow-[0_0_25px_rgba(201,162,77,0.5)]
                    "
                  >
                    Explore Collection →
                  </Link>
                </div>
              </div>

              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_60px_rgba(201,162,77,0.15)]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
