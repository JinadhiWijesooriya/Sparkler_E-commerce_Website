"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCurrency } from "../../context/CurrencyContext";
export default function CurrencySwitcher() {
    const { currency } = useCurrency();
    return (_jsxs("div", { className: "inline-flex items-center", children: [_jsx("span", { className: "mr-2 text-[10px] tracking-widest text-textSecondary uppercase", children: "Curr" }), _jsx("span", { className: "text-textPrimary text-xs font-medium px-3 py-1.5 rounded-full bg-charcoal border border-gold", children: currency })] }));
}
