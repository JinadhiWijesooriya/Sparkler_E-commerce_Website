"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { CartAPI, type OrderType } from "../../api/cartApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TotalOrdersModal({ isOpen, onClose }: Props) {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await CartAPI.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders whenever modal opens
  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Total Orders">
      <div className="space-y-4 text-[#EDEDED]">
        {loading ? (
          <p className="text-center text-[#BDBDBD] py-6">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-6">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-[#BDBDBD] py-6">You have no orders yet.</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {orders.map(order => (
              <div
                key={order.order_id}
                className="flex justify-between items-center p-4 bg-[#1F1F1F] rounded-2xl border border-[#C9A24D]/20 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <div>
                  <h4 className="font-semibold text-[#C9A24D] text-lg">
                    Order #{order.order_id}
                  </h4>
                  <p className="text-[#BDBDBD] text-sm">
                    Amount: ${order.total.toFixed(2)}
                  </p>
                  {order.full_name && (
                    <p className="text-[#BDBDBD] text-sm">Name: {order.full_name}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-sm ${
                    order.status.toLowerCase() === "delivered"
                      ? "bg-[#B08B3E]/20 text-[#B08B3E]"
                      : order.status.toLowerCase() === "pending"
                      ? "bg-[#C9A24D]/20 text-[#C9A24D]"
                      : "bg-[#C9A24D]/10 text-[#C9A24D]"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-lg font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
