"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { mapFiltersToBackend } from "../../api/shopSetsApi";
export default function ProductFilters({ target = "shopSet", onApply, }) {
    const [priceSort, setPriceSort] = useState("low-high");
    const [gem, setGem] = useState();
    const [metal, setMetal] = useState();
    const [availability, setAvailability] = useState();
    const [origin, setOrigin] = useState();
    const [shape, setShape] = useState();
    const [carat, setCarat] = useState();
    const [priceGte, setPriceGte] = useState();
    const [priceLte, setPriceLte] = useState();
    const applyFilters = () => {
        if (target === "shopSet") {
            // Map frontend values to backend-compatible ShopSet query params
            const filters = mapFiltersToBackend({
                gem,
                metal,
                availability,
                ordering: priceSort === "low-high" ? "price" : "-price",
                carat,
                price_gte: priceGte,
                price_lte: priceLte,
            });
            onApply(filters);
            return;
        }
        if (target === "gem") {
            const filters = {
                gem_type: gem,
                origin: origin,
                shape: shape,
                // Add other mappings if needed, like weight_carat or price
            };
            onApply(filters);
            return;
        }
        // Product target...
        const filters = {
            ordering: priceSort === "low-high" ? "price" : "-price",
            gem,
            metal,
            availability: availability === undefined
                ? undefined
                : availability === "in_stock"
                    ? true
                    : false,
            ...(carat ? { carat } : {}),
            ...(priceGte ? { price_gte: priceGte } : {}),
            ...(priceLte ? { price_lte: priceLte } : {}),
        };
        onApply(filters);
    };
    const inputClass = "w-full p-3 rounded-xl bg-[#2A2A2A] text-white border border-[#444] " +
        "focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D] outline-none transition";
    return (_jsxs(motion.div, { initial: { opacity: 0, y: -12 }, animate: { opacity: 1, y: 0 }, className: "bg-[#1A1A1A]/70 backdrop-blur-md p-6 rounded-3xl border border-[#C9A24D]/40", children: [_jsx("h3", { className: "text-[#C9A24D] font-bold text-2xl mb-6 text-center", children: "Filter Products" }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { htmlFor: "priceGte", className: "block mb-1 text-sm text-gray-300", children: "Min Price (LKR)" }), _jsx("input", { id: "priceGte", type: "number", min: 0, step: 0.01, value: priceGte ?? "", onChange: (e) => setPriceGte(e.target.value ? Number(e.target.value) : undefined), className: inputClass })] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { htmlFor: "priceLte", className: "block mb-1 text-sm text-gray-300", children: "Max Price (LKR)" }), _jsx("input", { id: "priceLte", type: "number", min: 0, step: 0.01, value: priceLte ?? "", onChange: (e) => setPriceLte(e.target.value ? Number(e.target.value) : undefined), className: inputClass })] })] }), _jsx("label", { htmlFor: "priceSort", className: "block mt-4 mb-1 text-sm text-gray-300", children: "Sort By Price" }), _jsxs("select", { id: "priceSort", value: priceSort, onChange: (e) => setPriceSort(e.target.value), className: inputClass, children: [_jsx("option", { value: "low-high", children: "Low \u2192 High" }), _jsx("option", { value: "high-low", children: "High \u2192 Low" })] }), _jsx("label", { htmlFor: "gem", className: "block mt-4 mb-1 text-sm text-gray-300", children: "Gem" }), _jsxs("select", { id: "gem", value: gem ?? "", onChange: (e) => setGem(e.target.value === ""
                    ? undefined
                    : e.target.value), className: inputClass, children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "Diamond", children: "Diamond" }), _jsx("option", { value: "Ruby", children: "Ruby" }), _jsx("option", { value: "Emerald", children: "Emerald" }), _jsx("option", { value: "Sapphire", children: "Sapphire" })] }), _jsx("label", { htmlFor: "metal", className: "block mt-4 mb-1 text-sm text-gray-300", children: "Metal" }), _jsxs("select", { id: "metal", value: metal ?? "", onChange: (e) => setMetal(e.target.value === ""
                    ? undefined
                    : e.target.value), className: inputClass, children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "Gold", children: "Gold" }), _jsx("option", { value: "Silver", children: "Silver" }), _jsx("option", { value: "Platinum", children: "Platinum" })] }), _jsx("label", { htmlFor: "carat", className: "block mt-4 mb-1 text-sm text-gray-300", children: "Carat Weight" }), _jsx("input", { id: "carat", type: "number", step: "0.01", min: "0", placeholder: "e.g. 1.25", value: carat ?? "", onChange: (e) => setCarat(e.target.value ? Number(e.target.value) : undefined), className: inputClass }), _jsx("label", { htmlFor: "origin", className: "block mt-4 mb-1 text-sm text-gray-300", children: "Origin" }), _jsxs("select", { id: "origin", value: origin ?? "", onChange: (e) => setOrigin(e.target.value === "" ? undefined : e.target.value), className: inputClass, children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "Ceylon", children: "Ceylon" }), _jsx("option", { value: "Madagascar", children: "Madagascar" }), _jsx("option", { value: "Burma", children: "Burma" }), _jsx("option", { value: "Mozambique", children: "Mozambique" }), _jsx("option", { value: "Colombia", children: "Colombia" })] }), _jsx("label", { htmlFor: "shape", className: "block mt-4 mb-1 text-sm text-gray-300", children: "Shape" }), _jsxs("select", { id: "shape", value: shape ?? "", onChange: (e) => setShape(e.target.value === "" ? undefined : e.target.value), className: inputClass, children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "Oval", children: "Oval" }), _jsx("option", { value: "Cushion", children: "Cushion" }), _jsx("option", { value: "Round", children: "Round" }), _jsx("option", { value: "Emerald Cut", children: "Emerald Cut" }), _jsx("option", { value: "Pear", children: "Pear" }), _jsx("option", { value: "Heart", children: "Heart" })] }), _jsx("label", { htmlFor: "availability", className: "block mt-4 mb-1 text-sm text-gray-300", children: "Availability" }), _jsxs("select", { id: "availability", value: availability ?? "", onChange: (e) => setAvailability(e.target.value === ""
                    ? undefined
                    : e.target.value), className: inputClass, children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "in_stock", children: "In Stock" }), _jsx("option", { value: "out_of_stock", children: "Out of Stock" })] }), _jsx(motion.button, { whileHover: { scale: 1.03 }, whileTap: { scale: 0.96 }, onClick: applyFilters, className: "w-full mt-6 bg-[#C9A24D] py-3 rounded-xl font-bold text-black hover:bg-[#D4AF5A]", children: "Apply Filters" })] }));
}
