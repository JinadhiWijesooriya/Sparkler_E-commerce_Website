import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

import type { Feature } from "../../api/homeApi";
import { HomeApi } from "../../api/api";

/* ---------------- Sparkles (static visual effect) ---------------- */
const generateSparkles = (count: number) =>
  Array.from({ length: count }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 3,
  }));

/* ---------------- Component ---------------- */
export default function WhySparkler() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  // Reduce sparkle count on mobile for performance
  const sparkles = useMemo(
    () => generateSparkles(window.innerWidth < 640 ? 16 : 30),
    []
  );

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const data = await HomeApi.getHomepageData();
        setFeatures(data.features || []);
      } catch (error) {
        console.error("Failed to fetch features:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-[#1A1A1A] text-center text-gold text-sm sm:text-base">
        Loading features...
      </section>
    );
  }

  if (!features.length) return null;

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-[#1A1A1A]">
      {/* ---------------- Sparkles ---------------- */}
      <div className="absolute inset-0 pointer-events-none">
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#A78BFA]/60"
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
      </div>

      {/* ---------------- Glow Background ---------------- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#C084FC]/10 top-0 left-1/4 blur-3xl animate-pulse-slow" />
        <div className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-[#A78BFA]/20 bottom-10 right-1/3 blur-2xl animate-pulse-slower" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        {/* ---------------- Header ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-[#EDEDED]">
            Why Sparkler?
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-[#BDBDBD] max-w-2xl mx-auto">
            Experience the elegance, trust, and craftsmanship that makes our
            jewelry stand out. Every piece is a blend of precision and timeless
            beauty.
          </p>
        </motion.div>

        {/* ---------------- Features Grid ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {features.map((f, index) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.15 * index,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ scale: 1.05 }}
              className="
                group relative
                flex items-start gap-4
                p-5 sm:p-6
                bg-[#0D0D0D]/70
                border border-[#A78BFA]/30
                rounded-2xl
                shadow-lg
                transition-all duration-500
                hover:shadow-[0_10px_50px_rgba(167,139,250,0.4)]
              "
            >
              {/* Icon */}
              <motion.span
                className="
                  flex-shrink-0
                  w-9 h-9 sm:w-10 sm:h-10
                  rounded-full
                  bg-[#C9A24D]/30
                  text-[#C9A24D]
                  font-bold
                  flex items-center justify-center
                  text-lg sm:text-xl
                  group-hover:bg-[#B08B3E]
                  group-hover:text-[#1A1A1A]
                  transition-colors duration-300
                "
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                ✔
              </motion.span>

              {/* Text */}
              <motion.p
                className="
                  text-sm sm:text-base md:text-lg
                  text-[#EDEDED]
                  font-medium
                  group-hover:text-[#C9A24D]
                "
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {f.title}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
