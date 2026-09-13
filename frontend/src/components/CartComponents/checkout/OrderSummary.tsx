"use client";

import type { CartItemType } from "../../../api/cartApi";
import { Section } from "./CheckoutInputs";

interface OrderSummaryProps {
  cartItems: CartItemType[];
  country?: string;
  shipping_cost?: number; // optional
  tax?: number;           // optional
  vat?: number;           // optional
  total?: number;         // optional
}

export default function OrderSummary({
  cartItems,
  country,
  shipping_cost,
  tax,
  total,
}: OrderSummaryProps) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Section title="Order Summary">
      <div className="space-y-2">
        {cartItems.map((item, idx) => {
          // Use the first product image if available
          const imageUrl = item.product_images?.[0]?.image;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl ${
                idx % 2 === 0 ? "bg-[#1A1A1A]" : "bg-[#141414]"
              }`}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover border border-[#C9A24D]/30"
                />
              )}

              <div className="flex-1 flex flex-col">
                <span className="text-sm font-semibold text-[#EDEDED] truncate">
                  {item.name}
                </span>
                <span className="text-xs text-[#BDBDBD]">
                  {item.quantity} × ${item.price.toFixed(2)}
                </span>
              </div>

              <div className="text-sm font-semibold text-[#C9A24D]">
                LKR.{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#C9A24D]/20 pt-4 space-y-2 mt-4">
        <div className="flex justify-between text-sm text-[#EDEDED]">
          <span>Subtotal</span>
          <span>LKR.{subtotal.toFixed(2)}</span>
        </div>

        {shipping_cost !== undefined && (
          <div className="flex justify-between text-sm text-[#EDEDED]">
            <span>Shipping {country && `(LKR.{country})`}</span>
            <span>LKR.{shipping_cost.toFixed(2)}</span>
          </div>
        )}

        {tax !== undefined && (
          <div className="flex justify-between text-sm text-[#EDEDED]">
            <span>Tax</span>
            <span>LKR.{tax.toFixed(2)}</span>
          </div>
        )}

        {/* {vat !== undefined && vat > 0 && (
          <div className="flex justify-between text-sm text-[#EDEDED]">
            <span>VAT</span>
            <span>${vat.toFixed(2)}</span>
          </div>
        )} */}

        {total !== undefined && (
          <div className="flex justify-between text-lg font-bold text-[#C9A24D] border-t border-[#C9A24D]/40 pt-2">
            <span>Total</span>
            <span>LKR.{total.toFixed(2)}</span>
          </div>
        )}
      </div>
    </Section>
  );
}
 