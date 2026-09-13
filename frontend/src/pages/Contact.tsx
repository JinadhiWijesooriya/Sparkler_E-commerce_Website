"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Gem } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getContactInfo,
  getContactHero,
  type ContactInfo,
  type ContactHero,
} from "../api/contactApi";

/* ===================== VALIDATION ===================== */
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9+\-\s()]+$/.test(val),
      "Invalid phone number"
    ),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [hero, setHero] = useState<ContactHero | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ---------------- FORM ---------------- */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
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
      } catch (err) {
        console.error("Contact fetch failed", err);
      }
    };

    fetchData();
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data: ContactFormData) => {
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

  return (
    <section className="bg-[#121212] text-[#EDEDED] overflow-hidden">
      {/* ================= HERO ================= */}
      {hero && (
        <div className="relative h-[420px] w-full">
          <img
            src={hero.background_image}
            alt="Contact page hero background"
            className="absolute inset-0 w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black/60" />

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-16 right-16 opacity-20"
          >
            <Gem size={70} color="#FFD700" />
          </motion.div>

          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {hero.title}
            </h1>
            <p className="max-w-2xl text-[#BDBDBD] text-lg">
              {hero.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-4 py-20">
        {/* ---------- CREATIVE CONTACT INFO CARD ---------- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl p-8 bg-gradient-to-br from-[#1B1B1B] to-[#0B0B0B] border border-[#C9A24D]/40 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#FFD700]/10 via-transparent to-[#FFD700]/5 pointer-events-none rounded-3xl" />
          
          <h2 className="text-3xl font-bold mb-6 text-[#FFD700] tracking-wide">
            Get in Touch
          </h2>
          <p className="text-[#BDBDBD] mb-8">
            We’d love to hear from you! Reach out for inquiries, partnerships, or luxury updates.
          </p>

          {contactInfo && (
            <div className="flex flex-col gap-5">
              <ContactCard icon={<FiMail />} label="Email" value={contactInfo.email} link={`mailto:${contactInfo.email}`} />
              <ContactCard icon={<FiPhone />} label="Phone" value={contactInfo.phone} link={`tel:${contactInfo.phone}`} />
              <ContactCard icon={<FiMapPin />} label="Address" value={contactInfo.address} />
            </div>
          )}
        </motion.div>

        {/* ---------- FORM ---------- */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl p-10 bg-[#1B1B1B] border border-[#C9A24D]/20 shadow-2xl space-y-5"
        >
          <Input
            label="Name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Phone"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <Textarea
            label="Message"
            error={errors.message?.message}
            {...register("message")}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#C9A24D] hover:bg-[#B08B3E] text-[#121212] font-semibold transition"
          >
            {loading ? "Sending..." : success ? "Message Sent!" : "Send Message"}
          </button>
        </motion.form>
      </div>

      {/* ================= MAP ================= */}
      {hero?.map_url && (
        <div className="max-w-6xl mx-auto mb-20 rounded-3xl overflow-hidden border border-[#C9A24D]/20 shadow-xl">
          <iframe
            src={hero.map_url}
            title="Company location map"
            className="w-full h-[380px] border-0"
            loading="lazy"
          />
        </div>
      )}
    </section>
  );
}

/* ===================== UI COMPONENTS ===================== */

function ContactCard({
  icon,
  label,
  value,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
}) {
  return (
    <motion.a
      whileHover={{ scale: 1.05, x: 5 }}
      transition={{ type: "spring", stiffness: 200 }}
      href={link ?? "#"}
      className="flex items-center gap-4 p-4 rounded-xl bg-[#121212]/50 border border-[#FFD700]/20 hover:bg-[#FFD700]/5 shadow-md cursor-pointer transition"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FFD700]/20 text-[#FFD700] text-2xl">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-[#BDBDBD]">{label}</span>
        <span className="font-semibold text-lg text-[#EDEDED]">{value}</span>
      </div>
    </motion.a>
  );
}

function Input({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <input
        {...props}
        placeholder={label}
        className="w-full p-4 rounded-xl bg-[#121212] border border-[#C9A24D]/30 outline-none focus:border-[#FFD700] transition"
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

function Textarea({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <textarea
        {...props}
        rows={4}
        placeholder={label}
        className="w-full p-4 rounded-xl bg-[#121212] border border-[#C9A24D]/30 outline-none focus:border-[#FFD700] transition"
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
