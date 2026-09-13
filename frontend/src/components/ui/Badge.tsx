"use client";

import { motion } from "framer-motion";

export default function Badge({ label }: { label: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.1, boxShadow: "0 0 12px rgba(201,162,77,0.6)" }}
      whileTap={{ scale: 0.95 }}
      className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full 
                 bg-gradient-to-r from-[#C9A24D]/40 to-[#B08B3E]/40 
                 text-[#EDEDED] border border-[#C9A24D]/50 shadow-md 
                 tracking-wide uppercase select-none transition-all duration-300"
    >
      {label}
    </motion.span>
  );
}
