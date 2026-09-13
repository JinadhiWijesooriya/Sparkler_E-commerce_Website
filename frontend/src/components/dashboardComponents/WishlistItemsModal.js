"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Modal from "../ui/Modal";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
// Sample wishlist items
const wishlistSample = [
    { id: 1, name: "Diamond Ring", price: 1200, image: "/products/diamond-ring.jpg" },
    { id: 2, name: "Gold Necklace", price: 850, image: "/products/gold-necklace.jpg" },
    { id: 3, name: "Emerald Earrings", price: 950, image: "/products/emerald-earrings.jpg" },
];
export default function WishlistItemsModal({ isOpen, onClose }) {
    const [wishlistItems, setWishlistItems] = useState(wishlistSample);
    const removeItem = (id) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: "Your Wishlist", children: _jsxs("div", { className: "space-y-6 text-[#EDEDED]", children: [wishlistItems.length === 0 && (_jsx("p", { className: "text-center text-[#BDBDBD] py-12 text-lg", children: "Your wishlist is empty." })), wishlistItems.length > 0 && (_jsx("div", { className: "space-y-4 max-h-96 overflow-y-auto", children: wishlistItems.map(item => (_jsxs("div", { className: "flex items-center p-4 bg-[#1F1F1F] rounded-2xl border border-[#C9A24D]/20 shadow-md hover:shadow-lg transition cursor-pointer", children: [_jsx("img", { src: item.image, alt: item.name, className: "w-16 h-16 rounded-xl object-cover border border-[#C9A24D]/30 shadow-sm mr-4" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-[#EDEDED] font-semibold text-lg", children: item.name }), _jsxs("p", { className: "text-[#BDBDBD] mt-1", children: ["$", item.price] })] }), _jsx("button", { onClick: () => removeItem(item.id), title: `Remove ${item.name}`, className: "ml-4 p-3 rounded-lg bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] transition shadow-md", children: _jsx(FaTrashAlt, {}) })] }, item.id))) })), wishlistItems.length > 0 && (_jsx("div", { className: "flex justify-end mt-6", children: _jsx("button", { onClick: onClose, className: "px-6 py-3 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-lg font-semibold transition shadow-md", children: "Close" }) }))] }) }));
}
