import type { OrderType } from "../../api/cartApi";
import { useCart } from "../../context/useCart";

interface Props {
  order: OrderType;
}

export default function InvoiceHeader({ order }: Props) {
  const { getCountrySettings } = useCart();

  const countrySettings = getCountrySettings(order.country?.name);

  return (
    <>
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/logo/JewelryLogo.png" alt="SPARKLER Logo" className="h-16" />
      </div>

      {/* Header with Invoice title and Payment status */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-[#C9A24D]">Invoice</h1>
        <span
          className={`px-4 py-1 rounded-full text-xs font-semibold tracking-wide ${
            order.status === "PAID"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Invoice Details */}
      <div className="text-sm text-[#BDBDBD] space-y-1 mb-8">
        <p>
          <span className="text-white font-semibold">Invoice #:</span> {order.order_id}
        </p>
        <p>
          <span className="text-white font-semibold">Date:</span>{" "}
          {new Date(order.created_at).toLocaleDateString()}
        </p>
        <p>
          <span className="text-white font-semibold">Country:</span>{" "}
          {order.country?.name ?? "N/A"}
        </p>
        <p>
          <span className="text-white font-semibold">Subtotal:</span> ${order.subtotal.toFixed(2)}
        </p>
        <p>
          <span className="text-white font-semibold">Shipping:</span> $
          {countrySettings.shipping_cost.toFixed(2)}
        </p>
        <p>
          <span className="text-white font-semibold">Tax:</span> ${order.tax.toFixed(2)}
        </p>
        <p>
          <span className="text-white font-semibold">VAT:</span> ${order.vat.toFixed(2)}
        </p>
        <p className="text-white font-semibold text-lg">
          Total: ${order.total.toFixed(2)}
        </p>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-[#C9A24D]/30" />
    </>
  );
}
