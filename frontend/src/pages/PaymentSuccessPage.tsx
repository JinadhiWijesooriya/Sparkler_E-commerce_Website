"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Package, Receipt, ShoppingBag } from "lucide-react";
import { CartAPI } from "../api/cartApi";
import { useCart } from "../context/useCart";

export default function PaymentSuccessPage() {
    const { order_id } = useParams<{ order_id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { fetchCart } = useCart();

    const session_id = searchParams.get("session_id");

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const verificationStarted = useRef(false);

    useEffect(() => {
        if (!order_id || !session_id) {
            setLoading(false);
            setSuccess(false);
            setErrorMsg("Missing order ID or payment session information.");
            return;
        }

        // Guard to run only once (highly recommended in React React 18 strict mode double-mount)
        if (verificationStarted.current) return;
        verificationStarted.current = true;

        const verify = async () => {
            try {
                const response = await CartAPI.verifyPayment(order_id, session_id);
                if (response.status === "success") {
                    setSuccess(true);
                    // Refresh frontend cart state dynamically
                    await fetchCart();
                } else {
                    setSuccess(false);
                    setErrorMsg(response.message || "Payment verification failed.");
                }
            } catch (err: any) {
                console.error("Verification failed:", err);
                setErrorMsg(
                    err?.response?.data?.error || "An error occurred while verifying your payment."
                );
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [order_id, session_id, fetchCart]);

    // Loading Screen
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
                        Verifying payment details...
                    </p>
                </div>
            </div>
        );
    }

    // Error/Failure Screen
    if (!success) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-6 bg-[#141414] border border-red-500/20 p-8 rounded-2xl">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
                        <XCircle size={36} className="text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Payment Unverified</h2>
                    <p className="text-[#888]">{errorMsg || "We couldn't confirm your payment with Stripe."}</p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate("/cart")}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] text-black font-semibold hover:opacity-90 transition"
                        >
                            Return to Cart
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#C9A24D]/30 text-[#C9A24D] font-medium hover:bg-[#C9A24D]/10 transition"
                        >
                            Back to Shop
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Success Screen
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 py-16">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl w-full bg-[#141414] border border-[#C9A24D]/35 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#C9A24D]/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#B08B3E]/5 rounded-full blur-2xl" />

                <div className="text-center space-y-6">
                    {/* Success Check Badge */}
                    <div className="w-20 h-20 rounded-full bg-[#C9A24D]/10 border border-[#C9A24D]/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(201,162,77,0.15)]">
                        <CheckCircle2 size={38} className="text-[#C9A24D]" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-[#EDEDED] to-[#C9A24D] bg-clip-text text-transparent">
                            {session_id === 'cod' ? 'Order Placed!' : 'Payment Successful!'}
                        </h1>
                        <p className="text-sm text-[#888]">
                            {session_id === 'cod' ? 'Thank you for your order. You will pay upon delivery.' : 'Thank you for your purchase. Your payment has been securely processed.'}
                        </p>
                    </div>

                    {/* Details Box */}
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#C9A24D]/10 p-5 space-y-3 font-mono text-xs text-left max-w-sm mx-auto">
                        <div className="flex justify-between">
                            <span className="text-[#646464]">ORDER ID:</span>
                            <span className="text-[#C9A24D] font-bold">{order_id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#646464]">STATUS:</span>
                            <span className={session_id === 'cod' ? 'text-yellow-400 font-semibold uppercase' : 'text-green-400 font-semibold uppercase'}>{session_id === 'cod' ? 'Processing' : 'Paid'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#646464]">PAYMENT:</span>
                            <span className="text-white">{session_id === 'cod' ? 'Cash on Delivery' : 'Stripe Checkout'}</span>
                        </div>
                    </div>

                    <p className="text-xs text-[#555] max-w-sm mx-auto">
                        A confirmation email containing your tracking link and invoice details has been sent to your email address.
                    </p>

                    {/* Action Callouts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => navigate(`/tracking/${order_id}`)}
                            className="py-4.5 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] text-black font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Package size={16} />
                            Track Order
                        </button>
                        <button
                            onClick={() => navigate(`/invoice/${order_id}`)}
                            className="py-4.5 rounded-xl border border-[#C9A24D]/35 text-[#C9A24D] font-semibold text-sm hover:bg-[#C9A24D]/10 transition flex items-center justify-center gap-2"
                        >
                            <Receipt size={16} />
                            View Invoice
                        </button>
                    </div>

                    {/* Return Home */}
                    <div className="pt-2">
                        <button
                            onClick={() => navigate("/")}
                            className="text-xs text-[#888] hover:text-white transition flex items-center justify-center gap-1.5 mx-auto"
                        >
                            <ShoppingBag size={12} />
                            Continue Shopping
                            <ArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
