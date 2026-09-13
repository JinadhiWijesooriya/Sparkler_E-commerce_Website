"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
export default function ChangePasswordModal({ isOpen, onClose }) {
    const { changePassword } = useAuth(); // Use context function
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        if (!oldPassword || !newPassword) {
            toast.error("All fields are required");
            return;
        }
        try {
            setLoading(true);
            await changePassword(oldPassword, newPassword);
            toast.success("Password changed successfully");
            setOldPassword("");
            setNewPassword("");
            onClose();
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to change password");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: "Change Password", children: _jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "password", placeholder: "Current password", value: oldPassword, onChange: (e) => setOldPassword(e.target.value), className: "w-full px-4 py-2 rounded-lg bg-[#1F1F1F] border border-[#C9A24D]/40 text-white focus:outline-none" }), _jsx("input", { type: "password", placeholder: "New password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "w-full px-4 py-2 rounded-lg bg-[#1F1F1F] border border-[#C9A24D]/40 text-white focus:outline-none" }), _jsx("button", { onClick: handleSubmit, disabled: loading, className: "w-full py-2 bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] rounded-lg font-semibold transition disabled:opacity-60", children: loading ? "Updating..." : "Update Password" })] }) }));
}
