"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Gem } from "lucide-react";
import StepIndicator from "./checkout/StepIndicator";
import ShippingStep from "./checkout/ShippingStep";
import PaymentStep from "./checkout/PaymentStep";
// -------------------------
// Component
// -------------------------
export default function CheckoutModal({ isOpen, onClose, }) {
    const [step, setStep] = useState(1);
    const [invoiceConsent, setInvoiceConsent] = useState(false);
    // -------------------------
    // Shipping Info (frontend)
    // -------------------------
    const [shippingInfo, setShippingInfo] = useState({
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
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { className: "fixed inset-0 z-[9999] flex items-center justify-center px-3", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [_jsx("div", { className: "absolute inset-0 bg-black/80 backdrop-blur-md" }), _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "relative w-full max-w-3xl max-h-[92vh]\n                       bg-[#141414] rounded-2xl overflow-hidden\n                       border border-[#C9A24D]/20 shadow-2xl flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-[#C9A24D]/20", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Gem, { size: 18, className: "text-[#C9A24D]" }), _jsx("span", { className: "text-sm font-semibold text-[#C9A24D]", children: "Secure Checkout" })] }), _jsx("button", { onClick: onClose, "aria-label": "close", className: "w-9 h-9 rounded-full bg-[#C9A24D] flex items-center justify-center", children: _jsx(X, { size: 18, className: "text-[#1A1A1A]" }) })] }), _jsx(StepIndicator, { step: step }), _jsxs("div", { className: "flex-1 overflow-y-auto px-4 pb-5", children: [step === 1 && (_jsx(ShippingStep, { shippingInfo: shippingInfo, setShippingInfo: setShippingInfo, onNext: () => setStep(2) })), step === 2 && (_jsx(PaymentStep, { shippingInfo: shippingInfo, invoiceConsent: invoiceConsent, setInvoiceConsent: setInvoiceConsent, onBack: () => setStep(1) }))] })] })] })) }));
}
