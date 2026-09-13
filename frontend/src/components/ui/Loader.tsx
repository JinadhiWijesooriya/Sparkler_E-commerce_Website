"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 bg-[#1A1A1A]">
      
      {/* Outer golden halo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
        className="relative w-16 h-16 rounded-full border-2 border-[#C9A24D]/40"
      >
        {/* Inner spinning arc */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="absolute inset-1 rounded-full border-2 border-transparent border-t-[#C9A24D] border-r-[#B08B3E]"
        />

        {/* Center gem dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#C9A24D] shadow-[0_0_15px_rgba(201,162,77,0.8)]" />
        </div>
      </motion.div>

      {/* Loading text */}
      <p className="text-sm tracking-widest uppercase text-[#BDBDBD]">
        Loading
      </p>
    </div>
  );
}
