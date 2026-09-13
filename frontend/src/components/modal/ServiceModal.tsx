"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import Button from "../ui/Button";

export interface Service {
  title: string;
  description: string;
  estimatedCost: string;
  beforeAfterImages: string[];
  // optional: you can later add viewer360 if needed
  // viewer360?: string;
}

interface Props {
  service: Service | null;
  onClose: () => void;
}

/* ---------------- ANIMATION VARIANTS ---------------- */

const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modal: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 30,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function ServiceModal({ service, onClose }: Props) {
  return (
    <AnimatePresence>
      {service && (
        <motion.div
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            variants={modal}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-[#1A1A1A] border border-[#C9A24D]/25 shadow-[0_40px_120px_rgba(0,0,0,0.85)]"
          >
            {/* Spotlight Glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#bf1363]/30 blur-[160px]" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-6 right-6 z-10 text-[#C9A24D] hover:text-[#B08B3E] transition rounded-full focus:outline-none focus:ring-2 focus:ring-[#C9A24D]/40"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Content */}
            <div className="relative p-8 md:p-14 space-y-12 max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row justify-between gap-4"
              >
                <h2 className="text-4xl font-extrabold text-[#EDEDED]">{service.title}</h2>
                <span className="text-lg font-semibold text-[#C9A24D]">{service.estimatedCost}</span>
              </motion.div>

              {/* Description */}
              <motion.p
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-[#BDBDBD] leading-relaxed max-w-3xl"
              >
                {service.description}
              </motion.p>

              {/* 360° View */}
              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-center space-y-4"
              >
                <h3 className="text-xl font-semibold text-[#C9A24D]">360° Product View</h3>
                <div className="mx-auto max-w-md aspect-square rounded-2xl border border-[#C9A24D]/20 bg-[#1F1F1F] flex items-center justify-center text-[#BDBDBD] font-semibold">
                  {/* Placeholder for 360° viewer */}
                  360° Viewer Here
                </div>
              </motion.div>

              {/* Before / After */}
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 gap-6"
              >
                {service.beforeAfterImages.map((img, i) => (
                  <motion.img
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    src={img}
                    alt={`${service.title} comparison ${i + 1}`}
                    className="rounded-2xl h-56 w-full object-cover border border-[#C9A24D]/20"
                  />
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-center pt-6"
              >
                <Button className="px-8 py-2.5 rounded-full bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] font-semibold transition">
                  Request Consultation
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
