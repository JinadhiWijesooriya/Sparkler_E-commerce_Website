"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

import {
  getJewelryTypes,
  getGems,
  getMetals,
  getHeroSections,
} from "../api/customApi";

import type {
  JewelryType as JewelryTypeAPI,
  Gem as GemAPI,
  Metal as MetalAPI,
  HeroSection as HeroSectionAPI,
} from "../api/customApi";
import { getHomepageData, type Advertisement } from "../api/homeApi";

interface Sparkle {
  top: string;
  left: string;
  opacity: number;
  duration: string;
}

export default function CustomJewelry() {
  const configuratorRef = useRef<HTMLDivElement>(null);

  // ---------------- STATE ----------------
  const [jewelryTypes, setJewelryTypes] = useState<JewelryTypeAPI[]>([]);
  const [gems, setGems] = useState<GemAPI[]>([]);
  const [metals, setMetals] = useState<MetalAPI[]>([]);
  const [hero, setHero] = useState<HeroSectionAPI | null>(null);
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);

  const [selectedJewelry, setSelectedJewelry] = useState<number | null>(null);
  const [selectedGem, setSelectedGem] = useState<number | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<number | null>(null);

  const [sparkles] = useState<Sparkle[]>(() =>
    Array.from({ length: 25 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.2,
      duration: `${Math.random() * 3 + 2}s`,
    }))
  );

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jewelryRes, gemsRes, metalsRes, heroRes, homepageData] = await Promise.all([
          getJewelryTypes(),
          getGems(),
          getMetals(),
          getHeroSections(),
          getHomepageData(),
        ]);

        setJewelryTypes(jewelryRes);
        setGems(gemsRes);
        setMetals(metalsRes);

        if (heroRes.length > 0) setHero(heroRes[0]);
        if (homepageData.ads && homepageData.ads.length > 0) {
          const activeAds = homepageData.ads.filter(ad => ad.is_active);
          if (activeAds.length > 0) setAdvertisement(activeAds[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // ---------------- COMPUTED ----------------
  const previewImage = useMemo(() => {
    // Just show the advertisement image if no selection
    if (advertisement?.image) return advertisement.image;
    return "/previews/default.jpg";
  }, [advertisement]);

  const scrollToConfigurator = () => {
    configuratorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ---------------- WHATSAPP ----------------
  const handleSubmitRequest = () => {
    const whatsappNumber = "94705696254"; // your WhatsApp number

    const lines = ["Hello! I would like to request a custom jewelry design."];

    if (selectedJewelry) {
      const jewelry = jewelryTypes.find(j => j.id === selectedJewelry)?.name;
      lines.push(`Jewelry Type: ${jewelry}`);
    }

    if (selectedGem) {
      const gem = gems.find(g => g.id === selectedGem)?.name;
      lines.push(`Gemstone: ${gem}`);
    }

    if (selectedMetal) {
      const metal = metals.find(m => m.id === selectedMetal)?.name;
      lines.push(`Metal: ${metal}`);
    }

    if (lines.length === 1) lines.push("No options selected yet.");

    lines.push("\nPlease assist me with this custom request.");

    const message = lines.join("\n");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // ---------------- RENDER ----------------
  return (
    <section className="relative bg-[#1A1A1A] text-[#EDEDED] overflow-hidden">
      {/* HERO SECTION */}
      <div
        className={`relative h-[70vh] sm:h-[80vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-0
                   bg-cover bg-center bg-blend-overlay`}
        style={{ backgroundImage: `url(${hero?.image || "/previews/default.jpg"})` }}
      >
        <div className="absolute inset-0 bg-black/50 z-10" />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#C9A24D] drop-shadow-xl mb-4 sm:mb-6">
            {hero?.title || "Craft Your Luxury Jewelry"}
          </h1>
          <p className="text-[#BDBDBD] text-sm sm:text-base md:text-lg mb-6 sm:mb-10">
            {hero?.subtitle || "Design your perfect piece by choosing the type, gemstone, and metal."}
          </p>
          <div
            onClick={scrollToConfigurator}
            className="inline-block px-10 sm:px-16 py-3 sm:py-4 text-lg sm:text-xl rounded-full cursor-pointer bg-[#C9A24D] hover:bg-[#B08B3E] transition-transform hover:scale-105"
          >
            Start Designing
          </div>
        </motion.div>
      </div>

      {/* CONFIGURATOR */}
      <motion.div
        ref={configuratorRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 bg-[#1A1A1A]/90 p-6 sm:p-12 md:p-16 rounded-3xl border border-[#C9A24D]/30 relative -mt-24 sm:-mt-32 z-20 backdrop-blur-md"
      >
        {/* PREVIEW */}
        <div className="relative rounded-3xl overflow-hidden border border-[#C9A24D]/30 h-[300px] sm:h-[400px] md:h-[500px]">
          <img src={previewImage} alt="Jewelry Preview" className="w-full h-full object-cover rounded-3xl" />
          {sparkles.map((s, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#C9A24D] rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, s.opacity, 0] }}
              transition={{
                repeat: Infinity,
                duration: parseFloat(s.duration),
                repeatType: "loop",
                ease: "easeInOut",
              }}
              style={{ top: s.top, left: s.left }}
            />
          ))}
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Jewelry Type */}
          <div>
            <p className="text-[#C9A24D] font-bold text-lg sm:text-xl mb-2 sm:mb-3">Jewelry Type</p>
            <div className="flex gap-2 sm:gap-4 flex-wrap">
              {jewelryTypes.map((type) => (
                <motion.div
                  key={type.id}
                  onClick={() => setSelectedJewelry(type.id)}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer px-3 sm:px-4 py-2 sm:py-4 rounded-2xl border-2 transition text-center
                    ${selectedJewelry === type.id ? "border-[#C9A24D]" : "border-transparent hover:border-[#B08B3E]"}`}
                >
                  <p className="text-sm sm:text-base text-[#EDEDED]">{type.name}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gem Type */}
          <div>
            <p className="text-[#C9A24D] font-bold text-lg sm:text-xl mb-2 sm:mb-3">Gemstone</p>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto py-1">
              {gems.map((gem) => (
                <motion.div
                  key={gem.id}
                  onClick={() => setSelectedGem(gem.id)}
                  whileHover={{ scale: 1.1 }}
                  className={`flex-shrink-0 w-20 sm:w-24 h-20 sm:h-24 rounded-xl cursor-pointer border-2 bg-cover bg-center transition
                    ${selectedGem === gem.id ? "border-[#C9A24D]" : "border-transparent hover:border-[#B08B3E]"}`}
                  style={{ backgroundImage: `url(${gem.image || "/previews/default.jpg"})` }}
                />
              ))}
            </div>
          </div>

          {/* Metal Type */}
          <div>
            <p className="text-[#C9A24D] font-bold text-lg sm:text-xl mb-2 sm:mb-3">Metal</p>
            <div className="flex gap-2 sm:gap-4 flex-wrap">
              {metals.map((metal) => (
                <motion.div
                  key={metal.id}
                  onClick={() => setSelectedMetal(metal.id)}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer px-3 sm:px-4 py-2 sm:py-4 rounded-2xl border-2 transition text-center
                    ${selectedMetal === metal.id ? "border-[#C9A24D]" : "border-transparent hover:border-[#B08B3E]"}`}
                >
                  <p className="text-sm sm:text-base text-[#EDEDED]">{metal.name}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div
            onClick={handleSubmitRequest}
            className="px-10 sm:px-14 py-3 sm:py-4 text-lg sm:text-xl rounded-full cursor-pointer text-[#1A1A1A] bg-[#C9A24D] hover:bg-[#B08B3E] font-semibold text-center transition-transform hover:scale-105"
          >
            Submit Custom Request
          </div>
        </div>
      </motion.div>
    </section>
  );
}
