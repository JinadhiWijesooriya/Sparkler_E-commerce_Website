import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function InvoiceTotals({ order }) {
    // Subtotal: prefer backend subtotal, fallback to cart items
    const subtotal = order.subtotal ??
        order.cart?.items.reduce((sum, item) => sum + item.total_price, 0) ??
        0;
    // Shipping cost
    const shippingCost = order.shipping_cost ?? 0;
    // Tax and VAT
    const tax = order.tax ?? 0;
    const vat = order.vat ?? 0;
    // Total
    const total = order.total ?? subtotal + shippingCost + tax + vat;
    return (_jsx("div", { className: "mt-8 flex justify-end", children: _jsxs("div", { className: "w-full max-w-sm space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Subtotal" }), _jsxs("span", { children: ["$", subtotal.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Shipping" }), _jsxs("span", { children: ["$", shippingCost.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Tax" }), _jsxs("span", { children: ["$", tax.toFixed(2)] })] }), vat > 0 && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "VAT" }), _jsxs("span", { children: ["$", vat.toFixed(2)] })] })), _jsxs("div", { className: "border-t border-[#C9A24D]/40 pt-3 flex justify-between text-lg font-bold text-[#C9A24D]", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["$", total.toFixed(2)] })] })] }) }));
}
