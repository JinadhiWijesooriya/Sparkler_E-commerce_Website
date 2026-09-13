"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SecondaryButton, Section } from "./CheckoutInputs";
import OrderSummary from "./OrderSummary";
import { useCart } from "../../../context/useCart";
// -------------------------
// Component
// -------------------------
export default function PaymentStep({ shippingInfo, invoiceConsent, setInvoiceConsent, onBack, }) {
    const { items, checkout, getCartSubtotal, getCountrySettings, getCartTotal } = useCart();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    // -------------------------
    // Totals
    // -------------------------
    const subtotal = getCartSubtotal();
    const { shipping_cost, tax_rate, } = getCountrySettings(shippingInfo.country);
    const tax = subtotal * tax_rate;
    // const vat = subtotal * vat_rate;
    const total = getCartTotal(shippingInfo.country);
    // -------------------------
    // Handle Checkout
    // -------------------------
    const handleConfirm = async () => {
        if (!invoiceConsent) {
            alert("Please accept invoice & customs declaration.");
            return;
        }
        if (items.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        setLoading(true);
        try {
            const orderData = {
                full_name: shippingInfo.name,
                email: shippingInfo.email,
                phone: shippingInfo.phone || "",
                address_1: shippingInfo.address,
                address_2: shippingInfo.address2 || "",
                city: shippingInfo.city,
                state: shippingInfo.state || "",
                country: shippingInfo.country,
                postal_code: shippingInfo.postalCode || "",
                payment_method: paymentMethod,
            };
            // Call checkout API
            const res = await checkout(orderData);
            if (res?.checkout_url) {
                // Redirect to Stripe Checkout session
                window.location.href = res.checkout_url;
            }
            else {
                alert("Payment session could not be established. Please try again.");
            }
        }
        catch (err) {
            console.error("Order failed:", err);
            alert("Order failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    // -------------------------
    // Render
    // -------------------------
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Section, { title: "Payment Method", children: _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { onClick: () => setPaymentMethod("card"), className: `cursor-pointer rounded-xl border p-5 text-center flex flex-col items-center justify-center gap-2 transition-all duration-200 ${paymentMethod === "card"
                                ? "border-[#C9A24D] bg-[#C9A24D]/10 text-[#E0B85E] shadow-[0_0_15px_rgba(201,162,77,0.2)]"
                                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10"}`, children: [_jsx("span", { className: "font-medium", children: "\uD83D\uDCB3 Credit / Debit Card" }), _jsx("span", { className: "text-xs opacity-70", children: "Secured by Stripe Payments" })] }), _jsxs("div", { onClick: () => setPaymentMethod("cod"), className: `cursor-pointer rounded-xl border p-5 text-center flex flex-col items-center justify-center gap-2 transition-all duration-200 ${paymentMethod === "cod"
                                ? "border-[#C9A24D] bg-[#C9A24D]/10 text-[#E0B85E] shadow-[0_0_15px_rgba(201,162,77,0.2)]"
                                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10"}`, children: [_jsx("span", { className: "font-medium", children: "\uD83D\uDCB5 Cash on Delivery" }), _jsx("span", { className: "text-xs opacity-70", children: "Pay when your order arrives" })] })] }) }), _jsx(OrderSummary, { cartItems: items, country: shippingInfo.country, shipping_cost: shipping_cost, tax: tax, 
                // vat={vat}
                total: total }), _jsxs("label", { className: "flex gap-2 text-xs", children: [_jsx("input", { type: "checkbox", checked: invoiceConsent, onChange: () => setInvoiceConsent((v) => !v), className: "accent-[#C9A24D]" }), "I agree to invoice & customs declaration"] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsxs(SecondaryButton, { onClick: onBack, children: [_jsx(ArrowLeft, { size: 14 }), " Back"] }), _jsx(SecondaryButton, { onClick: handleConfirm, disabled: !invoiceConsent || loading || items.length === 0, children: loading ? "Processing..." : "Confirm & Pay" })] })] }));
}
