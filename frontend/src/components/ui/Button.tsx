"use client";

import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.95 }}
      whileFocus={{ outline: "none" }}
      className={`
        relative px-7 py-3 sm:px-8 sm:py-4 rounded-3xl text-base sm:text-lg font-semibold uppercase tracking-wide transition-all duration-300 transform select-none
        ${
          variant === "primary"
            ? "bg-[#C9A24D] text-[#1A1A1A] hover:bg-[#B08B3E]"
            : "border border-[#C9A24D] text-[#C9A24D] bg-transparent hover:bg-[#C9A24D] hover:text-[#1A1A1A]"
        }
        ${className}
      `}
    >
      {/* Elegant gold glow pulse behind text for luxury feel */}
      {variant === "primary" && (
        <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#C9A24D]/30 via-[#FFD700]/20 to-[#B08B3E]/30 opacity-70 blur-xl pointer-events-none animate-pulse"></span>
      )}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
