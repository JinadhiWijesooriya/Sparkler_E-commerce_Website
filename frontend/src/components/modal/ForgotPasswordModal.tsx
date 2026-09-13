"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { forgotPassword } from "../../api/accountsApi";
import axios, { AxiosError } from "axios";

interface ForgotPasswordModalProps {
  onClose: () => void;
}

interface ErrorResponse {
  detail?: string;
  message?: string;
}

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await forgotPassword({ email });
      setSuccess(res.message || "Password reset link sent successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        const msg =
          axiosErr.response?.data?.detail ||
          axiosErr.response?.data?.message ||
          "Failed to send reset link. Try again.";
        setError(msg);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md bg-[#1A1A1A] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden relative border border-[#C9A24D]/40"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#111111] px-8 py-6 text-center rounded-t-3xl border-b border-[#C9A24D]/30 relative overflow-hidden">
        <h1 className="text-3xl font-bold text-[#C9A24D] tracking-widest drop-shadow-md animate-pulse">
          SPARKLER
        </h1>
        <p className="mt-2 text-sm text-[#EDEDED]/80">Reset Your Password</p>
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C9A24D] via-[#B08B3E] to-[#C9A24D] rounded-t-3xl"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Body */}
      <div className="px-8 py-10 space-y-6">
        {error && <div className="text-center text-sm text-red-500">{error}</div>}
        {success && <div className="text-center text-sm text-green-500">{success}</div>}

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#EDEDED]/90 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-2xl border border-[#BDBDBD]/30 bg-[#111111] text-[#EDEDED] placeholder-[#BDBDBD] focus:outline-none focus:ring-2 focus:ring-[#C9A24D] transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#C9A24D] text-[#1A1A1A] font-semibold text-lg hover:bg-[#B08B3E] shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center text-sm text-[#BDBDBD]">
          Remember your password?{" "}
          <button
            onClick={onClose}
            className="text-[#C9A24D] font-medium hover:underline hover:text-[#B08B3E] transition-colors duration-300"
          >
            Back to Sign In
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[#C9A24D] text-2xl font-bold hover:text-[#B08B3E] transition-colors duration-300"
      >
        &times;
      </button>
    </motion.div>
  );
}
