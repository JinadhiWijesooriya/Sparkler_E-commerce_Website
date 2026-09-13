"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaTiktok, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, } from "react-icons/fa";
import { FooterApi } from "../../api/api";
import { getContactInfo } from "../../api/contactApi";
/* ---------------- ICON MAP ---------------- */
const SOCIAL_ICON_MAP = {
    instagram: _jsx(FaInstagram, {}),
    facebook: _jsx(FaFacebookF, {}),
    linkedin: _jsx(FaLinkedinIn, {}),
    youtube: _jsx(FaYoutube, {}),
    tiktok: _jsx(FaTiktok, {}),
};
function isFooterContact(item) {
    return item.icon !== undefined;
}
/* ---------------- COMPONENT ---------------- */
export default function Footer() {
    const [socialLinks, setSocialLinks] = useState([]);
    const [contactInfo, setContactInfo] = useState(null);
    const [loadingSocial, setLoadingSocial] = useState(true);
    const [loadingContact, setLoadingContact] = useState(true);
    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const data = await FooterApi.getSocialLinks();
                setSocialLinks([...data].sort((a, b) => a.order - b.order));
            }
            catch (error) {
                console.error("Failed to load social links", error);
            }
            finally {
                setLoadingSocial(false);
            }
        };
        fetchSocialLinks();
    }, []);
    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const data = await getContactInfo();
                setContactInfo(data);
            }
            catch (error) {
                console.error("Failed to load contact info", error);
            }
            finally {
                setLoadingContact(false);
            }
        };
        fetchContactInfo();
    }, []);
    const footerItems = [
        {
            title: "Services",
            items: [
                { label: "Custom Jewelry" },
                { label: "Gem Cutting" },
                { label: "Watch Repair" },
            ],
        },
        {
            title: "Policies",
            items: [
                { label: "Privacy Policy" },
                { label: "Shipping" },
                { label: "Returns" },
            ],
        },
        {
            title: "Contact Us",
            items: loadingContact || !contactInfo
                ? []
                : [
                    {
                        icon: _jsx(FaPhoneAlt, {}),
                        text: contactInfo.phone,
                        href: `tel:${contactInfo.phone}`,
                    },
                    {
                        icon: _jsx(FaEnvelope, {}),
                        text: contactInfo.email,
                        href: `mailto:${contactInfo.email}`,
                    },
                    {
                        icon: _jsx(FaMapMarkerAlt, {}),
                        text: contactInfo.address,
                    },
                ],
        },
    ];
    return (_jsxs("footer", { className: "bg-[#1A1A1A] text-[#EDEDED] pt-12 pb-8", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:gap-12", children: [_jsxs("div", { className: "space-y-4 md:w-1/3 flex flex-col justify-center", children: [_jsx("img", { src: "/logo/JewelryLogo.png", alt: "SPARKLER Logo", className: "w-44 md:w-52 object-contain mx-auto md:mx-0" }), _jsx("p", { className: "text-[#BDBDBD] text-sm md:text-base max-w-sm mx-auto md:mx-0", children: "Handcrafted luxury gems and jewelry. Elevate your style with timeless elegance." }), _jsx("div", { className: "flex gap-3 flex-wrap mt-3 justify-center md:justify-start", children: !loadingSocial &&
                                    socialLinks.map((social) => {
                                        const icon = SOCIAL_ICON_MAP[social.name.toLowerCase()] ?? null;
                                        if (!icon)
                                            return null;
                                        return (_jsx(motion.a, { href: social.url, target: "_blank", rel: "noopener noreferrer", "aria-label": social.name, className: "w-10 h-10 flex items-center justify-center rounded-full border border-[#C9A24D]\n                      text-[#C9A24D] hover:bg-[#C9A24D] hover:text-[#1A1A1A]\n                      transition-all duration-300 shadow-md", whileHover: { scale: 1.2, rotate: 10 }, children: icon }, social.id));
                                    }) })] }), _jsx("div", { className: "flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8", children: footerItems.map((section, idx) => (_jsxs("div", { className: "flex flex-col justify-center", children: [_jsx("h4", { className: "text-lg font-semibold text-[#C9A24D] mb-3", children: section.title }), _jsx("ul", { className: "space-y-2", children: section.items.map((item, i) => (_jsx("li", { children: isFooterContact(item) ? (_jsxs(motion.a, { href: item.href, className: "flex items-center gap-2 hover:text-[#B08B3E]", whileHover: { x: 5 }, children: [_jsx("span", { className: "text-[#C9A24D]", children: item.icon }), item.text] })) : (_jsx(motion.span, { className: "cursor-pointer hover:text-[#B08B3E]", whileHover: { x: 5 }, children: item.label })) }, i))) })] }, idx))) })] }), _jsxs("div", { className: "mt-12 border-t border-[#B08B3E]/30 pt-4 text-xs md:text-sm\n        flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6", children: [_jsxs("span", { children: ["\u00A9 ", new Date().getFullYear(), " SPARKLER. All Rights Reserved."] }), _jsxs("span", { className: "mt-2 md:mt-0", children: ["Crafted with ", _jsx("span", { className: "text-[#C9A24D] font-semibold", children: "Luxury & Precision" })] })] })] }));
}
