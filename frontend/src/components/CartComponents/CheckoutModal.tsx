"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Gem } from "lucide-react";

import StepIndicator from "./checkout/StepIndicator";
import ShippingStep from "./checkout/ShippingStep";
import type { ShippingInfo as FrontShippingInfo } from "./checkout/ShippingStep";
import PaymentStep from "./checkout/PaymentStep";



// -------------------------
// Props
// -------------------------
export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (orderId: string) => void;
}

// -------------------------
// Component
// -------------------------
export default function CheckoutModal({
  isOpen,
  onClose,
}: CheckoutModalProps) {


  const [step, setStep] = useState<1 | 2>(1);
  const [invoiceConsent, setInvoiceConsent] = useState(false);

  // -------------------------
  // Shipping Info (frontend)
  // -------------------------
  const [shippingInfo, setShippingInfo] = useState<FrontShippingInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Sri Lanka",
    state: "",
    postalCode: "",
  });

  // -------------------------
  // Lock body scroll
  // -------------------------
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-3xl max-h-[92vh]
                       bg-[#141414] rounded-2xl overflow-hidden
                       border border-[#C9A24D]/20 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#C9A24D]/20">
              <div className="flex items-center gap-2">
                <Gem size={18} className="text-[#C9A24D]" />
                <span className="text-sm font-semibold text-[#C9A24D]">
                  Secure Checkout
                </span>
              </div>

              <button
                onClick={onClose}
                aria-label="close"
                className="w-9 h-9 rounded-full bg-[#C9A24D] flex items-center justify-center"
              >
                <X size={18} className="text-[#1A1A1A]" />
              </button>
            </div>

            {/* Steps */}
            <StepIndicator step={step} />

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-5">
              {step === 1 && (
                <ShippingStep
                  shippingInfo={shippingInfo}
                  setShippingInfo={setShippingInfo}
                  onNext={() => setStep(2)}
                />
              )}

              {step === 2 && (
                <PaymentStep
                  shippingInfo={shippingInfo}
                  invoiceConsent={invoiceConsent}
                  setInvoiceConsent={setInvoiceConsent}
                  onBack={() => setStep(1)}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
