"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Gavel, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import BidHistory from "../components/bidding/BidHistory";
import type { AuctionItemUI, BidHistoryBid } from "../api/auctionsApi";
import { getAuctions, placeBid as apiPlaceBid, getAuctionPageBackground } from "../api/auctionsApi";
import { getAccessToken } from "../api/accountsApi";
import { useNavigate } from "react-router-dom";

// --------------------
// UI Helpers
// --------------------
const formatLKR = (value: number) => `LKR ${value.toLocaleString("en-LK")}`;
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};



// ====================
// Bidding Page
// ====================
export default function BiddingPage() {
  const [items, setItems] = useState<AuctionItemUI[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [bidHistory, setBidHistory] = useState<Record<number, BidHistoryBid[]>>({});
  const [timeLeftMap, setTimeLeftMap] = useState<Record<number, number>>({});
  const [customBid, setCustomBid] = useState<number | "">("");
  const [error, setError] = useState("");
  const [pageBg, setPageBg] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Use dynamic user info
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const currentUserEmail = user?.email || "";
  const isAuthenticated = !!getAccessToken();

  // --------------------
  // Fetch Auctions + Background
  // --------------------
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctions = await getAuctions();
        if (!auctions.length) {
          console.warn("No auctions found from backend");
          setItems([]);
          return;
        }

        const bids: Record<number, BidHistoryBid[]> = {};
        const timeMap: Record<number, number> = {};
        auctions.forEach((item) => {
          bids[item.id] = item.bids || [];
          timeMap[item.id] = Math.max(item.time_left ?? 0, 0);
        });

        // Initialize state
        setItems(auctions);
        setBidHistory(bids);
        setTimeLeftMap(timeMap);

        // Select the first item based on our sorting criteria (Live first, then Newest ID)
        const sortedForDefault = [...auctions].sort((a, b) => {
          const aTime = timeMap[a.id] ?? 0;
          const bTime = timeMap[b.id] ?? 0;
          const aIsLive = aTime > 0;
          const bIsLive = bTime > 0;

          if (aIsLive && !bIsLive) return -1;
          if (!aIsLive && bIsLive) return 1;
          return b.id - a.id;
        });

        if (sortedForDefault.length > 0) {
          setSelectedItemId(sortedForDefault[0].id);
        }

        const bg = await getAuctionPageBackground();
        if (bg) setPageBg(bg);
      } catch (err) {
        console.error("Failed to fetch auctions", err);
      }
    };

    fetchAuctions();
  }, []);

  // --------------------
  // Countdown Timer
  // --------------------
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeftMap((prev) => {
        const updated: Record<number, number> = {};
        Object.entries(prev).forEach(([id, time]) => {
          updated[Number(id)] = Math.max(time - 1, 0);
        });
        return updated;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // --------------------
  // Selected Item & Hooks
  // --------------------
  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedItemId) || null,
    [items, selectedItemId]
  );

  const timeLeft = selectedItem ? timeLeftMap[selectedItem.id] ?? 0 : 0;

  const minNextBid = useMemo(() => {
    if (!selectedItem) return 0;
    const increment = Number(selectedItem.bid_increment || 500);
    const current = Number(selectedItem.current_bid);
    const start = Number(selectedItem.starting_price);

    if (current === 0) return start;
    return current + increment;
  }, [selectedItem]);

  const auctionStatus = useMemo(() => {
    if (!selectedItem) return { label: "Loading", color: "bg-gray-600" };
    if (timeLeft === 0) return { label: "Closed", color: "bg-red-600" };
    if (timeLeft <= 300) return { label: "Ending Soon", color: "bg-yellow-500" };
    return { label: "Live", color: "bg-green-600" };
  }, [selectedItem, timeLeft]);

  // --------------------
  // Sorted Items (Live first, then Newest IDs)
  // --------------------
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aTime = timeLeftMap[a.id] ?? 0;
      const bTime = timeLeftMap[b.id] ?? 0;

      const aIsLive = aTime > 0;
      const bIsLive = bTime > 0;

      // Group live auctions together
      if (aIsLive && !bIsLive) return -1;
      if (!aIsLive && bIsLive) return 1;

      // Within groups (both live or both closed), sort by ID descending (newest first)
      return b.id - a.id;
    });
  }, [items, timeLeftMap]);

  const winnerBid = selectedItem ? bidHistory[selectedItem.id]?.[0] : undefined;
  const isWinner = winnerBid?.user.email === currentUserEmail && timeLeft === 0;

  // --------------------
  // Place Bid
  // --------------------
  const placeBid = async () => {
    setError("");
    if (!selectedItem) return;

    if (!isAuthenticated) {
      setError("Please login to place a bid.");
      toast.error("Authentication required");
      navigate("/auth");
      return;
    }

    if (timeLeft === 0) {
      setError("Auction has ended.");
      return;
    }

    if (customBid === "" || Number(customBid) < minNextBid) {
      setError(`Bid must be at least ${formatLKR(minNextBid)}`);
      return;
    }

    if (selectedItem.ending_price && Number(customBid) > selectedItem.ending_price) {
      setError(`Bid cannot exceed ending price of ${formatLKR(selectedItem.ending_price)}`);
      return;
    }

    try {
      const newBid = await apiPlaceBid(selectedItem.id, Number(customBid));

      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, current_bid: newBid.amount } : item
        )
      );

      setBidHistory((prev) => ({
        ...prev,
        [selectedItem.id]: [newBid, ...(prev[selectedItem.id] || [])],
      }));

      toast.success(`Bid placed: ${formatLKR(newBid.amount)}`);
      setCustomBid("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as { response?: { status: number }; error?: string };
        if (errorObj.response?.status === 401) {
          setError("Your session has expired. Please login again.");
          toast.error("Session expired");
        } else if (errorObj.error) {
          setError(errorObj.error);
        } else {
          setError("Failed to place bid");
        }
      } else {
        setError("Failed to place bid");
      }
    }
  };

  // --------------------
  // Contact Admin Function
  // --------------------
  const contactAdmin = () => {
    if (!selectedItem || !winnerBid) return;

    const adminNumber = "94705696254"; // Sri Lanka number in international format
    const winnerName = winnerBid.user.name || winnerBid.user.email;

    const message = encodeURIComponent(
      `👋 Hi! My name is ${winnerName}.\n` +
      `🏆 I won the auction for "${selectedItem.name}".\n` +
      `💰 Winning Bid: ${formatLKR(selectedItem.current_bid)}\n` +
      `🖼 Product Image: ${selectedItem.image}\n` +
      `I would like to discuss payment or customize my winning product.`
    );

    const url = `https://wa.me/${adminNumber}?text=${message}`;
    window.open(url, "_blank");
  };

  if (!selectedItem) return <p className="p-6 text-white">Loading auctions…</p>;

  // ====================
  // Render
  // ====================
  return (
    <div
      className="relative min-h-screen bg-black bg-cover bg-center"
      style={{
        backgroundImage: pageBg ? `url(${pageBg})` : undefined,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/80 backdrop-blur-[2px]" />

      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Exclusive <span className="text-[#C9A24D]">Auctions</span>
            </h1>
            <p className="text-[#BDBDBD] mt-2 max-w-md">
              Discover unique high-value pieces and place your winning bid in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-sm font-medium text-white">
              {items.filter(i => timeLeftMap[i.id] > 0).length} Live Auctions
            </span>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar: Auction List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-4"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-[#C9A24D]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-[#C9A24D]" />
                Browse Items
              </h3>

              <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar">
                {sortedItems.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden group/item ${selectedItemId === item.id
                      ? "border-[#C9A24D] bg-[#C9A24D]/10 shadow-[0_0_20px_rgba(201,162,77,0.15)]"
                      : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className={`font-semibold truncate transition-colors ${selectedItemId === item.id ? "text-[#C9A24D]" : "text-white/80 group-hover/item:text-white"
                        }`}>
                        {item.name}
                      </p>
                      {timeLeftMap[item.id] > 0 && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-wider text-white/40">Current Bid</p>
                      <p className="text-xs font-bold text-[#C9A24D]">{formatLKR(item.current_bid)}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItemId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="grid gap-8 md:grid-cols-5"
              >
                {/* Details Section */}
                <div className="md:col-span-3 space-y-6">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                    <div className="aspect-[4/5] md:aspect-square relative overflow-hidden group">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* Floating Status Badges */}
                      <div className="absolute top-6 left-6 flex flex-col gap-3">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white shadow-xl flex items-center gap-2 backdrop-blur-md ${auctionStatus.color}`}>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          {auctionStatus.label}
                        </div>

                        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-white shadow-xl flex items-center gap-2">
                          <Timer className="w-4 h-4 text-[#C9A24D]" />
                          <span className="text-xs font-mono font-bold tracking-wider">{formatTime(timeLeft)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-6">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-bold text-white tracking-tight">{selectedItem.name}</h2>
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <span>Ref: AUCT-{selectedItem.id.toString().padStart(4, '0')}</span>
                          <span>•</span>
                          <span>Verified Piece</span>
                        </div>
                      </div>

                      <p className="text-white/60 leading-relaxed text-sm">
                        {selectedItem.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 p-5 rounded-3xl group hover:bg-white/10 transition-colors">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Starting Price</p>
                          <p className="text-xl font-bold text-white">{formatLKR(selectedItem.starting_price)}</p>
                        </div>
                        <div className="bg-[#C9A24D]/10 border border-[#C9A24D]/20 p-5 rounded-3xl group hover:bg-[#C9A24D]/20 transition-colors">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A24D]/60 mb-1">Minimum Next</p>
                          <p className="text-xl font-bold text-[#C9A24D]">{formatLKR(minNextBid)}</p>
                        </div>
                        {selectedItem.ending_price && (
                          <div className="bg-white/5 border border-white/5 p-5 rounded-3xl col-span-2 group hover:bg-white/10 transition-colors flex justify-between items-center">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Instant Buy/Ending Price</p>
                              <p className="text-xl font-bold text-white">{formatLKR(selectedItem.ending_price)}</p>
                            </div>
                            <ShieldCheck className="w-8 h-8 text-[#C9A24D]/30" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bidding Control Panel */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C9A24D]/10 rounded-full blur-[80px]" />

                    <h4 className="text-lg font-bold text-white mb-6">Place Your Bid</h4>

                    <div className="space-y-6">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <span className="text-white/30 font-bold group-focus-within:text-[#C9A24D] transition-colors">LKR</span>
                        </div>
                        <input
                          type="number"
                          min={minNextBid}
                          step={selectedItem.bid_increment}
                          value={customBid}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCustomBid(value === "" ? "" : Number(value));
                          }}
                          disabled={timeLeft === 0}
                          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D] outline-none transition-all placeholder:text-white/20"
                          placeholder={selectedItem.ending_price ? `${minNextBid} - ${selectedItem.ending_price}` : `Min ${minNextBid}`}
                        />
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-xs font-semibold text-red-400 bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20"
                        >
                          {error}
                        </motion.p>
                      )}

                      {!isWinner && (
                        <button
                          onClick={placeBid}
                          disabled={timeLeft === 0}
                          className="w-full bg-[#C9A24D] hover:bg-[#D4B263] disabled:bg-white/10 disabled:text-white/20 text-black font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all duration-300 transform active:scale-[0.98] shadow-[0_10px_30px_rgba(201,162,77,0.3)] flex items-center justify-center gap-2"
                        >
                          <Gavel className="w-5 h-5" />
                          Confirm Bid
                        </button>
                      )}

                      {isWinner && winnerBid && (
                        <div className="space-y-3">
                          <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl text-center">
                            <p className="text-green-400 font-bold text-sm tracking-wide">🎉 YOU WON THIS AUCTION!</p>
                            <p className="text-white/40 text-[10px] mt-1 italic">Successful bid: {formatLKR(selectedItem.current_bid)}</p>
                          </div>

                          <button
                            onClick={contactAdmin}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
                          >
                            📲 Contact Admin
                          </button>
                        </div>
                      )}

                      <div className="pt-4 border-t border-white/5">
                        <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl">
                          <ShieldCheck className="w-5 h-5 text-[#C9A24D] shrink-0" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-white/80">Premium Protection</p>
                            <p className="text-[10px] text-white/40 leading-relaxed">
                              Bids are final and verified by our curators. Secure transaction guaranteed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* High Performance Bid History Component */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] blur-[15px] opacity-10 group-hover:opacity-20 transition-opacity" />
                    <BidHistory
                      bids={bidHistory[selectedItem.id] || []}
                      highlightLatest
                      winnerBid={timeLeft === 0 ? winnerBid : undefined}
                      onContactAdmin={contactAdmin}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
