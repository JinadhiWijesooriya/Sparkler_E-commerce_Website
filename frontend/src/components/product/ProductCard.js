"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCart } from "../../context/useCart";
/* ---------------- HELPERS ---------------- */
const limitDescription = (desc, maxLength = 100) => !desc ? "" : desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;
/* ---------------- COMPONENT ---------------- */
export default function ProductCard({ product, maxDescriptionLength = 100, onClick, }) {
    const { addToCart } = useCart(); // context
    const [adding, setAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const images = Array.isArray(product.images)
        ? product.images.filter((img) => Boolean(img))
        : [];
    const firstImage = images[0] ?? "/placeholder.jpg";
    const [activeImage, setActiveImage] = useState(firstImage);
    /* ---------------- ADD TO CART ---------------- */
    const handleAddToCart = async () => {
        try {
            setAdding(true);
            await addToCart(product.id, product.product_type ?? "shop", // <-- fixed product_type
            quantity);
            toast.success(`${product.name} added to cart (${quantity})`);
            setQuantity(1);
        }
        catch (err) {
            toast.error("Failed to add to cart");
            console.error(err);
        }
        finally {
            setAdding(false);
        }
    };
    return (_jsxs(motion.div, { className: "bg-[#1A1A1A] border border-[#C9A24D]/30 rounded-3xl overflow-hidden cursor-pointer flex flex-col", whileHover: { scale: 1.03 }, onClick: () => onClick?.(product.id), children: [_jsxs("div", { className: "relative w-full", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.img, { src: activeImage, alt: product.name, className: "w-full h-64 object-cover", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }, activeImage) }), images.length > 1 && (_jsx("div", { className: "absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2", children: images.slice(0, 3).map((img, idx) => (_jsx("img", { src: img, alt: `thumbnail-${idx}`, onClick: (e) => {
                                e.stopPropagation();
                                setActiveImage(img);
                            }, className: `w-10 h-10 rounded-lg cursor-pointer border-2 object-cover ${activeImage === img ? "border-[#C9A24D]" : "border-transparent"}` }, idx))) }))] }), _jsxs("div", { className: "p-4 flex flex-col justify-between flex-1", children: [_jsx("h3", { className: "text-[#C9A24D] font-semibold", children: product.name }), _jsx("p", { className: "text-[#BDBDBD] text-sm mt-1", children: limitDescription(product.description, maxDescriptionLength) }), _jsxs("p", { className: "text-xl font-bold text-[#C9A24D] mt-2", children: ["LKR.", product.price] }), _jsxs("div", { className: "mt-2 flex items-center gap-2", children: [_jsx("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    setQuantity((q) => Math.max(1, q - 1));
                                }, className: "px-2 py-1 bg-[#0D0D0D] border border-[#C9A24D] rounded-lg", children: "-" }), _jsx("span", { className: "text-[#EDEDED] font-medium", children: quantity }), _jsx("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    setQuantity((q) => q + 1);
                                }, className: "px-2 py-1 bg-[#0D0D0D] border border-[#C9A24D] rounded-lg", children: "+" })] }), _jsx("button", { onClick: (e) => {
                            e.stopPropagation();
                            handleAddToCart();
                        }, disabled: adding, className: `mt-4 w-full bg-[#C9A24D] py-2 rounded-xl font-semibold transition-opacity ${adding ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`, children: adding ? "Adding..." : "Add to Cart" })] })] }));
}
