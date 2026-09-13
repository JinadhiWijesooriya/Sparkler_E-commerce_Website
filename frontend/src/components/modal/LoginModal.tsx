"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import SignUpModal from "./SignUpModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface LoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const { login } = useAuth()!;
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle between SignUp & ForgotPassword modals
  if (showSignUp) return <SignUpModal onClose={() => setShowSignUp(false)} onSuccess={onSuccess} />;
  if (showForgot) return <ForgotPasswordModal onClose={() => setShowForgot(false)} />;

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
        <p className="mt-2 text-sm text-[#EDEDED]/80">Authentic Sri Lankan Gems & Jewelry</p>
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C9A24D] via-[#B08B3E] to-[#C9A24D]"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Body */}
      <div className="px-8 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#EDEDED]">Welcome Back</h2>
          <p className="text-sm text-[#BDBDBD] mt-1">Sign in to manage your account</p>
        </div>

        {error && <div className="text-center text-sm text-red-500">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#EDEDED]/90 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-2xl border bg-[#111111] text-[#EDEDED]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EDEDED]/90 mb-2">Password</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-2xl border bg-[#111111] text-[#EDEDED]"
            />
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-[#C9A24D]">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#C9A24D] text-[#1A1A1A] font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-[#BDBDBD]">
          Don’t have an account?{" "}
          <button onClick={() => setShowSignUp(true)} className="text-[#C9A24D]">
            Create one
          </button>
        </div>
      </div>

      <button onClick={onClose} className="absolute top-4 right-4 text-[#C9A24D] text-2xl">
        &times;
      </button>
    </motion.div>
  );
}
