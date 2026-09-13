"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function Modal({ isOpen, onClose, title, children, }) {
    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        if (isOpen)
            document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose, className: "absolute inset-0 bg-black/80 backdrop-blur-md" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.92, y: 30 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.92, y: 30 }, transition: { duration: 0.4, ease: "easeOut" }, className: "relative z-10 w-full max-w-lg bg-[#1A1A1A] \n                       border border-[#C9A24D]/40 rounded-3xl \n                       shadow-[0_30px_80px_rgba(0,0,0,0.7)] \n                       overflow-hidden", children: [_jsx("div", { className: "h-1 w-full bg-gradient-to-r from-[#C9A24D] via-[#B08B3E] to-[#C9A24D]" }), _jsxs("div", { className: "flex items-center justify-between px-8 py-6 border-b border-[#C9A24D]/20", children: [title && (_jsx("h3", { className: "text-[#C9A24D] text-xl font-semibold tracking-wide", children: title })), _jsx("button", { onClick: onClose, "aria-label": "Close modal", className: "text-[#C9A24D] text-2xl font-light hover:text-[#B08B3E] transition-colors", children: "\u00D7" })] }), _jsx("div", { className: "px-8 py-6 text-[#EDEDED] text-sm leading-relaxed", children: children }), _jsx("div", { className: "pointer-events-none absolute inset-0 rounded-3xl \n                            bg-gradient-to-t from-[#C9A24D]/10 via-transparent to-transparent" })] })] })) }));
}
