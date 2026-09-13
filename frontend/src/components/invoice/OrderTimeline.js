import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function OrderTimeline({ status }) {
    const steps = ["Placed", "Processing", "Shipped", "Delivered"];
    const current = steps.indexOf(status);
    return (_jsxs("div", { className: "mb-10", children: [_jsx("h3", { className: "text-sm uppercase text-[#C9A24D] mb-4 font-semibold", children: "Order Status" }), _jsx("div", { className: "flex justify-between relative", children: steps.map((step, idx) => (_jsxs("div", { className: "flex-1 text-center relative", children: [_jsx("div", { className: `w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${idx <= current ? "bg-[#C9A24D] text-black" : "bg-[#2A2A2A] text-[#777]"}`, children: idx + 1 }), _jsx("p", { className: "mt-2 text-xs text-[#BDBDBD]", children: step }), idx < steps.length - 1 && (_jsx("div", { className: `absolute top-3 left-1/2 w-full h-[2px] -translate-x-1/2 -z-10 ${idx < current ? "bg-[#C9A24D]" : "bg-[#2A2A2A]"}` }))] }, step))) })] }));
}
