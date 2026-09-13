"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import type { CustomJewelryCTA as CustomJewelryCTAType } from "../../api/homeApi";
import { HomeApi } from "../../api/api";

/* ---------------- Sparkles (visual effect) ---------------- */
const generateSparkles = () =>
  Array.from({ length: 40 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
    opacity: 0.3 + Math.random() * 0.5,
  }));

/* ---------------- Component ---------------- */
export default function CustomJewelryCTA() {
  const [cta, setCta] = useState<CustomJewelryCTAType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sparkles] = useState(generateSparkles);

  useEffect(() => {
    const fetchCTA = async () => {
      try {
        const data = await HomeApi.getHomepageData();
        if (data.cta?.is_active) setCta(data.cta);
      } catch (error) {
        console.error("Failed to fetch custom jewelry CTA:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCTA();
  }, []);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <section className="py-16 sm:py-28 text-center text-[#C9A24D] bg-[#1A1A1A] text-sm sm:text-base">
        Loading...
      </section>
    );
  }

  if (!cta) return null;

  return (
    <section className="relative py-16 sm:py-28 overflow-hidden text-[#EDEDED]">
      {/* ---------------- Background Image ---------------- */}
      <div className="absolute inset-0">
        <img
          src={cta.background_image}
          alt={cta.title}
          className="w-full h-full object-cover brightness-75"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-[#1A1A1A]/70" />
      </div>

      {/* ---------------- Floating Sparkles ---------------- */}
      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#C9A24D]"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
          animate={{ y: [0, -10, 0], opacity: [s.opacity, 1, s.opacity] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            repeatType: "mirror",
            delay: s.delay,
          }}
        />
      ))}

      {/* ---------------- Content ---------------- */}
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center z-10">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="
            text-3xl sm:text-4xl md:text-5xl
            font-heading
            mb-3 sm:mb-4
            tracking-tight
            text-[#C9A24D]
          "
        >
          {cta.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="
            text-sm sm:text-lg md:text-xl
            text-[#BDBDBD]
            mb-6 sm:mb-8
          "
        >
          {cta.subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/custom">
            <Button
              variant="primary"
              className="
                bg-[#C9A24D]
                text-[#1A1A1A]
                py-3
                px-6 sm:px-8
                text-sm sm:text-base
                rounded-3xl
                font-semibold
                shadow-lg
                transition-all duration-300
                hover:bg-[#B08B3E]
                hover:shadow-[0_0_40px_rgba(201,162,77,0.5)]
                transform hover:-translate-y-1
                active:scale-95
              "
            >
              Start Custom Design
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
