"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FooterApi } from "../../api/api"; 
import { getContactInfo, type ContactInfo } from "../../api/contactApi";
import type { SocialLink } from "../../api/footerApi";

/* ---------------- ICON MAP ---------------- */
const SOCIAL_ICON_MAP: Record<string, React.ReactNode> = {
  instagram: <FaInstagram />,
  facebook: <FaFacebookF />,
  linkedin: <FaLinkedinIn />,
  youtube: <FaYoutube />,
  tiktok: <FaTiktok />,
};

/* ---------------- TYPES ---------------- */
type FooterLink = { label: string; href?: string };
type FooterContact = { icon: React.ReactNode; text: string; href?: string };

interface FooterSection {
  title: string;
  items: (FooterLink | FooterContact)[];
}

function isFooterContact(item: FooterLink | FooterContact): item is FooterContact {
  return (item as FooterContact).icon !== undefined;
}

/* ---------------- COMPONENT ---------------- */
export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loadingSocial, setLoadingSocial] = useState(true);
  const [loadingContact, setLoadingContact] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const data = await FooterApi.getSocialLinks();
        setSocialLinks([...data].sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Failed to load social links", error);
      } finally {
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
      } catch (error) {
        console.error("Failed to load contact info", error);
      } finally {
        setLoadingContact(false);
      }
    };
    fetchContactInfo();
  }, []);

  const footerItems: FooterSection[] = [
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
              icon: <FaPhoneAlt />,
              text: contactInfo.phone,
              href: `tel:${contactInfo.phone}`,
            },
            {
              icon: <FaEnvelope />,
              text: contactInfo.email,
              href: `mailto:${contactInfo.email}`,
            },
            {
              icon: <FaMapMarkerAlt />,
              text: contactInfo.address,
            },
          ],
    },
  ];

  return (
    <footer className="bg-[#1A1A1A] text-[#EDEDED] pt-12 pb-8">
      {/* -------- MAIN CONTAINER -------- */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:gap-12">

        {/* -------- BRANDING -------- */}
        <div className="space-y-4 md:w-1/3 flex flex-col justify-center">
          <img
            src="/logo/JewelryLogo.png"
            alt="SPARKLER Logo"
            className="w-44 md:w-52 object-contain mx-auto md:mx-0"
          />

          <p className="text-[#BDBDBD] text-sm md:text-base max-w-sm mx-auto md:mx-0">
            Handcrafted luxury gems and jewelry. Elevate your style with timeless elegance.
          </p>

          {/* -------- SOCIAL LINKS -------- */}
          <div className="flex gap-3 flex-wrap mt-3 justify-center md:justify-start">
            {!loadingSocial &&
              socialLinks.map((social: SocialLink) => {
                const icon = SOCIAL_ICON_MAP[social.name.toLowerCase()] ?? null;
                if (!icon) return null;

                return (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-[#C9A24D]
                      text-[#C9A24D] hover:bg-[#C9A24D] hover:text-[#1A1A1A]
                      transition-all duration-300 shadow-md"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {icon}
                  </motion.a>
                );
              })}
          </div>
        </div>

        {/* -------- FOOTER SECTIONS -------- */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {footerItems.map((section, idx) => (
            <div key={idx} className="flex flex-col justify-center">
              <h4 className="text-lg font-semibold text-[#C9A24D] mb-3">
                {section.title}
              </h4>

              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i}>
                    {isFooterContact(item) ? (
                      <motion.a
                        href={item.href}
                        className="flex items-center gap-2 hover:text-[#B08B3E]"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-[#C9A24D]">{item.icon}</span>
                        {item.text}
                      </motion.a>
                    ) : (
                      <motion.span
                        className="cursor-pointer hover:text-[#B08B3E]"
                        whileHover={{ x: 5 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* -------- FOOTER BOTTOM -------- */}
      <div className="mt-12 border-t border-[#B08B3E]/30 pt-4 text-xs md:text-sm
        flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6">

        <span>© {new Date().getFullYear()} SPARKLER. All Rights Reserved.</span>

        <span className="mt-2 md:mt-0">
          Crafted with <span className="text-[#C9A24D] font-semibold">Luxury & Precision</span>
        </span>
      </div>
    </footer>
  );
}
