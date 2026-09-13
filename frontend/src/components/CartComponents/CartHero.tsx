"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Globe, Gem } from "lucide-react";

export default function CartHero() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative py-24 px-6 text-center overflow-hidden">
      {/* Background Spotlights */}
      <motion.div
        animate={{ x: [-50, 50, -30, 30, 0], y: [0, -30, 20, -20, 0], rotate: [0, 20, -15, 25, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(255,205,90,0.25),transparent_60%)] blur-3xl mix-blend-screen z-0"
      />
      <motion.div
        animate={{ x: [0, -40, 40, -20, 0], y: [0, 30, -30, 15, 0], rotate: [0, -25, 15, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-36 -right-32 w-[750px] h-[750px] rounded-full bg-[radial-gradient(circle,rgba(191,19,99,0.22),transparent_70%)] blur-3xl mix-blend-screen z-0"
      />
      <motion.div
        animate={{ x: [0, 15, -15, 10, 0], y: [0, -20, 15, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-1/2 left-1/3 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,162,77,0.18),transparent_70%)] blur-2xl mix-blend-screen z-0"
      />

      {/* Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -15 + i * 3, 10 - i * 2, 0], x: [0, 5 - i * 2, -5 + i * 2, 0], opacity: [0.3, 1, 0.5, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-2 h-2 rounded-full bg-[#C9A24D] shadow-lg"
          style={{ top: `${10 + i * 10}%`, left: `${15 + i * 12}%` }}
        />
      ))}

      {/* Floating Gems */}
      <motion.div animate={{ y: [0, -20, 0], rotate: [0, 15, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute right-10 top-12 opacity-20 z-10">
        <Gem size={120} color="#C9A24D" />
      </motion.div>
      <motion.div animate={{ y: [0, 25, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute left-8 top-20 opacity-15 z-10">
        <Gem size={80} color="#B08B3E" />
      </motion.div>

      {/* Hero Text */}
      <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#C9A24D] drop-shadow-lg relative z-10">
        Your Luxurious Cart
      </motion.h1>
      <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 text-lg md:text-xl text-[#BDBDBD] max-w-xl mx-auto relative z-10">
        Review your selected jewelry pieces, each crafted with timeless elegance and certified gemstones.
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center gap-8 mt-8 flex-wrap text-sm text-[#BDBDBD] relative z-10">
        <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#0FA3B1]" /> Secure Payments</div>
        <div className="flex items-center gap-2"><Gem size={18} className="text-[#C9A24D]" /> Certified Gems</div>
        <div className="flex items-center gap-2"><Globe size={18} className="text-[#0FA3B1]" /> Worldwide Shipping</div>
      </motion.div>
    </motion.section>
  );
}
