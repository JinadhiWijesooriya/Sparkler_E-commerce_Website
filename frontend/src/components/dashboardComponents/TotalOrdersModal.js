"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { CartAPI } from "../../api/cartApi";
export default function TotalOrdersModal({ isOpen, onClose }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Fetch all orders from the backend
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await CartAPI.getAllOrders();
            setOrders(data);
        }
        catch (err) {
            console.error(err);
            setError("Failed to fetch orders.");
        }
        finally {
            setLoading(false);
        }
    };
    // Fetch orders whenever modal opens
    useEffect(() => {
        if (isOpen) {
            fetchOrders();
        }
    }, [isOpen]);
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: "Total Orders", children: _jsxs("div", { className: "space-y-4 text-[#EDEDED]", children: [loading ? (_jsx("p", { className: "text-center text-[#BDBDBD] py-6", children: "Loading orders..." })) : error ? (_jsx("p", { className: "text-center text-red-500 py-6", children: error })) : orders.length === 0 ? (_jsx("p", { className: "text-center text-[#BDBDBD] py-6", children: "You have no orders yet." })) : (_jsx("div", { className: "space-y-3 max-h-80 overflow-y-auto", children: orders.map(order => (_jsxs("div", { className: "flex justify-between items-center p-4 bg-[#1F1F1F] rounded-2xl border border-[#C9A24D]/20 shadow-md hover:shadow-lg transition cursor-pointer", children: [_jsxs("div", { children: [_jsxs("h4", { className: "font-semibold text-[#C9A24D] text-lg", children: ["Order #", order.order_id] }), _jsxs("p", { className: "text-[#BDBDBD] text-sm", children: ["Amount: $", order.total.toFixed(2)] }), order.full_name && (_jsxs("p", { className: "text-[#BDBDBD] text-sm", children: ["Name: ", order.full_name] }))] }), _jsx("span", { className: `px-3 py-1 rounded-full font-semibold text-sm ${order.status.toLowerCase() === "delivered"
                                    ? "bg-[#B08B3E]/20 text-[#B08B3E]"
                                    : order.status.toLowerCase() === "pending"
                                        ? "bg-[#C9A24D]/20 text-[#C9A24D]"
                                        : "bg-[#C9A24D]/10 text-[#C9A24D]"}`, children: order.status })] }, order.order_id))) })), _jsx("div", { className: "flex justify-end mt-4", children: _jsx("button", { onClick: onClose, className: "px-6 py-2 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-lg font-semibold transition", children: "Close" }) })] }) }));
}
