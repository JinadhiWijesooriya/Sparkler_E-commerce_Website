"use client";

import { useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { CartAPI, type OrderType, type CartItemType } from "../../api/cartApi";

// Props
interface OrderTrackerProps {
  orderId: string;
}

// Status steps
const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function OrderTracker({ orderId }: OrderTrackerProps) {
  const [order, setOrder] = useState<OrderType | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map order status to step index
  const getStepIndex = useCallback((status: string): number => {
    const index = STATUS_STEPS.findIndex(
      (s) => s.toLowerCase() === status.toLowerCase()
    );
    return index >= 0 ? index : 0;
  }, []);

  // Fetch order from API
  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data: OrderType = await CartAPI.getOrder(orderId);
      setOrder(data);
      setCurrentStep(getStepIndex(data.status));
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          setError("Order not found.");
        } else {
          setError("Failed to fetch order. Please try again.");
        }
      } else if (err instanceof Error) {
        setError("Failed to fetch order. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
      setOrder(null);
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  }, [orderId, getStepIndex]);

  // Polling every 10 seconds
  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#1A1A1A] p-6 rounded-2xl shadow-2xl border border-[#C9A24D] text-[#BDBDBD]">
        Loading order...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#1A1A1A] p-6 rounded-2xl shadow-2xl border border-red-600 text-red-400">
        {error}
      </div>
    );
  }

  if (!order) return null;

  const cartItems: CartItemType[] = order.cart?.items || [];

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-2xl shadow-2xl border border-[#C9A24D]">
      <h2 className="text-xl font-bold text-[#C9A24D] mb-2">Order Tracker</h2>
      <p className="text-[#BDBDBD] mb-4">
        Order ID:{" "}
        <span className="text-[#EDEDED] font-mono">{order.order_id}</span>
      </p>

      {/* Stepper */}
      <div className="relative flex justify-between items-center mb-6">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={step} className="flex-1 text-center relative">
              {/* Connector line */}
              {index < STATUS_STEPS.length - 1 && (
                <div
                  className={`absolute top-1/2 left-1/2 w-full h-1 -translate-x-1/2 rounded-full z-0 ${
                    isCompleted
                      ? "bg-gradient-to-r from-[#C9A24D] to-[#B08B3E]"
                      : "bg-[#555555]"
                  }`}
                />
              )}

              {/* Step Circle */}
              <div
                className={`mx-auto w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg z-10 relative ${
                  isCompleted
                    ? "bg-[#C9A24D] border-[#C9A24D] scale-110 transition-transform duration-500"
                    : isActive
                    ? "bg-[#B08B3E] border-[#C9A24D] animate-pulse scale-105 transition-transform duration-500"
                    : "bg-[#1A1A1A] border-[#555555]"
                }`}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#1A1A1A]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-sm text-[#EDEDED] font-semibold">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Step label */}
              <span
                className={`block mt-2 text-xs font-medium ${
                  isCompleted || isActive ? "text-[#EDEDED]" : "text-[#BDBDBD]"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cart Items Table */}
      {cartItems.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-left border border-[#555555] text-[#BDBDBD]">
            <thead className="bg-[#1F1F1F]">
              <tr>
                <th className="px-4 py-2 border-b border-[#555555]">Product</th>
                <th className="px-4 py-2 border-b border-[#555555]">Quantity</th>
                <th className="px-4 py-2 border-b border-[#555555]">Price</th>
                <th className="px-4 py-2 border-b border-[#555555]">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#2A2A2A]">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-2">${item.total_price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details */}
      <div className="text-[#BDBDBD] space-y-1 mb-6">
        <p>
          <strong>Full Name:</strong> {order.full_name}
        </p>
        <p>
          <strong>Email:</strong> {order.email}
        </p>
        {order.phone && (
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
        )}
        <p>
          <strong>Address:</strong> {order.address_1} {order.address_2 || ""},{" "}
          {order.city}, {order.state || ""}, {order.country?.name || ""}
        </p>
        <p>
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
      </div>

      {/* Manual Refresh */}
      <div className="mt-4 text-center">
        <button
          onClick={fetchOrder}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] hover:from-[#B08B3E] hover:to-[#C9A24D] text-[#1A1A1A] font-semibold text-sm transition-all duration-300 shadow-md"
        >
          Refresh Order Status
        </button>
      </div>
    </div>
  );
}
