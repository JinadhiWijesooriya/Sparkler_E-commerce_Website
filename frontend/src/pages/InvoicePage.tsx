"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { CartAPI, type OrderType, type CartType, type CartItemType } from "../api/cartApi";

// ------------------------- EXTENDED TYPES -------------------------
interface CartItemTypeExtended extends CartItemType {
  metal?: string;
  gem?: string;
  variant?: string;
  image?: string;
}

interface CartTypeExtended extends Omit<CartType, "items"> {
  items: CartItemTypeExtended[];
}

interface OrderTypeExtended extends Omit<OrderType, "cart"> {
  address_2?: string;
  postal_code?: string;
  discount?: number;
  cart?: CartTypeExtended | null;
}

// ------------------------- HELPER -------------------------
const parseOrderData = (
  data: OrderType,
  fallbackItems: CartItemTypeExtended[] = []
): OrderTypeExtended => ({
  ...data,
  address_2: data.address_2 ?? undefined,
  postal_code: (data as Partial<{ postal_code: string }>).postal_code ?? undefined,
  discount: (data as Partial<{ discount: number }>).discount ?? undefined,
  cart: {
    ...data.cart,
    items: data.cart?.items?.length
      ? data.cart.items.map((item) => ({
        ...item,
        metal: (item as Partial<CartItemTypeExtended>).metal ?? undefined,
        gem: (item as Partial<CartItemTypeExtended>).gem ?? undefined,
        variant: (item as Partial<CartItemTypeExtended>).variant ?? undefined,
        image: (item as Partial<CartItemTypeExtended>).image ?? undefined,
      }))
      : fallbackItems, // fallback to last cart items
  } as CartTypeExtended,
});

// ------------------------- COMPONENT -------------------------
export default function InvoicePage() {
  const { order_id } = useParams<{ order_id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderTypeExtended | null>(null);
  const [loading, setLoading] = useState(true);

  // ------------------------- FETCH ORDER -------------------------
  useEffect(() => {
    if (!order_id) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await CartAPI.getOrder(order_id);
        console.log("Raw order data:", data);

        const isPaid = data.status.toLowerCase() === "paid";
        const isCOD = data.payment_method?.toLowerCase() === "cod";

        if (!isPaid && !isCOD) {
          alert("This order is not completed yet.");
          navigate("/cart");
          return;
        }

        // fallback items from localStorage (if backend cart is empty)
        const fallbackItems: CartItemTypeExtended[] = JSON.parse(
          localStorage.getItem("lastOrderCart") || "[]"
        );

        setOrder(parseOrderData(data, fallbackItems));
      } catch (err) {
        console.error("Failed to load invoice", err);
        alert("Failed to fetch invoice. Redirecting to cart.");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [order_id, navigate]);

  // ------------------------- PDF GENERATION -------------------------
  const generatePDF = async () => {
    if (!order) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 50;
    let y = 60;

    const items = order.cart?.items ?? [];
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const shipping = order.shipping_cost ?? 0;
    const tax = order.tax ?? subtotal * 0.07;
    const discount = order.discount ?? 0;
    const total = order.total ?? subtotal + shipping + tax - discount;

    // BLACK BACKGROUND
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");

    const logo = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = "/logo/JewelryLogo.png";
      img.onload = () => resolve(img);
      img.onerror = () => reject();
    }).catch(() => null);

    // TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor("#C9A24D");
    doc.text("INVOICE", pageWidth / 2, y, { align: "center" });
    y += 40;

    // ORDER INFO
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor("#FFFFFF");
    doc.text(`Invoice #: ${order.order_id}`, margin, y);
    const displayStatus = order.payment_method?.toLowerCase() === "cod" && order.status.toLowerCase() !== "paid" ? "Not Paid" : order.status;
    doc.text(`Status: ${displayStatus}`, pageWidth - margin, y, { align: "right" });
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, margin, y + 18);
    y += 50;

    // BILLING INFO
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#C9A24D");
    doc.text("BILLING TO", margin, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setTextColor("#FFFFFF");
    const billingText = `${order.full_name}
${order.address_1}${order.address_2 ? ", " + order.address_2 : ""}
${order.city}${order.state ? ", " + order.state : ""}
${order.country?.name ?? ""}${order.postal_code ? ", " + order.postal_code : ""}
${order.email} | ${order.phone || ""}`;
    const billingLines = billingText.split("\n");
    for (let i = 0; i < billingLines.length; i++) {
      doc.text(billingLines[i], margin, y);
      y += 14;
    }
    y += 30;

    // TABLE HEADER
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#C9A24D");
    doc.text("Item", margin, y);
    doc.text("Qty", pageWidth / 2 + 50, y, { align: "center" });
    doc.text("Price", pageWidth / 2 + 120, y, { align: "center" });
    doc.text("Total", pageWidth - margin - 20, y, { align: "center" });
    y += 12;
    doc.setDrawColor(201, 162, 77);
    doc.line(margin, y, pageWidth - margin, y);
    y += 22;

    // ITEMS
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#FFFFFF");
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const itemDesc = `${item.name}${item.metal ? " | " + item.metal : ""}${item.gem ? " | " + item.gem : ""
        }${item.variant ? " | " + item.variant : ""}`;
      doc.text(itemDesc, margin, y);
      doc.text(String(item.quantity), pageWidth / 2 + 50, y, { align: "center" });
      doc.text(`LKR.${item.price.toFixed(2)}`, pageWidth / 2 + 120, y, { align: "center" });
      doc.text(`LKR.${item.total_price.toFixed(2)}`, pageWidth - margin - 20, y, { align: "center" });
      y += 25;
    }

    y += 10;
    doc.setDrawColor(201, 162, 77);
    doc.line(pageWidth / 2, y, pageWidth - margin, y);
    y += 26;

    // TOTALS
    const totalsX = pageWidth / 2 + 50;
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#FFFFFF");
    doc.text(`Subtotal: LKR.${subtotal.toFixed(2)}`, totalsX, y);
    y += 26;
    if (discount > 0) {
      doc.text(`Discount: LKR.${discount.toFixed(2)}`, totalsX, y);
      y += 16;
    }
    doc.text(`Shipping: LKR.${shipping.toFixed(2)}`, totalsX, y);
    y += 16;
    doc.text(`Tax: LKR.${tax.toFixed(2)}`, totalsX, y);
    y += 24;
    doc.setFontSize(16);
    doc.text(`TOTAL: LKR.${total.toFixed(2)}`, totalsX, y);
    y += 40;

    // LOGO AT BOTTOM
    if (logo) {
      doc.addImage(logo, "PNG", pageWidth / 2 - 50, y, 100, 100);
      y += 130;
    } else {
      y += 60;
    }
    doc.setFont("times", "bold");
    doc.setFontSize(28);
    doc.setTextColor("#C9A24D");
    doc.text("S P A R K L E R", pageWidth / 2, y, { align: "center" });
    y += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("A U T H E N T I C   S R I   L A N K A N   G E M   A N D   J E W E L R Y", pageWidth / 2, y, { align: "center" });

    doc.save(`Invoice-${order.order_id}.pdf`);
  };

  // ------------------------- UI -------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#C9A24D] text-xl">
        Loading invoice…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
        Invoice not found
      </div>
    );
  }

  // ------------------------- CALCULATE TOTALS FOR JSX -------------------------
  const items = order.cart?.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
  const shipping = order.shipping_cost ?? 0;
  const tax = order.tax ?? subtotal * 0.07;
  const discount = order.discount ?? 0;
  const total = order.total ?? subtotal + shipping + tax - discount;

  return (
    <div className="min-h-screen bg-black flex justify-center px-4 py-12">
      <div
        className="relative max-w-5xl w-full rounded-3xl overflow-hidden border border-[#C9A24D]/30 shadow-[0_30px_80px_rgba(201,162,77,0.35)]
                      bg-black bg-[url('/logo/JewelryLogo.png')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 p-10 space-y-8 text-white">
          {/* Header */}
          <div className="flex justify-between border-b border-[#C9A24D]/30 pb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#C9A24D]">Invoice</h1>
              <p className="opacity-80 mt-1">#{order.order_id}</p>
            </div>
            <div className="text-right">
              <p>{new Date(order.created_at).toLocaleDateString()}</p>
              <p className="text-[#C9A24D] font-semibold">
                {order.payment_method?.toLowerCase() === "cod" && order.status.toLowerCase() !== "paid" ? "Not Paid" : order.status}
              </p>
            </div>
          </div>

          {/* Billing & Totals */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-[#C9A24D] font-semibold mb-2">Billing To</h2>
              <p>{order.full_name}</p>
              <p>{order.address_1}</p>
              {order.address_2 && <p>{order.address_2}</p>}
              <p>{order.city}</p>
              {order.state && <p>{order.state}</p>}
              <p>{order.country?.name}</p>
              {order.postal_code && <p>Postal Code: {order.postal_code}</p>}
              <p className="opacity-80 mt-1">{order.email}</p>
              {order.phone && <p>{order.phone}</p>}
            </div>
            <div className="text-right">
              <h2 className="text-[#C9A24D] font-semibold mb-2">Totals</h2>
              <p>Subtotal: LKR.{subtotal.toFixed(2)}</p>
              {discount > 0 && <p>Discount: LKR.{discount.toFixed(2)}</p>}
              <p>Shipping: LKR.{shipping.toFixed(2)}</p>
              <p>Tax: LKR.{tax.toFixed(2)}</p>
              <p className="text-2xl font-bold text-[#C9A24D] mt-2">TOTAL: LKR.{total.toFixed(2)}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[#C9A24D] border-b border-[#C9A24D]/30">
                  <th className="py-3 text-left">Item</th>
                  <th className="py-3 text-center">Qty</th>
                  <th className="py-3 text-center">Price</th>
                  <th className="py-3 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="border-b border-white/10">
                      <td className="py-3">
                        {item.name}
                        {item.metal && ` | ${item.metal}`}
                        {item.gem && ` | ${item.gem}`}
                        {item.variant && ` | ${item.variant}`}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">LKR.{item.price.toFixed(2)}</td>
                      <td className="text-center font-semibold">LKR.{item.total_price.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-red-500">
                      No items found in this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button
            onClick={generatePDF}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] text-black font-bold text-lg hover:scale-[1.03] transition"
          >
            Download Invoice PDF
          </button>
        </div>
      </div>
    </div>
  );
}
