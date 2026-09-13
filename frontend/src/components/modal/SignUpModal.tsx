"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

interface SignUpModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SignUpModal({ onClose, onSuccess }: SignUpModalProps) {
  const { signup } = useAuth()!;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup(email, password, name || "", phone || "");
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to register. Try again.");
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
      className="w-full max-w-md bg-[#1A1A1A] rounded-3xl shadow-lg overflow-hidden relative border border-[#C9A24D]/40"
    >
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#111111] px-8 py-6 text-center rounded-t-3xl border-b border-[#C9A24D]/30 relative">
        <h1 className="text-3xl font-bold text-[#C9A24D] tracking-widest drop-shadow-md animate-pulse">
          SPARKLER
        </h1>
        <p className="mt-2 text-sm text-[#EDEDED]/80">Create your account</p>
      </div>

      <div className="px-8 py-10 space-y-6">
        {error && <div className="text-center text-sm text-red-500">{error}</div>}

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#EDEDED]/90 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border bg-[#111111] text-[#EDEDED]"
            />
          </div>

          <div>
  <label className="block text-sm font-medium text-[#EDEDED]/90 mb-2">
    Phone Number
  </label>
  <input
    type="tel"
    placeholder="+94 77 123 4567"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    required
    className="w-full px-5 py-3 rounded-2xl border bg-[#111111] text-[#EDEDED]"
  />
</div>

          <div>
            <label className="block text-sm font-medium text-[#EDEDED]/90 mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-2xl border bg-[#111111] text-[#EDEDED]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#C9A24D] text-[#1A1A1A] font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-sm text-[#BDBDBD] mt-2">
          Already have an account?{" "}
          <button onClick={onClose} className="text-[#C9A24D]">
            Sign In
          </button>
        </div>
      </div>

      <button onClick={onClose} className="absolute top-4 right-4 text-[#C9A24D] text-2xl">
        &times;
      </button>
    </motion.div>
  );
}
