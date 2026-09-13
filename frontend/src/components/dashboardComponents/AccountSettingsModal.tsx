"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import { FaUser, FaMapMarkerAlt, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountSettingsModal({ isOpen, onClose }: Props) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleManageAddresses = () => {
    toast("Address management coming next 👀");
  };

  return (
    <>
      {/* MAIN ACCOUNT SETTINGS MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} title="Account Settings">
        <div className="space-y-6 text-[#EDEDED]">
          {/* Edit Profile */}
          <div className="flex items-center p-4 bg-[#1F1F1F] rounded-2xl border border-[#C9A24D]/30 shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 flex items-center justify-center bg-[#C9A24D] text-[#1A1A1A] rounded-full text-xl mr-4">
              <FaUser />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#C9A24D] text-lg">
                Edit Profile
              </h3>
              <p className="text-[#BDBDBD] text-sm">
                Update your personal information and contact details.
              </p>
            </div>
            <button
              onClick={() => setShowEditProfile(true)}
              className="px-4 py-2 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-lg font-medium transition"
            >
              Edit
            </button>
          </div>

          {/* Manage Addresses */}
          <div className="flex items-center p-4 bg-[#1F1F1F] rounded-2xl border border-[#C9A24D]/30 shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 flex items-center justify-center bg-[#C9A24D] text-[#1A1A1A] rounded-full text-xl mr-4">
              <FaMapMarkerAlt />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#C9A24D] text-lg">
                Manage Addresses
              </h3>
              <p className="text-[#BDBDBD] text-sm">
                Add, edit, or remove delivery addresses.
              </p>
            </div>
            <button
              onClick={handleManageAddresses}
              className="px-4 py-2 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-lg font-medium transition"
            >
              Edit
            </button>
          </div>

          {/* Change Password */}
          <div className="flex items-center p-4 bg-[#1F1F1F] rounded-2xl border border-[#C9A24D]/30 shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 flex items-center justify-center bg-[#C9A24D] text-[#1A1A1A] rounded-full text-xl mr-4">
              <FaLock />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#C9A24D] text-lg">
                Change Password
              </h3>
              <p className="text-[#BDBDBD] text-sm">
                Secure your account with a strong password.
              </p>
            </div>
            <button
              onClick={() => setShowChangePassword(true)}
              className="px-4 py-2 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-lg font-medium transition"
            >
              Change
            </button>
          </div>

          {/* Close */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* CHILD MODALS */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
}
