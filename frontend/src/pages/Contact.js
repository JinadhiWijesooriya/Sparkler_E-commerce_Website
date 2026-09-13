"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Gem } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getContactInfo, getContactHero, } from "../api/contactApi";
/* ===================== VALIDATION ===================== */
const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z
        .string()
        .optional()
        .refine((val) => !val || /^[0-9+\-\s()]+$/.test(val), "Invalid phone number"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});
export default function Contact() {
    const [contactInfo, setContactInfo] = useState(null);
    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    /* ---------------- FORM ---------------- */
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(contactSchema),
    });
    /* ---------------- FETCH DATA ---------------- */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [info, heroData] = await Promise.all([
                    getContactInfo(),
                    getContactHero(),
                ]);
                setContactInfo(info);
                setHero(heroData);
            }
            catch (err) {
                console.error("Contact fetch failed", err);
            }
        };
        fetchData();
    }, []);
    /* ---------------- SUBMIT ---------------- */
    const onSubmit = (data) => {
        setLoading(true);
        // UI-only success simulation
        setTimeout(() => {
            console.log("Form data:", data);
            setSuccess(true);
            reset();
            setLoading(false);
            setTimeout(() => setSuccess(false), 3000);
        }, 1200);
    };
    return (_jsxs("section", { className: "bg-[#121212] text-[#EDEDED] overflow-hidden", children: [hero && (_jsxs("div", { className: "relative h-[420px] w-full", children: [_jsx("img", { src: hero.background_image, alt: "Contact page hero background", className: "absolute inset-0 w-full h-full object-cover brightness-75" }), _jsx("div", { className: "absolute inset-0 bg-black/60" }), _jsx(motion.div, { animate: { y: [0, -20, 0] }, transition: { duration: 6, repeat: Infinity }, className: "absolute top-16 right-16 opacity-20", children: _jsx(Gem, { size: 70, color: "#FFD700" }) }), _jsxs("div", { className: "relative z-10 h-full flex flex-col justify-center items-center text-center px-6", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-extrabold mb-4", children: hero.title }), _jsx("p", { className: "max-w-2xl text-[#BDBDBD] text-lg", children: hero.subtitle })] })] })), _jsxs("div", { className: "max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-4 py-20", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.7 }, className: "relative rounded-3xl p-8 bg-gradient-to-br from-[#1B1B1B] to-[#0B0B0B] border border-[#C9A24D]/40 shadow-2xl overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#FFD700]/10 via-transparent to-[#FFD700]/5 pointer-events-none rounded-3xl" }), _jsx("h2", { className: "text-3xl font-bold mb-6 text-[#FFD700] tracking-wide", children: "Get in Touch" }), _jsx("p", { className: "text-[#BDBDBD] mb-8", children: "We\u2019d love to hear from you! Reach out for inquiries, partnerships, or luxury updates." }), contactInfo && (_jsxs("div", { className: "flex flex-col gap-5", children: [_jsx(ContactCard, { icon: _jsx(FiMail, {}), label: "Email", value: contactInfo.email, link: `mailto:${contactInfo.email}` }), _jsx(ContactCard, { icon: _jsx(FiPhone, {}), label: "Phone", value: contactInfo.phone, link: `tel:${contactInfo.phone}` }), _jsx(ContactCard, { icon: _jsx(FiMapPin, {}), label: "Address", value: contactInfo.address })] }))] }), _jsxs(motion.form, { onSubmit: handleSubmit(onSubmit), initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.7 }, className: "rounded-3xl p-10 bg-[#1B1B1B] border border-[#C9A24D]/20 shadow-2xl space-y-5", children: [_jsx(Input, { label: "Name", error: errors.name?.message, ...register("name") }), _jsx(Input, { label: "Email", type: "email", error: errors.email?.message, ...register("email") }), _jsx(Input, { label: "Phone", error: errors.phone?.message, ...register("phone") }), _jsx(Textarea, { label: "Message", error: errors.message?.message, ...register("message") }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-4 rounded-2xl bg-[#C9A24D] hover:bg-[#B08B3E] text-[#121212] font-semibold transition", children: loading ? "Sending..." : success ? "Message Sent!" : "Send Message" })] })] }), hero?.map_url && (_jsx("div", { className: "max-w-6xl mx-auto mb-20 rounded-3xl overflow-hidden border border-[#C9A24D]/20 shadow-xl", children: _jsx("iframe", { src: hero.map_url, title: "Company location map", className: "w-full h-[380px] border-0", loading: "lazy" }) }))] }));
}
/* ===================== UI COMPONENTS ===================== */
function ContactCard({ icon, label, value, link, }) {
    return (_jsxs(motion.a, { whileHover: { scale: 1.05, x: 5 }, transition: { type: "spring", stiffness: 200 }, href: link ?? "#", className: "flex items-center gap-4 p-4 rounded-xl bg-[#121212]/50 border border-[#FFD700]/20 hover:bg-[#FFD700]/5 shadow-md cursor-pointer transition", children: [_jsx("div", { className: "w-12 h-12 flex items-center justify-center rounded-full bg-[#FFD700]/20 text-[#FFD700] text-2xl", children: icon }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm text-[#BDBDBD]", children: label }), _jsx("span", { className: "font-semibold text-lg text-[#EDEDED]", children: value })] })] }));
}
function Input({ label, error, ...props }) {
    return (_jsxs("div", { children: [_jsx("input", { ...props, placeholder: label, className: "w-full p-4 rounded-xl bg-[#121212] border border-[#C9A24D]/30 outline-none focus:border-[#FFD700] transition" }), error && _jsx("p", { className: "text-red-400 text-sm mt-1", children: error })] }));
}
function Textarea({ label, error, ...props }) {
    return (_jsxs("div", { children: [_jsx("textarea", { ...props, rows: 4, placeholder: label, className: "w-full p-4 rounded-xl bg-[#121212] border border-[#C9A24D]/30 outline-none focus:border-[#FFD700] transition" }), error && _jsx("p", { className: "text-red-400 text-sm mt-1", children: error })] }));
}
