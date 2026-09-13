"use client";
import { jsx as _jsx } from "react/jsx-runtime";
const STEPS = [
    { id: 1, label: "Shipping" },
    { id: 2, label: "Payment" },
];
export default function StepIndicator({ step }) {
    return (_jsx("div", { className: "flex justify-center gap-3 py-4 text-xs", children: STEPS.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (_jsx("div", { className: `
              px-4 py-1 rounded-full font-medium transition-all
              ${isActive
                    ? "bg-[#C9A24D] text-[#1A1A1A]"
                    : isCompleted
                        ? "bg-[#2A2A2A] text-[#C9A24D] border border-[#C9A24D]/50"
                        : "border border-[#C9A24D]/30 text-[#BDBDBD]"}
            `, children: s.label }, s.id));
        }) }));
}
