import type { CartItemType } from "../../api/cartApi";

interface Props {
  items: CartItemType[];
}

export default function OrderItems({ items }: Props) {
  return (
    <div>
      {/* Table Header */}
      <div className="grid grid-cols-12 text-xs text-[#C9A24D] border-b pb-2 font-semibold">
        <span className="col-span-7">Item</span>
        <span className="col-span-2 text-center">Qty</span>
        <span className="col-span-3 text-right">Amount</span>
      </div>

      {/* Items */}
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-12 py-3 text-sm border-b border-[#2A2A2A] items-center"
        >
          <div className="col-span-7 flex items-center gap-3">
            {(item.image || item.product_images?.[0]?.image) && (
              <img
                src={item.image || item.product_images?.[0]?.image}
                alt={item.name}
                className="w-8 h-8 rounded border border-[#C9A24D]/30"
              />
            )}
            {item.name}
          </div>
          <span className="col-span-2 text-center">{item.quantity}</span>
          <span className="col-span-3 text-right">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}
