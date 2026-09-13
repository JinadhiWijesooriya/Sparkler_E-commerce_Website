"use client";

import { type ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  
}: ModalProps) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg bg-[#1A1A1A] 
                       border border-[#C9A24D]/40 rounded-3xl 
                       shadow-[0_30px_80px_rgba(0,0,0,0.7)] 
                       overflow-hidden"
          >
            {/* Gold top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-[#C9A24D] via-[#B08B3E] to-[#C9A24D]" />

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#C9A24D]/20">
              {title && (
                <h3 className="text-[#C9A24D] text-xl font-semibold tracking-wide">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="text-[#C9A24D] text-2xl font-light hover:text-[#B08B3E] transition-colors"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6 text-[#EDEDED] text-sm leading-relaxed">
              {children}
            </div>

            {/* Subtle inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl 
                            bg-gradient-to-t from-[#C9A24D]/10 via-transparent to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
