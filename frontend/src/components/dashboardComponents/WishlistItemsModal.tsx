"use client";

import Modal from "../ui/Modal";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Sample wishlist items
const wishlistSample = [
  { id: 1, name: "Diamond Ring", price: 1200, image: "/products/diamond-ring.jpg" },
  { id: 2, name: "Gold Necklace", price: 850, image: "/products/gold-necklace.jpg" },
  { id: 3, name: "Emerald Earrings", price: 950, image: "/products/emerald-earrings.jpg" },
];

export default function WishlistItemsModal({ isOpen, onClose }: Props) {
  const [wishlistItems, setWishlistItems] = useState(wishlistSample);

  const removeItem = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Wishlist">
      <div className="space-y-6 text-[#EDEDED]">

        {wishlistItems.length === 0 && (
          <p className="text-center text-[#BDBDBD] py-12 text-lg">
            Your wishlist is empty.
          </p>
        )}

        {wishlistItems.length > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {wishlistItems.map(item => (
              <div
                key={item.id}
                className="flex items-center p-4 bg-[#1F1F1F] rounded-2xl border border-[#C9A24D]/20 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover border border-[#C9A24D]/30 shadow-sm mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-[#EDEDED] font-semibold text-lg">{item.name}</h3>
                  <p className="text-[#BDBDBD] mt-1">${item.price}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  title={`Remove ${item.name}`}
                  className="ml-4 p-3 rounded-lg bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] transition shadow-md"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Close Button */}
        {wishlistItems.length > 0 && (
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-lg font-semibold transition shadow-md"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
