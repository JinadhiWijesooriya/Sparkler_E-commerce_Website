"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaShoppingCart, FaGem, FaChevronDown } from "react-icons/fa";

import CurrencySwitcher from "../common/CurrencySwitcher";
import SearchBar from "../common/SearchBar";
import LoginModal from "../modal/LoginModal";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/useCart";

export default function TopBar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, logout, error } = useAuth();
  const { items } = useCart();

  const cartItemCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;

  /* ---------------- Disable scroll when modal open ---------------- */
  useEffect(() => {
    document.body.style.overflow = isLoginOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginOpen]);

  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    try {
      await logout(); // auto-refresh-safe
      setIsProfileOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  /* ---------------- Username shortener ---------------- */
  const displayName = (name?: string) => {
    if (!name) return "";
    return name.length > 10 ? name.slice(0, 10) + "…" : name;
  };

  return (
    <>
      <header className="relative z-[60] bg-[#1A1A1A] border-b border-[#C9A24D]/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 relative">

            {/* ---------------- Brand ---------------- */}
            <div
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-2 cursor-pointer flex-shrink-0 group"
            >
              <FaGem className="text-[#C9A24D] text-2xl group-hover:scale-110 transition-transform" />
              <span className="text-[#EDEDED] font-serif tracking-wide group-hover:text-[#C9A24D] text-sm sm:text-base md:text-lg whitespace-nowrap">
                Authentic Sri Lankan Gems
              </span>
            </div>

            {/* ---------------- Search Desktop ---------------- */}
            <div className="flex-1 hidden lg:block">
              <SearchBar />
            </div>

            {/* ---------------- Actions ---------------- */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">

              {/* Currency Switcher */}
              <CurrencySwitcher />

              {/* Auth / Profile */}
              {!user ? (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-[#C9A24D]/50 text-[#EDEDED] hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition flex-shrink-0"
                >
                  <FaUser />
                  <span className="hidden sm:inline">Login</span>
                </button>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-[#C9A24D]/50 text-[#EDEDED] hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition flex-shrink-0 whitespace-nowrap">
                    <FaUser />
                    <span className="hidden sm:inline max-w-[120px] truncate">
                      {displayName(user.name)}
                    </span>
                    <FaChevronDown className="text-sm" />
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-40 bg-[#1A1A1A] border border-[#C9A24D]/40 rounded-lg shadow-lg overflow-hidden z-50"
                      >
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            window.location.href = "/dashboard";
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Cart */}
              <button
                onClick={() => (window.location.href = "/cart")}
                className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-[#C9A24D]/50 text-[#EDEDED] hover:bg-[#C9A24D] hover:text-[#1A1A1A] transition flex-shrink-0 group"
              >
                <FaShoppingCart className="text-lg" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1A1A1A] group-hover:border-[#C9A24D] transition-colors">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ---------------- Search Mobile ---------------- */}
          <div className="mt-3 lg:hidden relative z-10">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* ---------------- Login Modal ---------------- */}
      <AnimatePresence>
        {isLoginOpen && !user && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsLoginOpen(false)}
            />

            {/* Modal */}
            <LoginModal
              onClose={() => setIsLoginOpen(false)}
              onSuccess={() => setIsLoginOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- Optional Error Display ---------------- */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {error}
        </div>
      )}
    </>
  );
}
