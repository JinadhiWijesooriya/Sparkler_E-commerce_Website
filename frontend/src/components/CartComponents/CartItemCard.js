"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "../../context/useCart";
export default function CartItemCard({ cartItemId, name, price, quantity, product_images = [], minQuantity = 1, maxQuantity = 999, loading = false, }) {
    const { updateCartItem, removeCartItem } = useCart();
    const [updating, setUpdating] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    /* -------------------------- NORMALIZE IMAGES -------------------------- */
    const images = product_images && product_images.length > 0
        ? product_images
        : []; // Empty array if no images
    /* -------------------------- QUANTITY HANDLERS -------------------------- */
    const handleUpdateQuantity = async (amount) => {
        const newQuantity = quantity + amount;
        if (newQuantity < minQuantity || newQuantity > maxQuantity)
            return;
        try {
            setUpdating(true);
            await updateCartItem(cartItemId, newQuantity);
        }
        finally {
            setUpdating(false);
        }
    };
    const handleRemoveItem = async () => {
        try {
            setUpdating(true);
            await removeCartItem(cartItemId);
        }
        finally {
            setUpdating(false);
        }
    };
    /* -------------------------- CAROUSEL CONTROLS -------------------------- */
    const prevImage = () => {
        setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
    };
    const nextImage = () => {
        setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
    };
    /* -------------------------- PRICE FORMAT -------------------------- */
    const totalPrice = price * quantity;
    const formattedPrice = totalPrice.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
    });
    return (_jsxs(motion.div, { layout: true, initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 }, whileHover: { y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }, transition: { duration: 0.2, type: "spring", stiffness: 220, damping: 20 }, className: `flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-[#C9A24D]/20 ${updating || loading ? "opacity-60 pointer-events-none" : ""}`, children: [images.length > 0 && (_jsxs("div", { className: "relative flex-shrink-0 w-16 h-16 md:w-18 md:h-18 rounded-xl overflow-hidden border border-[#C9A24D]/30", children: [_jsx(motion.img, { src: images[currentImageIndex].image, alt: images[currentImageIndex].alt_text || name, className: "w-full h-full object-cover", whileHover: { scale: 1.05 } }, currentImageIndex), images.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: prevImage, "aria-label": "previous image", className: "absolute top-1/2 left-1 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white", children: _jsx(ChevronLeft, { size: 12 }) }), _jsx("button", { onClick: nextImage, "aria-label": "next image", className: "absolute top-1/2 right-1 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white", children: _jsx(ChevronRight, { size: 12 }) })] }))] })), _jsxs("div", { className: "flex-1 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsx("h3", { className: "text-sm md:text-base font-semibold text-[#EDEDED] truncate", children: name }), _jsxs("p", { className: "text-[11px] text-[#BDBDBD]", children: ["Unit: $", price.toFixed(2)] })] }), _jsx("div", { className: "text-[#C9A24D] font-semibold text-sm md:text-base ml-3 min-w-[55px] text-right", children: formattedPrice })] }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => handleUpdateQuantity(-1), "aria-label": "decrease quantity", disabled: updating || loading || quantity <= minQuantity, className: "w-6 h-6 flex items-center justify-center rounded-full bg-[#2A2A2A] hover:bg-[#B08B3E]/40 transition", children: _jsx(Minus, { size: 12 }) }), _jsx("span", { className: "w-6 text-center text-[#EDEDED] font-medium text-sm", children: quantity }), _jsx("button", { onClick: () => handleUpdateQuantity(1), "aria-label": "increase quantity", disabled: updating || loading || quantity >= maxQuantity, className: "w-6 h-6 flex items-center justify-center rounded-full bg-[#2A2A2A] hover:bg-[#B08B3E]/40 transition", children: _jsx(Plus, { size: 12 }) })] }), _jsx("button", { onClick: handleRemoveItem, "aria-label": "remove item", disabled: updating || loading, className: "ml-auto w-7 h-7 flex items-center justify-center rounded-full bg-red-600/20 hover:bg-red-600 transition", children: _jsx(Trash2, { size: 14 }) })] })] })] }));
}
