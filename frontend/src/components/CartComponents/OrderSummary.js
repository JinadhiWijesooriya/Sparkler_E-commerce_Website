"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../hooks/useAuth";
export default function OrderSummary({ onCheckout = () => { } }) {
    const { items, updateCartItem, getCartSubtotal, removeCartItem } = useCart();
    const { user } = useAuth();
    const [loadingId, setLoadingId] = useState(null);
    const subtotal = getCartSubtotal();
    const handleQuantity = async (id, change) => {
        const item = items.find((i) => i.id === id);
        if (!item)
            return;
        const newQty = item.quantity + change;
        if (newQty < 1)
            return;
        setLoadingId(id);
        try {
            await updateCartItem(id, newQty);
        }
        finally {
            setLoadingId(null);
        }
    };
    const handleRemove = async (id) => {
        setLoadingId(id);
        try {
            await removeCartItem(id);
        }
        finally {
            setLoadingId(null);
        }
    };
    const handleCheckoutClick = () => {
        if (!user)
            return alert("Please log in to proceed to checkout.");
        onCheckout();
    };
    return (_jsxs("div", { className: "bg-[#0B0B0B] rounded-3xl shadow-2xl p-5 border border-[#C9A24D]/30 w-full max-w-lg flex flex-col", children: [_jsx("h2", { className: "text-2xl font-bold text-[#C9A24D] mb-4", children: "Order Summary" }), _jsx("div", { className: "space-y-4", children: items.length > 0 ? (items.map((item) => (_jsxs("div", { className: "grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-[#C9A24D]/20 pb-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-medium text-[#EDEDED] truncate", children: item.name }), _jsxs("p", { className: "text-xs text-[#BDBDBD]", children: ["LKR ", item.price.toFixed(2), " each"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => handleQuantity(item.id, -1), "aria-label": "qut", disabled: loadingId === item.id, className: "w-7 h-7 flex items-center justify-center rounded-full border border-[#C9A24D]/50 hover:bg-[#B08B3E]/30 disabled:opacity-50", children: _jsx(Minus, { size: 12 }) }), _jsx("span", { className: "w-6 text-center text-[#EDEDED] font-medium", children: item.quantity }), _jsx("button", { onClick: () => handleQuantity(item.id, 1), "aria-label": "qut", disabled: loadingId === item.id, className: "w-7 h-7 flex items-center justify-center rounded-full border border-[#C9A24D]/50 hover:bg-[#B08B3E]/30 disabled:opacity-50", children: _jsx(Plus, { size: 12 }) }), _jsx("button", { onClick: () => handleRemove(item.id), "aria-label": "remove", disabled: loadingId === item.id, className: "ml-2 w-7 h-7 flex items-center justify-center rounded-full border border-red-500 hover:bg-red-600/20 disabled:opacity-50", children: _jsx(Trash2, { size: 12 }) })] }), _jsxs("div", { className: "text-[#C9A24D] font-semibold whitespace-nowrap", children: ["LKR ", (item.price * item.quantity).toFixed(2)] })] }, item.id)))) : (_jsx("p", { className: "text-center text-[#BDBDBD] text-sm py-6", children: "Your cart is empty." })) }), _jsxs("div", { className: "border-t border-[#C9A24D]/20 mt-4 pt-4 space-y-3", children: [_jsxs("div", { className: "flex justify-between text-[#BDBDBD]", children: [_jsx("span", { children: "Subtotal" }), _jsxs("span", { children: ["LKR ", subtotal.toFixed(2)] })] }), items.length > 0 && (_jsx("div", { className: "p-3 bg-[#141414] rounded-lg border border-[#C9A24D]/30 text-sm text-[#BDBDBD]", children: "\u26A0\uFE0F Taxes, VAT, and shipping costs will be calculated at checkout." })), _jsxs("div", { className: "flex justify-between text-lg font-bold text-[#C9A24D]", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["LKR ", subtotal.toFixed(2)] })] }), _jsx("button", { onClick: handleCheckoutClick, disabled: !user, className: `w-full py-4 rounded-xl font-semibold shadow-lg transition ${user
                            ? "bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A]"
                            : "bg-gray-600 text-gray-300 cursor-not-allowed"}`, children: "Proceed to Checkout" })] })] }));
}
