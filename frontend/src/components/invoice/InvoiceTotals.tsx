import type { OrderType, CartItemType } from "../../api/cartApi";

interface Props {
  order: Partial<OrderType>; // allow partial because cart may be missing
}

export default function InvoiceTotals({ order }: Props) {
  // Subtotal: prefer backend subtotal, fallback to cart items
  const subtotal =
    order.subtotal ??
    order.cart?.items.reduce((sum: number, item: CartItemType) => sum + item.total_price, 0) ??
    0;

  // Shipping cost
  const shippingCost = order.shipping_cost ?? 0;

  // Tax and VAT
  const tax = order.tax ?? 0;
  const vat = order.vat ?? 0;

  // Total
  const total = order.total ?? subtotal + shippingCost + tax + vat;

  return (
    <div className="mt-8 flex justify-end">
      <div className="w-full max-w-sm space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        {vat > 0 && (
          <div className="flex justify-between">
            <span>VAT</span>
            <span>${vat.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-[#C9A24D]/40 pt-3 flex justify-between text-lg font-bold text-[#C9A24D]">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
