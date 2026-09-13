"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../hooks/useAuth";

interface OrderSummaryProps {
  onCheckout?: () => void;
}

export default function OrderSummary({ onCheckout = () => {} }: OrderSummaryProps) {
  const { items, updateCartItem, getCartSubtotal, removeCartItem } = useCart();
  const { user } = useAuth();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const subtotal = getCartSubtotal();

  const handleQuantity = async (id: number, change: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + change;
    if (newQty < 1) return;

    setLoadingId(id);
    try {
      await updateCartItem(id, newQty);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (id: number) => {
    setLoadingId(id);
    try {
      await removeCartItem(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) return alert("Please log in to proceed to checkout.");
    onCheckout();
  };

  return (
    <div className="bg-[#0B0B0B] rounded-3xl shadow-2xl p-5 border border-[#C9A24D]/30 w-full max-w-lg flex flex-col">
      <h2 className="text-2xl font-bold text-[#C9A24D] mb-4">Order Summary</h2>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-[#C9A24D]/20 pb-3"
            >
              {/* ITEM INFO */}
              <div className="min-w-0">
                <p className="font-medium text-[#EDEDED] truncate">{item.name}</p>
                <p className="text-xs text-[#BDBDBD]">
                  LKR {item.price.toFixed(2)} each
                </p>
              </div>

              {/* QUANTITY CONTROLS */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantity(item.id, -1)}
                  aria-label="qut"
                  disabled={loadingId === item.id}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-[#C9A24D]/50 hover:bg-[#B08B3E]/30 disabled:opacity-50"
                >
                  <Minus size={12} />
                </button>

                <span className="w-6 text-center text-[#EDEDED] font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() => handleQuantity(item.id, 1)}
                  aria-label="qut"
                  disabled={loadingId === item.id}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-[#C9A24D]/50 hover:bg-[#B08B3E]/30 disabled:opacity-50"
                >
                  <Plus size={12} />
                </button>

                <button
                  onClick={() => handleRemove(item.id)}
                  aria-label="remove"
                  disabled={loadingId === item.id}
                  className="ml-2 w-7 h-7 flex items-center justify-center rounded-full border border-red-500 hover:bg-red-600/20 disabled:opacity-50"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {/* TOTAL PRICE */}
              <div className="text-[#C9A24D] font-semibold whitespace-nowrap">
                LKR {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[#BDBDBD] text-sm py-6">Your cart is empty.</p>
        )}
      </div>

      {/* TOTAL SECTION */}
      <div className="border-t border-[#C9A24D]/20 mt-4 pt-4 space-y-3">
        <div className="flex justify-between text-[#BDBDBD]">
          <span>Subtotal</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>

        {items.length > 0 && (
          <div className="p-3 bg-[#141414] rounded-lg border border-[#C9A24D]/30 text-sm text-[#BDBDBD]">
            ⚠️ Taxes, VAT, and shipping costs will be calculated at checkout.
          </div>
        )}

        <div className="flex justify-between text-lg font-bold text-[#C9A24D]">
          <span>Total</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckoutClick}
          disabled={!user}
          className={`w-full py-4 rounded-xl font-semibold shadow-lg transition ${
            user
              ? "bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A]"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
