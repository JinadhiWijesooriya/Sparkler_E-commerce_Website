"use client";

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
  const [orderId, setOrderId] = useState<string | undefined>();

  const handleCheckout = (newOrderId: string) => {
    setOrderId(newOrderId);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#EDEDED] overflow-x-hidden">
      <CartHero />

      <div className="px-4 sm:px-6 md:px-16 py-12 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            Loading cart items...
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400 py-20">
            Your cart is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
   <AnimatePresence>
  {items.map((item) => (
    <CartItemCard
      key={item.id}
      cartItemId={item.id}
      name={item.name}
      price={item.price}
      quantity={item.quantity}
      product_images={item.product_images} // Already an array
    />
  ))}
</AnimatePresence>
            </div>

            {/* Order Summary */}
            <OrderSummary onCheckout={() => setIsCheckoutOpen(true)} />
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
  isOpen={isCheckoutOpen}
  onClose={() => setIsCheckoutOpen(false)}
  onOrderPlaced={handleCheckout} 
/>

      {/* Order Tracker */}
      {orderId && (
        <div className="fixed bottom-5 right-5 w-[360px] z-50">
          <OrderTracker orderId={orderId} />
        </div>
      )}
    </div>
  );
}
