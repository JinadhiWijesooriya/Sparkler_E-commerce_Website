"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import CartHero from "../components/CartComponents/CartHero";
import CartItemCard from "../components/CartComponents/CartItemCard";
import OrderSummary from "../components/CartComponents/OrderSummary";
import CheckoutModal from "../components/CartComponents/CheckoutModal";
import OrderTracker from "../components/CartComponents/OrderTracker";
import { useCart } from "../context/useCart";
export default function CartPage() {
    const { items, loading } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [orderId, setOrderId] = useState();
    const handleCheckout = (newOrderId) => {
        setOrderId(newOrderId);
        setIsCheckoutOpen(false);
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#1A1A1A] text-[#EDEDED] overflow-x-hidden", children: [_jsx(CartHero, {}), _jsx("div", { className: "px-4 sm:px-6 md:px-16 py-12 max-w-7xl mx-auto", children: loading ? (_jsx("div", { className: "flex justify-center items-center py-20 text-gray-400", children: "Loading cart items..." })) : items.length === 0 ? (_jsx("p", { className: "text-center text-gray-400 py-20", children: "Your cart is empty." })) : (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2 space-y-4", children: _jsx(AnimatePresence, { children: items.map((item) => (_jsx(CartItemCard, { cartItemId: item.id, name: item.name, price: item.price, quantity: item.quantity, product_images: item.product_images }, item.id))) }) }), _jsx(OrderSummary, { onCheckout: () => setIsCheckoutOpen(true) })] })) }), _jsx(CheckoutModal, { isOpen: isCheckoutOpen, onClose: () => setIsCheckoutOpen(false), onOrderPlaced: handleCheckout }), orderId && (_jsx("div", { className: "fixed bottom-5 right-5 w-[360px] z-50", children: _jsx(OrderTracker, { orderId: orderId }) }))] }));
}
