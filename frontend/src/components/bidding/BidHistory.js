"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { History, Award } from "lucide-react";
const formatLKR = (value) => `LKR ${value.toLocaleString("en-LK")}`;
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-LK", {
        hour: "2-digit",
        minute: "2-digit",
    });
};
export default function BidHistory({ bids, highlightLatest = false, winnerBid, onContactAdmin, }) {
    const latestBidRef = useRef(null);
    useEffect(() => {
        if (latestBidRef.current) {
            latestBidRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [bids]);
    return (_jsxs("div", { className: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden h-full flex flex-col", children: [_jsx("div", { className: "absolute top-0 right-0 p-8 opacity-5", children: _jsx(History, { className: "w-24 h-24 text-white" }) }), _jsxs("div", { className: "relative mb-6", children: [_jsxs("h3", { className: "text-xl font-bold text-white flex items-center gap-2", children: [_jsx(History, { className: "w-5 h-5 text-[#C9A24D]" }), "Bid History"] }), _jsx("p", { className: "text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1", children: "Real-time activity" })] }), _jsx("div", { className: "flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 min-h-[300px]", children: bids.length > 0 ? (_jsx(AnimatePresence, { initial: false, children: bids.map((bid, idx) => {
                        const isWinner = winnerBid &&
                            bid.user.email === winnerBid.user.email &&
                            bid.amount === winnerBid.amount;
                        const isLatest = highlightLatest && idx === 0 && !isWinner;
                        return (_jsx(motion.div, { ref: idx === 0 ? latestBidRef : null, initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: idx * 0.05 }, className: `group relative p-4 rounded-2xl border transition-all duration-300 ${isWinner
                                ? "bg-green-500/20 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                                : isLatest
                                    ? "bg-[#C9A24D]/10 border-[#C9A24D]/20 shadow-[0_0_20px_rgba(201,162,77,0.1)]"
                                    : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10"}`, children: _jsxs("div", { className: "flex justify-between items-center relative z-10", children: [_jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsx("span", { className: "text-xs font-bold text-white/90 truncate max-w-[120px]", children: bid.user.name || bid.user.email }), _jsx("span", { className: "text-[10px] text-white/30 font-medium", children: formatTime(bid.timestamp) })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: `text-sm font-black tracking-tight ${isWinner ? "text-green-400" : "text-[#C9A24D]"}`, children: formatLKR(bid.amount) }), isWinner && (_jsxs("span", { className: "text-[8px] font-black uppercase tracking-widest text-green-400/60 flex items-center justify-end gap-1", children: [_jsx(Award, { className: "w-2 h-2" }), " Winning Bid"] }))] })] }) }, `${bid.user.email}-${bid.timestamp}`));
                    }) })) : (_jsxs("div", { className: "h-full flex flex-col items-center justify-center py-12 opacity-20", children: [_jsx(History, { className: "w-12 h-12 mb-3" }), _jsx("p", { className: "text-sm font-medium", children: "Waiting for first bid..." })] })) }), winnerBid && onContactAdmin && (_jsx(motion.button, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, onClick: onContactAdmin, className: "mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2", children: "\uD83D\uDCF2 Finalize with Admin" }))] }));
}
