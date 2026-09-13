"use client";

import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: -50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
};

const ConsultationModal: FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="bg-[#1A1A1A] w-full max-w-md sm:max-w-lg md:max-w-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-[#C9A24D]/20 relative overflow-hidden">
              
              {/* Decorative Top Gradient */}
              <div className="absolute top-0 left-0 w-full h-16 sm:h-20 bg-gradient-to-b from-[#C9A24D]/20 to-transparent rounded-t-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-[#C9A24D] hover:text-[#B08B3E] transition text-2xl sm:text-3xl font-bold"
              >
                ×
              </button>

              {/* Modal Header */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C9A24D] mb-4 sm:mb-6 text-center">
                Book a Consultation
              </h2>

              <p className="text-[#BDBDBD] text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-center max-w-[90%] sm:max-w-[85%] mx-auto leading-relaxed">
                Fill out the form below and our gem experts will contact you to schedule a private consultation. Experience the luxury of bespoke jewelry.
              </p>

              {/* Form */}
              <form className="flex flex-col gap-4 sm:gap-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="p-3 sm:p-4 rounded-xl bg-[#2A2A2A] border border-[#C9A24D]/30 text-[#EDEDED] placeholder-[#BDBDBD] focus:ring-2 focus:ring-[#C9A24D] focus:border-[#C9A24D] transition text-sm sm:text-base"
                  required
                />

                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="p-3 sm:p-4 rounded-xl bg-[#2A2A2A] border border-[#C9A24D]/30 text-[#EDEDED] placeholder-[#BDBDBD] focus:ring-2 focus:ring-[#C9A24D] focus:border-[#C9A24D] transition text-sm sm:text-base"
                  required
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="p-3 sm:p-4 rounded-xl bg-[#2A2A2A] border border-[#C9A24D]/30 text-[#EDEDED] placeholder-[#BDBDBD] focus:ring-2 focus:ring-[#C9A24D] focus:border-[#C9A24D] transition text-sm sm:text-base"
                  required
                />
                <textarea
                  placeholder="Message (optional)"
                  className="p-3 sm:p-4 rounded-xl bg-[#2A2A2A] border border-[#C9A24D]/30 text-[#EDEDED] placeholder-[#BDBDBD] resize-none h-24 sm:h-28 focus:ring-2 focus:ring-[#C9A24D] focus:border-[#C9A24D] transition text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="bg-[#C9A24D] hover:bg-[#B08B3E] text-black font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg transition-all shadow-lg hover:shadow-2xl"
                >
                  Submit
                </button>
              </form>

              {/* Decorative Bottom Gradient */}
              <div className="absolute bottom-0 left-0 w-full h-12 sm:h-16 bg-gradient-to-t from-[#C9A24D]/20 to-transparent rounded-b-3xl pointer-events-none" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConsultationModal;
