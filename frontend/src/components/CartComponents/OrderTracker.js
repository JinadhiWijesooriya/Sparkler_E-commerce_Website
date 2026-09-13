"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { CartAPI } from "../../api/cartApi";
// Status steps
const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];
export default function OrderTracker({ orderId }) {
    const [order, setOrder] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Map order status to step index
    const getStepIndex = useCallback((status) => {
        const index = STATUS_STEPS.findIndex((s) => s.toLowerCase() === status.toLowerCase());
        return index >= 0 ? index : 0;
    }, []);
    // Fetch order from API
    const fetchOrder = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await CartAPI.getOrder(orderId);
            setOrder(data);
            setCurrentStep(getStepIndex(data.status));
        }
        catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    setError("Order not found.");
                }
                else {
                    setError("Failed to fetch order. Please try again.");
                }
            }
            else if (err instanceof Error) {
                setError("Failed to fetch order. Please try again.");
            }
            else {
                setError("An unexpected error occurred.");
            }
            setOrder(null);
            console.error("Failed to fetch order:", err);
        }
        finally {
            setLoading(false);
        }
    }, [orderId, getStepIndex]);
    // Polling every 10 seconds
    useEffect(() => {
        fetchOrder();
        const interval = setInterval(fetchOrder, 10000);
        return () => clearInterval(interval);
    }, [fetchOrder]);
    // Loading state
    if (loading) {
        return (_jsx("div", { className: "bg-[#1A1A1A] p-6 rounded-2xl shadow-2xl border border-[#C9A24D] text-[#BDBDBD]", children: "Loading order..." }));
    }
    // Error state
    if (error) {
        return (_jsx("div", { className: "bg-[#1A1A1A] p-6 rounded-2xl shadow-2xl border border-red-600 text-red-400", children: error }));
    }
    if (!order)
        return null;
    const cartItems = order.cart?.items || [];
    return (_jsxs("div", { className: "bg-[#1A1A1A] p-6 rounded-2xl shadow-2xl border border-[#C9A24D]", children: [_jsx("h2", { className: "text-xl font-bold text-[#C9A24D] mb-2", children: "Order Tracker" }), _jsxs("p", { className: "text-[#BDBDBD] mb-4", children: ["Order ID:", " ", _jsx("span", { className: "text-[#EDEDED] font-mono", children: order.order_id })] }), _jsx("div", { className: "relative flex justify-between items-center mb-6", children: STATUS_STEPS.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    return (_jsxs("div", { className: "flex-1 text-center relative", children: [index < STATUS_STEPS.length - 1 && (_jsx("div", { className: `absolute top-1/2 left-1/2 w-full h-1 -translate-x-1/2 rounded-full z-0 ${isCompleted
                                    ? "bg-gradient-to-r from-[#C9A24D] to-[#B08B3E]"
                                    : "bg-[#555555]"}` })), _jsx("div", { className: `mx-auto w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg z-10 relative ${isCompleted
                                    ? "bg-[#C9A24D] border-[#C9A24D] scale-110 transition-transform duration-500"
                                    : isActive
                                        ? "bg-[#B08B3E] border-[#C9A24D] animate-pulse scale-105 transition-transform duration-500"
                                        : "bg-[#1A1A1A] border-[#555555]"}`, children: isCompleted ? (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-[#1A1A1A]", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) : (_jsx("span", { className: "text-sm text-[#EDEDED] font-semibold", children: index + 1 })) }), _jsx("span", { className: `block mt-2 text-xs font-medium ${isCompleted || isActive ? "text-[#EDEDED]" : "text-[#BDBDBD]"}`, children: step })] }, step));
                }) }), cartItems.length > 0 && (_jsx("div", { className: "mb-6 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border border-[#555555] text-[#BDBDBD]", children: [_jsx("thead", { className: "bg-[#1F1F1F]", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 border-b border-[#555555]", children: "Product" }), _jsx("th", { className: "px-4 py-2 border-b border-[#555555]", children: "Quantity" }), _jsx("th", { className: "px-4 py-2 border-b border-[#555555]", children: "Price" }), _jsx("th", { className: "px-4 py-2 border-b border-[#555555]", children: "Total" })] }) }), _jsx("tbody", { children: cartItems.map((item) => (_jsxs("tr", { className: "hover:bg-[#2A2A2A]", children: [_jsx("td", { className: "px-4 py-2", children: item.name }), _jsx("td", { className: "px-4 py-2", children: item.quantity }), _jsxs("td", { className: "px-4 py-2", children: ["$", item.price.toFixed(2)] }), _jsxs("td", { className: "px-4 py-2", children: ["$", item.total_price.toFixed(2)] })] }, item.id))) })] }) })), _jsxs("div", { className: "text-[#BDBDBD] space-y-1 mb-6", children: [_jsxs("p", { children: [_jsx("strong", { children: "Full Name:" }), " ", order.full_name] }), _jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", order.email] }), order.phone && (_jsxs("p", { children: [_jsx("strong", { children: "Phone:" }), " ", order.phone] })), _jsxs("p", { children: [_jsx("strong", { children: "Address:" }), " ", order.address_1, " ", order.address_2 || "", ",", " ", order.city, ", ", order.state || "", ", ", order.country?.name || ""] }), _jsxs("p", { children: [_jsx("strong", { children: "Total:" }), " $", order.total.toFixed(2)] })] }), _jsx("div", { className: "mt-4 text-center", children: _jsx("button", { onClick: fetchOrder, className: "px-6 py-2 rounded-lg bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] hover:from-[#B08B3E] hover:to-[#C9A24D] text-[#1A1A1A] font-semibold text-sm transition-all duration-300 shadow-md", children: "Refresh Order Status" }) })] }));
}
