import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "../ui/Modal";
import { CartAPI } from "../../api/cartApi";
import axios, { AxiosError } from "axios";
export default function TrackOrderModal({ isOpen, onClose, }) {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const steps = [
        "pending",
        "processing",
        "shipped",
        "delivered",
    ];
    const handleTrack = async () => {
        if (!orderId.trim()) {
            setError("Please enter an Order ID");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const fetchedOrder = await CartAPI.getOrder(orderId.trim());
            setOrder(fetchedOrder);
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                const axiosError = err;
                setError(axiosError.response?.data?.error ?? "Order not found");
            }
            else if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError("Order not found");
            }
            setOrder(null);
        }
        finally {
            setLoading(false);
        }
    };
    const handleClose = () => {
        setOrderId("");
        setOrder(null);
        setError("");
        onClose();
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: handleClose, title: "Track Your Order", children: _jsxs("div", { className: "flex flex-col items-center space-y-6 px-4 sm:px-6 py-4", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-[#C9A24D] text-center drop-shadow-lg", children: "Track Your Order" }), _jsx("p", { className: "text-[#BDBDBD] text-center text-sm sm:text-base", children: "Enter your Order ID below to check the status of your precious gems." }), _jsxs("div", { className: "flex w-full max-w-md space-x-3", children: [_jsx("input", { type: "text", placeholder: "Enter Order ID", className: "flex-1 p-3 rounded-lg border border-[#B08B3E] bg-[#1F1F1F] text-[#EDEDED] placeholder-[#BDBDBD] focus:outline-none focus:ring-2 focus:ring-[#C9A24D] transition", value: orderId, onChange: (e) => setOrderId(e.target.value) }), _jsx("button", { onClick: handleTrack, disabled: loading, className: "px-6 py-3 rounded-lg bg-[#C9A24D] hover:bg-[#B08B3E] disabled:opacity-60 text-[#1A1A1A] font-semibold transition shadow-lg", children: loading ? "Tracking..." : "Track" })] }), error && _jsx("p", { className: "text-red-500 text-sm", children: error }), order && (_jsxs("div", { className: "w-full max-w-md mt-6 space-y-6", children: [steps.map((step, idx) => {
                            const statusIndex = steps.indexOf(order.status);
                            const isActive = idx <= statusIndex;
                            return (_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: idx * 0.15 }, className: `w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${isActive
                                            ? "bg-[#C9A24D] shadow-[0_0_15px_rgba(201,162,77,0.5)]"
                                            : "bg-gray-700"}`, children: isActive && (_jsx(motion.div, { animate: { scale: [1, 1.4, 1] }, transition: {
                                                repeat: Infinity,
                                                duration: 1.5,
                                                delay: idx * 0.2,
                                            }, className: "w-3 h-3 rounded-full bg-[#1A1A1A]" })) }), _jsxs("div", { className: "flex-1", children: [_jsx(motion.div, { initial: { width: 0 }, animate: { width: isActive ? "100%" : "0%" }, transition: { delay: idx * 0.15, duration: 0.5 }, className: `h-2 rounded-full ${isActive
                                                    ? "bg-[#C9A24D] shadow-[0_0_10px_rgba(201,162,77,0.3)]"
                                                    : "bg-gray-700"}` }), _jsx("p", { className: "text-[#EDEDED] font-medium mt-1 capitalize", children: step })] })] }, step));
                        }), _jsxs(motion.p, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8 }, className: "text-center text-[#BDBDBD] mt-4 text-sm sm:text-base", children: ["Current Status:", " ", _jsx("span", { className: "text-[#C9A24D] font-bold capitalize", children: order.status })] })] }))] }) }));
}
