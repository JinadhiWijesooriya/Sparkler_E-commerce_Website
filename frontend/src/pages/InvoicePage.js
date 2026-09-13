"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { CartAPI } from "../api/cartApi";
// ------------------------- HELPER -------------------------
const parseOrderData = (data, fallbackItems = []) => ({
    ...data,
    address_2: data.address_2 ?? undefined,
    postal_code: data.postal_code ?? undefined,
    discount: data.discount ?? undefined,
    cart: {
        ...data.cart,
        items: data.cart?.items?.length
            ? data.cart.items.map((item) => ({
                ...item,
                metal: item.metal ?? undefined,
                gem: item.gem ?? undefined,
                variant: item.variant ?? undefined,
                image: item.image ?? undefined,
            }))
            : fallbackItems, // fallback to last cart items
    },
});
// ------------------------- COMPONENT -------------------------
export default function InvoicePage() {
    const { order_id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
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
                const fallbackItems = JSON.parse(localStorage.getItem("lastOrderCart") || "[]");
                setOrder(parseOrderData(data, fallbackItems));
            }
            catch (err) {
                console.error("Failed to load invoice", err);
                alert("Failed to fetch invoice. Redirecting to cart.");
                navigate("/cart");
            }
            finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [order_id, navigate]);
    // ------------------------- PDF GENERATION -------------------------
    const generatePDF = async () => {
        if (!order)
            return;
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
        const logo = await new Promise((resolve, reject) => {
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
            const itemDesc = `${item.name}${item.metal ? " | " + item.metal : ""}${item.gem ? " | " + item.gem : ""}${item.variant ? " | " + item.variant : ""}`;
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
        }
        else {
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
        return (_jsx("div", { className: "min-h-screen bg-black flex items-center justify-center text-[#C9A24D] text-xl", children: "Loading invoice\u2026" }));
    }
    if (!order) {
        return (_jsx("div", { className: "min-h-screen bg-black flex items-center justify-center text-red-500", children: "Invoice not found" }));
    }
    // ------------------------- CALCULATE TOTALS FOR JSX -------------------------
    const items = order.cart?.items ?? [];
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const shipping = order.shipping_cost ?? 0;
    const tax = order.tax ?? subtotal * 0.07;
    const discount = order.discount ?? 0;
    const total = order.total ?? subtotal + shipping + tax - discount;
    return (_jsx("div", { className: "min-h-screen bg-black flex justify-center px-4 py-12", children: _jsxs("div", { className: "relative max-w-5xl w-full rounded-3xl overflow-hidden border border-[#C9A24D]/30 shadow-[0_30px_80px_rgba(201,162,77,0.35)]\n                      bg-black bg-[url('/logo/JewelryLogo.png')] bg-cover bg-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/70" }), _jsxs("div", { className: "relative z-10 p-10 space-y-8 text-white", children: [_jsxs("div", { className: "flex justify-between border-b border-[#C9A24D]/30 pb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold text-[#C9A24D]", children: "Invoice" }), _jsxs("p", { className: "opacity-80 mt-1", children: ["#", order.order_id] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { children: new Date(order.created_at).toLocaleDateString() }), _jsx("p", { className: "text-[#C9A24D] font-semibold", children: order.payment_method?.toLowerCase() === "cod" && order.status.toLowerCase() !== "paid" ? "Not Paid" : order.status })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-[#C9A24D] font-semibold mb-2", children: "Billing To" }), _jsx("p", { children: order.full_name }), _jsx("p", { children: order.address_1 }), order.address_2 && _jsx("p", { children: order.address_2 }), _jsx("p", { children: order.city }), order.state && _jsx("p", { children: order.state }), _jsx("p", { children: order.country?.name }), order.postal_code && _jsxs("p", { children: ["Postal Code: ", order.postal_code] }), _jsx("p", { className: "opacity-80 mt-1", children: order.email }), order.phone && _jsx("p", { children: order.phone })] }), _jsxs("div", { className: "text-right", children: [_jsx("h2", { className: "text-[#C9A24D] font-semibold mb-2", children: "Totals" }), _jsxs("p", { children: ["Subtotal: LKR.", subtotal.toFixed(2)] }), discount > 0 && _jsxs("p", { children: ["Discount: LKR.", discount.toFixed(2)] }), _jsxs("p", { children: ["Shipping: LKR.", shipping.toFixed(2)] }), _jsxs("p", { children: ["Tax: LKR.", tax.toFixed(2)] }), _jsxs("p", { className: "text-2xl font-bold text-[#C9A24D] mt-2", children: ["TOTAL: LKR.", total.toFixed(2)] })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-[#C9A24D] border-b border-[#C9A24D]/30", children: [_jsx("th", { className: "py-3 text-left", children: "Item" }), _jsx("th", { className: "py-3 text-center", children: "Qty" }), _jsx("th", { className: "py-3 text-center", children: "Price" }), _jsx("th", { className: "py-3 text-center", children: "Total" })] }) }), _jsx("tbody", { children: items.length > 0 ? (items.map((item) => (_jsxs("tr", { className: "border-b border-white/10", children: [_jsxs("td", { className: "py-3", children: [item.name, item.metal && ` | ${item.metal}`, item.gem && ` | ${item.gem}`, item.variant && ` | ${item.variant}`] }), _jsx("td", { className: "text-center", children: item.quantity }), _jsxs("td", { className: "text-center", children: ["LKR.", item.price.toFixed(2)] }), _jsxs("td", { className: "text-center font-semibold", children: ["LKR.", item.total_price.toFixed(2)] })] }, item.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "text-center py-4 text-red-500", children: "No items found in this order." }) })) })] }) }), _jsx("button", { onClick: generatePDF, className: "w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] text-black font-bold text-lg hover:scale-[1.03] transition", children: "Download Invoice PDF" })] })] }) }));
}
