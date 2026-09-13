"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaBoxOpen, FaCog, FaTruck } from "react-icons/fa";
import { motion } from "framer-motion";
import TotalOrdersModal from "../components/dashboardComponents/TotalOrdersModal";
import PendingDeliveriesModal from "../components/dashboardComponents/PendingDeliveriesModal";
import AccountSettingsModal from "../components/dashboardComponents/AccountSettingsModal";
import TrackOrderModal from "../components/dashboardComponents/TrackOrderModal";
import { getHomepageData } from "../api/homeApi";
import { CartAPI } from "../api/cartApi";
export default function Dashboard() {
    const [openModal, setOpenModal] = useState(null);
    const [advertisement, setAdvertisement] = useState(null);
    // Real counts for cards
    const [totalOrders, setTotalOrders] = useState(0);
    const [pendingDeliveries, setPendingDeliveries] = useState(0);
    const [inTransit, setInTransit] = useState(0);
    // ---------------- FETCH ADVERTISEMENT ----------------
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const data = await getHomepageData();
                const activeAds = data.ads?.filter(ad => ad.is_active);
                if (activeAds && activeAds.length > 0)
                    setAdvertisement(activeAds[0]);
            }
            catch (error) {
                console.error("Error fetching advertisements:", error);
            }
        };
        fetchAds();
    }, []);
    // ---------------- FETCH ORDERS ----------------
    useEffect(() => {
        const fetchOrderCounts = async () => {
            try {
                const allOrders = await CartAPI.getAllOrders();
                const pendingOrders = await CartAPI.getPendingOrders();
                setTotalOrders(allOrders.length);
                setPendingDeliveries(pendingOrders.length);
                setInTransit(allOrders.filter(order => order.status === "in_transit").length);
            }
            catch (error) {
                console.error("Error fetching order data:", error);
            }
        };
        fetchOrderCounts();
    }, []);
    // ---------------- DATA ----------------
    const stats = [
        { label: "Total Orders", value: totalOrders, icon: _jsx(FaShoppingCart, {}), modal: "totalOrders", color: "from-[#C9A24D] to-[#B08B3E]" },
        { label: "Pending Deliveries", value: pendingDeliveries, icon: _jsx(FaBoxOpen, {}), modal: "pendingDeliveries", color: "from-[#C9A24D] to-[#B08B3E]" },
        { label: "In Transit", value: inTransit, icon: _jsx(FaTruck, {}), modal: "pendingDeliveries", color: "from-[#C9A24D] to-[#B08B3E]" },
    ];
    const quickActions = [
        { label: "Account Settings", icon: _jsx(FaCog, {}), modal: "accountSettings", color: "from-[#C9A24D] to-[#B08B3E]" },
        { label: "Track Order", icon: _jsx(FaCog, {}), modal: "TrackOrders", color: "from-[#C9A24D] to-[#B08B3E]" },
    ];
    // ---------------- ANIMATIONS ----------------
    const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
    const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } };
    return (_jsxs("section", { className: "min-h-screen bg-[#1A1A1A] text-[#EDEDED] px-4 sm:px-6 md:px-12 py-12 sm:py-16 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-[#C9A24D]/20 to-[#B08B3E]/20 rounded-full blur-3xl animate-pulse-slow" }), _jsx("div", { className: "absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-[#C9A24D]/10 to-[#B08B3E]/10 rounded-full blur-3xl animate-pulse-slow" }), _jsxs(motion.div, { className: "max-w-7xl mx-auto mb-12 text-center relative z-10", initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [_jsx("h1", { className: "text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] bg-clip-text text-transparent drop-shadow-lg", children: "Welcome Back, Sparkler" }), _jsx("p", { className: "text-[#BDBDBD] text-lg md:text-xl mt-2", children: "Manage your premium jewelry orders and deliveries with ease." })] }), _jsxs("div", { className: "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10", children: [_jsxs("div", { className: "lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsx(motion.div, { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", variants: staggerContainer, initial: "hidden", animate: "visible", children: stats.map((stat, i) => (_jsxs(motion.div, { variants: fadeInUp, whileHover: { scale: 1.06, boxShadow: "0 25px 60px rgba(201,162,77,0.4)" }, className: "p-6 rounded-3xl bg-[#1F1F1F]/70 backdrop-blur-md border border-[#C9A24D]/30 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[180px] hover:shadow-lg", onClick: () => setOpenModal(stat.modal), children: [_jsx("div", { className: `w-16 h-16 mb-4 rounded-full flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br ${stat.color} text-[#1A1A1A]`, children: stat.icon }), _jsx("h3", { className: "text-2xl font-bold text-[#C9A24D]", children: stat.value }), _jsx("p", { className: "text-[#BDBDBD] mt-1 text-center", children: stat.label })] }, i))) }), _jsx(motion.div, { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", variants: staggerContainer, initial: "hidden", animate: "visible", children: quickActions.map((action, i) => (_jsxs(motion.div, { variants: fadeInUp, whileHover: { scale: 1.05, boxShadow: "0 20px 50px rgba(201,162,77,0.3)" }, className: "p-6 rounded-3xl bg-[#1F1F1F]/70 backdrop-blur-md border border-[#C9A24D]/30 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[150px] hover:shadow-lg", onClick: () => setOpenModal(action.modal), children: [_jsx("div", { className: `w-16 h-16 mb-4 rounded-full flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br ${action.color} text-[#1A1A1A]`, children: action.icon }), _jsx("h3", { className: "text-lg font-semibold text-[#C9A24D] text-center", children: action.label })] }, i))) })] }), advertisement && (_jsxs(motion.div, { className: "lg:col-span-2 flex flex-col p-6 bg-[#1F1F1F] rounded-3xl border border-[#C9A24D]/30 shadow-2xl hover:shadow-3xl transition-all backdrop-blur-sm", style: { minHeight: "500px" }, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [_jsx("img", { src: advertisement.image, alt: advertisement.title, className: "w-full h-64 object-cover rounded-2xl mb-4 shadow-xl" }), _jsx("h3", { className: "text-2xl font-bold text-[#C9A24D] mb-2", children: advertisement.title }), _jsx("p", { className: "text-[#BDBDBD] flex-1", children: advertisement.description }), advertisement.link && (_jsx("a", { href: advertisement.link, target: "_blank", rel: "noopener noreferrer", className: "mt-6 inline-block px-6 py-3 bg-[#C9A24D] text-[#1A1A1A] rounded-full text-sm font-semibold hover:bg-[#B08B3E] transition-all shadow-lg", children: "Learn More" }))] }))] }), _jsx(TotalOrdersModal, { isOpen: openModal === "totalOrders", onClose: () => setOpenModal(null) }), _jsx(PendingDeliveriesModal, { isOpen: openModal === "pendingDeliveries", onClose: () => setOpenModal(null) }), _jsx(AccountSettingsModal, { isOpen: openModal === "accountSettings", onClose: () => setOpenModal(null) }), _jsx(TrackOrderModal, { isOpen: openModal === "TrackOrders", onClose: () => setOpenModal(null) })] }));
}
