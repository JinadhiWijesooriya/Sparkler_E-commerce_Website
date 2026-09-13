"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Grid, Input, PrimaryButton, Section, Select } from "./CheckoutInputs";
import { useCart } from "../../../context/useCart";
// -------------------------
// Component
// -------------------------
export default function ShippingStep({ shippingInfo, setShippingInfo, onNext, }) {
    const { items, countries, getCartSubtotal, getCountrySettings, getCartTotal } = useCart();
    const [errors, setErrors] = useState({});
    // -------------------------
    // Input handler
    // -------------------------
    const handleChange = (key, value) => {
        setShippingInfo({ ...shippingInfo, [key]: value });
        if (errors[key])
            setErrors((e) => ({ ...e, [key]: "" }));
    };
    // -------------------------
    // Validation
    // -------------------------
    const validate = () => {
        const e = {};
        const required = [
            "name",
            "email",
            "address",
            "city",
            "country",
            "postalCode",
        ];
        required.forEach((f) => {
            if (!shippingInfo[f]?.trim())
                e[f] = "Required";
        });
        if (shippingInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
            e.email = "Invalid email";
        }
        if (shippingInfo.phone && !/^[0-9+\s()-]{7,15}$/.test(shippingInfo.phone)) {
            e.phone = "Invalid phone";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    // -------------------------
    // Totals (Preview Only)
    // -------------------------
    const subtotal = getCartSubtotal();
    const { shipping_cost, tax_rate, } = getCountrySettings(shippingInfo.country);
    const tax = subtotal * tax_rate;
    // const vat = subtotal * vat_rate;
    const total = getCartTotal(shippingInfo.country);
    // -------------------------
    // Next step
    // -------------------------
    const handleNext = () => {
        if (!validate() || items.length === 0)
            return;
        onNext(); // go to PaymentStep
    };
    // -------------------------
    // Render
    // -------------------------
    return (_jsxs(Section, { title: "Shipping Details", children: [_jsxs(Grid, { children: [_jsx(Input, { placeholder: "Full Name", value: shippingInfo.name, onChange: (e) => handleChange("name", e.target.value), error: errors.name }), _jsx(Input, { placeholder: "Email", type: "email", value: shippingInfo.email, onChange: (e) => handleChange("email", e.target.value), error: errors.email }), _jsx(Input, { placeholder: "Phone (optional)", value: shippingInfo.phone || "", onChange: (e) => handleChange("phone", e.target.value), error: errors.phone }), _jsx(Input, { placeholder: "City", value: shippingInfo.city, onChange: (e) => handleChange("city", e.target.value), error: errors.city })] }), _jsxs(Grid, { children: [_jsx(Input, { placeholder: "Address", value: shippingInfo.address, onChange: (e) => handleChange("address", e.target.value), error: errors.address }), _jsx(Input, { placeholder: "Address Line 2 (optional)", value: shippingInfo.address2 || "", onChange: (e) => handleChange("address2", e.target.value) })] }), _jsxs(Grid, { children: [_jsx(Input, { placeholder: "State / Province", value: shippingInfo.state || "", onChange: (e) => handleChange("state", e.target.value) }), _jsx(Input, { placeholder: "Postal Code", value: shippingInfo.postalCode, onChange: (e) => handleChange("postalCode", e.target.value), error: errors.postalCode })] }), _jsxs("label", { className: "flex flex-col text-sm mt-2", children: ["Country", _jsxs(Select, { value: shippingInfo.country, onChange: (e) => handleChange("country", e.target.value), error: errors.country, children: [_jsx("option", { value: "", children: "Select Country" }), countries.map((c) => (_jsx("option", { value: c.name, children: c.name }, c.id)))] })] }), _jsxs("div", { className: "border-t border-[#C9A24D]/20 pt-3 mt-4 space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Subtotal" }), _jsxs("span", { children: ["LKR.", subtotal.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Shipping" }), _jsxs("span", { children: ["LKR.", shipping_cost.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Tax" }), _jsxs("span", { children: ["LKR.", tax.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between font-bold text-[#C9A24D]", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["LKR.", total.toFixed(2)] })] })] }), _jsxs(PrimaryButton, { onClick: handleNext, disabled: items.length === 0, className: "mt-4", children: ["Continue to Payment ", _jsx(ArrowRight, { size: 16 })] })] }));
}
