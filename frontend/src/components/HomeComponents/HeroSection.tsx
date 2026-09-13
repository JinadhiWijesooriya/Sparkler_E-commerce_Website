import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

import type { Hero } from "../../api/homeApi";
import { HomeApi } from "../../api/api";

/* ------------------ Animations ------------------ */

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* Trust line animation */
const trustContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const trustItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/* ------------------ Component ------------------ */

export default function HeroSection() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await HomeApi.getHomepageData();
        if (data.hero?.is_active) {
          setHero(data.hero);
        }
      } catch (error) {
        console.error("Failed to load hero section", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[100svh] bg-[#1A1A1A] flex items-center justify-center">
        <div className="animate-pulse text-gold text-base sm:text-lg">
          Loading...
        </div>
      </section>
    );
  }

  if (!hero) return null;

  const trustItems = [
    "🌍 Global Shipping",
    "💎 Certified Gemstones",
    "🛡️ Lifetime Warranty",
  ];

  return (
    <section className="relative min-h-[100svh] md:min-h-[85vh] flex items-center justify-center bg-[#1A1A1A] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.img
          src={hero.background_image}
          alt={hero.title}
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/80" />
      </div>

      {/* Content */}
      /*<motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          relative z-10
          w-full max-w-3xl
          mx-4 sm:mx-6
          text-center
          px-5 sm:px-8 md:px-10
          py-8 sm:py-10 md:py-12
          backdrop-blur-xl
          bg-black/30
          border border-gold/40
          rounded-2xl md:rounded-3xl
          shadow-2xl
        "
      >
        {/* Badge */}
        <motion.span
          variants={itemVariants}
          className="
            inline-block
            px-4 py-1
            text-[10px] sm:text-xs
            tracking-widest uppercase
            bg-gold/20 text-gold
            rounded-full font-semibold
          "
        >
          {hero.badge_text}
        </motion.span>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="
            mt-4
            text-3xl sm:text-4xl md:text-6xl
            font-heading
            text-gold
            leading-tight
          "
        >
          {hero.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-4 text-sm sm:text-base md:text-xl text-textPrimary"
        >
          {hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          <Link to="/shop" className="w-full sm:w-auto">
            <Button variant="primary" className="px-8 py-3 text-base md:text-lg">
              Shop Our Collection
            </Button>
          </Link>

          <Link to="/custom" className="w-full sm:w-auto">
            <Button variant="outline" className="px-8 py-3 text-base md:text-lg">
              Design With Us
            </Button>
          </Link>
        </motion.div>

        {/* Trust Line (Animated & ESLint-safe) */}
        <motion.div
          variants={trustContainer}
          initial="hidden"
          animate="visible"
          className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] sm:text-sm text-textSecondary"
        >
          {trustItems.map((item, index) => (
            <motion.span
              key={index}
              variants={trustItem}
              className="flex items-center gap-2"
            >
              {item}
              {index !== trustItems.length - 1 && (
                <span className="opacity-50">•</span>
              )}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
