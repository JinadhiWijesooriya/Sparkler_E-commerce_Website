"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import type { Advertisement } from "../../api/homeApi";
import { HomeApi } from "../../api/api";

export default function AdvertisementSection() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Track which ad is expanded

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  /* ---------------- Fetch Ads ---------------- */
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await HomeApi.getHomepageData();
        setAds(data.ads || []);
      } catch (err) {
        console.error("Failed to load ads", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  /* ---------------- Drag Handlers ---------------- */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    hasDragged.current = false;
    startX.current = e.pageX;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    const walk = e.pageX - startX.current;
    if (Math.abs(walk) > 6) {
      hasDragged.current = true;
      scrollRef.current.scrollLeft = scrollLeft.current - walk * 1.5;
    }
  };

  const stopDragging = () => {
    isDown.current = false;
  };

  if (loading) {
    return (
      <section className="py-16 text-center bg-[#1A1A1A] text-[#C9A24D]">
        Loading advertisements...
      </section>
    );
  }

  if (!ads.length) return null;

  return (
    <section className="relative py-16 bg-[#1A1A1A] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#EDEDED]">
            Exclusive Offers
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-[#BDBDBD]">
            Handcrafted elegance and premium promotions designed just for you.
          </p>
        </motion.div>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className="flex gap-6 overflow-x-auto pb-6 cursor-grab active:cursor-grabbing select-none"
        >
          {ads.map((ad, index) => {
            const promo = ad.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");

            const isExpanded = expandedIndex === index;
            const shortDescription = ad.description.length > 100
              ? ad.description.slice(0, 100) + "..."
              : ad.description;

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="min-w-[320px] relative rounded-3xl overflow-hidden shadow-xl"
              >
                {/* Image */}
                <img
                  src={ad.image}
                  alt={ad.title}
                  draggable={false}
                  className="w-full h-80 object-cover"
                />

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-transparent p-6 flex flex-col justify-end">
                  {/* Bold topic */}
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-[#e5a212] text-xl md:text-2xl font-bold"
                  >
                    {ad.title}
                  </motion.h3>

                  {/* Description with Read More */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-white text-sm md:text-base mt-1 mb-4"
                  >
                    {isExpanded ? ad.description : shortDescription}{" "}
                    {ad.description.length > 100 && (
                      <span
                        className="text-[#C9A24D] font-semibold cursor-pointer hover:underline"
                        onClick={() =>
                          setExpandedIndex(isExpanded ? null : index)
                        }
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </span>
                    )}
                  </motion.p>

                  {/* Click-safe link */}
                  <Link
                    to={`/shop?promo=${promo}`}
                    onClick={(e) => {
                      if (hasDragged.current) e.preventDefault();
                    }}
                    className="inline-block w-fit bg-[#C9A24D] text-black px-5 py-2 rounded-full font-semibold hover:bg-[#B08B3E] transition"
                  >
                    Shop Now
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
