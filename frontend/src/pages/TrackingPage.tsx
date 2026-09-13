"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AxiosError } from "axios";
import {
  Package,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  Gem,
} from "lucide-react";
import { CartAPI, type OrderType } from "../api/cartApi";

// ─────────────────────────────────────────────
// Status step definitions
// ─────────────────────────────────────────────
const STATUS_STEPS: { id: string; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: "pending",
    label: "Order Placed",
    description: "We've received your order",
    icon: <Package size={20} />,
  },
  {
    id: "processing",
    label: "Processing",
    description: "Your jewels are being prepared",
    icon: <Clock size={20} />,
  },
  {
    id: "shipped",
    label: "Shipped",
    description: "On the way to you",
    icon: <Truck size={20} />,
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "Enjoy your Sparkler jewels!",
    icon: <Home size={20} />,
  },
];

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    pending: 0,
    paid: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
  };
  return map[status.toLowerCase()] ?? 0;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function TrackingPage() {
  const { order_id } = useParams<{ order_id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchOrder = useCallback(
    async (silent = false) => {
      if (!order_id) return;
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);
      try {
        const data = await CartAPI.getOrder(order_id);
        setOrder(data);
        setLastUpdated(new Date());
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          setError("Order not found. Please check your Order ID.");
        } else {
          setError("Failed to load order. Please try again.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [order_id]
  );

  // Initial load + auto-refresh every 30 s
  useEffect(() => {
    fetchOrder();
    const interval = setInterval(() => fetchOrder(true), 30_000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  // ─── Loading skeleton ───────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-14 h-14 rounded-full border-4 border-[#C9A24D] border-t-transparent mx-auto"
          />
          <p className="text-[#C9A24D] font-semibold tracking-wider uppercase text-sm">
            Loading your order…
          </p>
        </div>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────
  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
            <Package size={36} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
          <p className="text-[#888]">{error ?? "This order does not exist."}</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] text-black font-semibold hover:opacity-90 transition"
          >
            Back to Home <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const cartItems = order.cart?.items ?? [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden border-b border-[#C9A24D]/20">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A24D' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#C9A24D]/10 border border-[#C9A24D]/30 text-[#C9A24D] text-sm font-medium">
            <Gem size={14} /> Sparkler Order Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Track Your Order</h1>
          <p className="text-[#888] mb-1 text-sm">Order ID</p>
          <p className="text-[#C9A24D] font-mono text-xl font-bold">{order.order_id}</p>

          {lastUpdated && (
            <p className="text-[#555] text-xs mt-3">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* ── Status Stepper ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#141414] rounded-2xl border border-[#C9A24D]/20 p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-[#C9A24D]">Delivery Status</h2>
            <button
              onClick={() => fetchOrder(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs text-[#888] hover:text-[#C9A24D] transition"
            >
              <motion.span
                animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={refreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
              >
                <RefreshCw size={13} />
              </motion.span>
              Refresh
            </button>
          </div>

          {/* Desktop stepper */}
          <div className="hidden sm:flex justify-between items-start relative">
            {/* Background line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#2a2a2a] rounded-full" />
            {/* Filled progress line */}
            <motion.div
              className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: currentStep / (STATUS_STEPS.length - 1) }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ width: "100%" }}
            />

            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              return (
                <div key={step.id} className="flex-1 flex flex-col items-center relative z-10">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    transition={{ duration: 0.4 }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-lg mb-3 ${
                      isCompleted
                        ? "bg-[#C9A24D] border-[#C9A24D] text-black"
                        : isActive
                        ? "bg-[#1a1a1a] border-[#C9A24D] text-[#C9A24D] shadow-[0_0_20px_rgba(201,162,77,0.4)]"
                        : "bg-[#1a1a1a] border-[#333] text-[#555]"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : step.icon}
                  </motion.div>
                  <span
                    className={`text-sm font-semibold ${
                      isCompleted || isActive ? "text-white" : "text-[#555]"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-[#555] mt-0.5 text-center">{step.description}</span>
                </div>
              );
            })}
          </div>

          {/* Mobile stepper */}
          <div className="sm:hidden space-y-4">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isCompleted
                          ? "bg-[#C9A24D] border-[#C9A24D] text-black"
                          : isActive
                          ? "bg-[#1a1a1a] border-[#C9A24D] text-[#C9A24D]"
                          : "bg-[#1a1a1a] border-[#333] text-[#555]"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={18} /> : step.icon}
                    </div>
                    {index < STATUS_STEPS.length - 1 && (
                      <div
                        className={`w-0.5 h-6 mt-1 rounded-full ${
                          isCompleted ? "bg-[#C9A24D]" : "bg-[#2a2a2a]"
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <p
                      className={`text-sm font-semibold ${
                        isCompleted || isActive ? "text-white" : "text-[#555]"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-[#555]">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Order info grid ── */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Delivery address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="bg-[#141414] rounded-2xl border border-[#C9A24D]/20 p-6"
          >
            <h3 className="flex items-center gap-2 text-[#C9A24D] font-semibold mb-4">
              <MapPin size={16} /> Delivery Address
            </h3>
            <div className="space-y-1 text-[#bbb] text-sm">
              <p className="text-white font-semibold text-base">{order.full_name}</p>
              <p>{order.address_1}</p>
              {order.address_2 && <p>{order.address_2}</p>}
              <p>
                {order.city}
                {order.state ? `, ${order.state}` : ""}
              </p>
              <p>{order.country?.name}</p>
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-[#141414] rounded-2xl border border-[#C9A24D]/20 p-6"
          >
            <h3 className="flex items-center gap-2 text-[#C9A24D] font-semibold mb-4">
              <Mail size={16} /> Contact Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-[#C9A24D] shrink-0" />
                <span className="text-[#bbb] break-all">{order.email}</span>
              </div>
              {order.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-[#C9A24D] shrink-0" />
                  <span className="text-[#bbb]">{order.phone}</span>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-5 border-t border-[#222] space-y-2 text-sm">
              <div className="flex justify-between text-[#888]">
                <span>Subtotal</span>
                <span>LKR {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Shipping</span>
                <span>LKR {order.shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Tax</span>
                <span>LKR {order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-[#222]">
                <span>Total</span>
                <span className="text-[#C9A24D]">LKR {order.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Items ── */}
        <AnimatePresence>
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="bg-[#141414] rounded-2xl border border-[#C9A24D]/20 p-6"
            >
              <h3 className="flex items-center gap-2 text-[#C9A24D] font-semibold mb-5">
                <Package size={16} /> Order Items
              </h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#C9A24D]/30 transition"
                  >
                    {/* Thumbnail */}
                    {item.product_images?.[0] ? (
                      <img
                        src={item.product_images[0].image}
                        alt={item.product_images[0].alt_text ?? item.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#333]"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#252525] border border-[#333] flex items-center justify-center shrink-0">
                        <Gem size={20} className="text-[#555]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{item.name}</p>
                      <p className="text-[#888] text-xs mt-0.5">
                        Qty: {item.quantity} &times; LKR {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-[#C9A24D] font-bold text-sm shrink-0">
                      LKR {item.total_price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Actions ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 pb-10"
        >
          <button
            onClick={() => navigate(`/invoice/${order.order_id}`)}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] text-black font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            View Invoice <ChevronRight size={16} />
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3.5 rounded-xl border border-[#C9A24D]/30 text-[#C9A24D] font-semibold text-sm hover:bg-[#C9A24D]/10 transition"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    </div>
  );
}
