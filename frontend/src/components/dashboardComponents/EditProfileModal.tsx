"use client";

import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import type { AxiosError } from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: Props) {
  const { user, updateProfile } = useAuth(); // context function
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize input with current user email when modal opens
  useEffect(() => {
    if (isOpen && user?.email) {
      setEmail(user.email);
    }
  }, [isOpen, user]);

  // Type guard for Axios errors
  const isAxiosError = (error: unknown): error is AxiosError =>
    (error as AxiosError)?.isAxiosError !== undefined;

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      await updateProfile(email); // context -> api -> interceptor attaches token
      toast.success("Profile updated successfully");
      onClose();
    } catch (err: unknown) {
      console.error(err);

      if (isAxiosError(err) && err.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <div className="space-y-4">
        <input
          type="email"
          placeholder="New email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-[#1F1F1F] border border-[#C9A24D]/40 text-white focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-lg font-semibold transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Modal>
  );
}
