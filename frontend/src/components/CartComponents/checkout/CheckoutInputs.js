import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// -------------------------
// Section Component
// -------------------------
export const Section = ({ title, children, }) => (_jsxs("section", { className: "space-y-3", children: [_jsx("h2", { className: "text-sm font-semibold text-[#EDEDED]", children: title }), children] }));
// -------------------------
// Grid Component
// -------------------------
export const Grid = ({ children }) => (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: children }));
export const Input = ({ error, ...props }) => (_jsxs("div", { className: "flex flex-col w-full", children: [_jsx("input", { ...props, className: `w-full px-3 py-2.5 rounded-lg bg-[#0E0E0E]
               border ${error ? "border-red-500" : "border-[#C9A24D]/30"} 
               text-sm text-[#EDEDED]
               placeholder:text-[#777]
               focus:outline-none focus:ring-2 focus:ring-[#C9A24D]/40 transition` }), error && _jsx("span", { className: "text-xs text-red-500 mt-1", children: error })] }));
export const Select = ({ error, children, ...props }) => (_jsxs("div", { className: "flex flex-col w-full", children: [_jsx("select", { ...props, className: `w-full px-3 py-2.5 rounded-lg bg-[#0E0E0E]
               border ${error ? "border-red-500" : "border-[#C9A24D]/30"} 
               text-sm text-[#EDEDED]
               focus:outline-none focus:ring-2 focus:ring-[#C9A24D]/40 transition`, children: children }), error && _jsx("span", { className: "text-xs text-red-500 mt-1", children: error })] }));
// -------------------------
// Primary Button
// -------------------------
export const PrimaryButton = (props) => (_jsx("button", { ...props, className: "w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2\n               bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] text-[#1A1A1A] disabled:opacity-50", children: props.children }));
// -------------------------
// Secondary Button
// -------------------------
export const SecondaryButton = (props) => (_jsx("button", { ...props, className: "w-full py-3 rounded-xl border border-[#C9A24D]/30 text-[#C9A24D]\n               flex items-center justify-center gap-2", children: props.children }));
