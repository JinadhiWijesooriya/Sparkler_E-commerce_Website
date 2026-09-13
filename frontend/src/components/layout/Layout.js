"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TopBar from "./Topbar";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutModal from "../CartComponents/CheckoutModal";
import { getAuctions } from "../../api/auctionsApi";
export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [showBidModal, setShowBidModal] = useState(false);
    useEffect(() => {
        // If the customer is already on the bidding page, do not show popup
        if (location.pathname === "/bid") {
            setShowBidModal(false);
            return;
        }
        // If the customer dismissed the popup during this session, do not show again
        if (sessionStorage.getItem("bid_popup_dismissed") === "true") {
            return;
        }
        const checkAuctions = async () => {
            try {
                const auctions = await getAuctions();
                // Only show if there is at least one active auction with time remaining
                const hasOpenBid = auctions.some((item) => item.is_active !== false && (item.time_left ?? 0) > 0);
                if (hasOpenBid) {
                    setShowBidModal(true);
                }
                else {
                    setShowBidModal(false);
                }
            }
            catch (err) {
                console.error("Failed to fetch auctions for notify", err);
            }
        };
        checkAuctions();
    }, [location.pathname]);
    const handleDismiss = () => {
        sessionStorage.setItem("bid_popup_dismissed", "true");
        setShowBidModal(false);
    };
    const handleGoToBid = () => {
        sessionStorage.setItem("bid_popup_dismissed", "true");
        setShowBidModal(false);
        navigate("/bid");
    };
    return (_jsxs(_Fragment, { children: [_jsx(TopBar, {}), _jsx(Navbar, {}), _jsx("main", { className: "min-h-screen", children: children }), _jsx(Footer, {}), _jsx(CheckoutModal, { isOpen: checkoutOpen, onClose: () => setCheckoutOpen(false), onOrderPlaced: (orderId) => navigate(`/invoice/${orderId}`) }), _jsx(AnimatePresence, { children: showBidModal && (_jsxs(motion.div, { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: handleDismiss }), _jsx(motion.div, { className: "relative w-full max-w-md bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#C9A24D]/40 p-6 sm:p-8", initial: { scale: 0.9, y: 30 }, animate: { scale: 1, y: 0 }, exit: { scale: 0.9, y: 30 }, children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-serif font-extrabold text-[#C9A24D] mb-4 drop-shadow-md", children: "\uD83C\uDF89 Bid is Opening!" }), _jsx("p", { className: "text-[#BDBDBD] text-base mb-8", children: "Get ready! New luxury items are currently on auction and waiting for your bids." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx("button", { onClick: handleDismiss, className: "px-6 py-2 rounded-full border border-[#C9A24D] text-[#C9A24D] hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition text-sm font-semibold", children: "Maybe Later" }), _jsx("button", { onClick: handleGoToBid, className: "px-6 py-2 rounded-full bg-[#C9A24D] text-[#1A1A1A] hover:bg-[#B08B3E] transition text-sm font-semibold shadow-lg shadow-[#C9A24D]/20", children: "Check Auctions Now" })] })] }) })] })) })] }));
}
