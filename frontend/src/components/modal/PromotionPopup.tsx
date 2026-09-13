import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { subscribeToPromotions } from "../../api/promotionApi";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PromotionPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [phone, setPhone] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ phone?: string; consent?: string; general?: string }>({});

  useEffect(() => {
    setTimeout(() => setAnimate(true), 50);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { phone?: string; consent?: string } = {};

    // Basic phone validation (could be more complex if needed)
    if (!phone || phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!consent) {
      newErrors.consent = "Please agree to the terms to join";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await subscribeToPromotions({ phone_number: `+${phone}`, consent });
      console.log(result.message);
      setSubmitted(true);
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again later." });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-500">
      <div
        className={`bg-[#1A1A1A] rounded-3xl w-96 relative border border-[#C9A24D]/30
          transform transition-all duration-1000
          ${animate ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"}
          animate-luxury-glow shadow-[0_0_50px_rgba(201,162,77,0.15)]
        `}
      >
        {/* Background Decorative Aura */}
        <div className="absolute -inset-4 bg-[#C9A24D]/5 blur-[60px] rounded-full -z-10 animate-aura-pulse" />

        {/* Limited Spots Badge */}
        <div className="absolute top-4 left-4 bg-[#C9A24D] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 shadow-lg z-20">
          Limited Spots
        </div>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white/20 hover:text-[#C9A24D] text-lg font-bold transition-all z-20 p-2 hover:rotate-90"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="px-8 pt-10 pb-4 text-center">
              <h2 className="text-3xl font-black mb-2 text-white tracking-tight leading-tight">
                Unlock <span className="text-[#C9A24D]">VIP</span> Deals
              </h2>
              <p className="text-white/60 text-sm mb-4 leading-relaxed font-medium">
                Join our WhatsApp VIP club for flash sales and artisan stories before anyone else.
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[#1A1A1A] bg-white/10 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" className="w-full h-full object-cover grayscale opacity-50" />
                    </div>
                  ))}
                </div>
                <p className="text-[#C9A24D] text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                  1,400+ Joined
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
              <div className="space-y-1">
                <PhoneInput
                  country={'lk'}
                  value={phone}
                  onChange={(val) => {
                    setPhone(val);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  enableSearch
                  placeholder="Enter your phone number"
                  containerClass="w-full"
                  inputClass={`w-full !rounded-xl !pl-12 !pr-4 !py-3 !bg-[#222] !text-white focus:!ring-0 transition-all font-medium ${errors.phone ? "!border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "!border-[#C9A24D]/20 focus:!border-[#C9A24D]"
                    }`}
                  buttonClass={`!bg-[#222] !rounded-l-xl ${errors.phone ? "!border-red-500/50" : "!border-[#C9A24D]/20"}`}
                  dropdownClass="!bg-[#1A1A1A] !text-white !border-[#C9A24D]/20"
                  specialLabel=""
                />
                {errors.phone && (
                  <p className="text-red-400/80 text-[10px] font-medium italic pl-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-start space-x-3 text-white/40 text-xs cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={() => {
                        setConsent(!consent);
                        if (errors.consent) setErrors(prev => ({ ...prev, consent: undefined }));
                      }}
                      className="peer h-4 w-4 opacity-0 absolute inset-0 cursor-pointer z-10"
                    />
                    <div className={`h-4 w-4 border rounded peer-checked:bg-[#C9A24D] peer-checked:border-[#C9A24D] transition-all flex items-center justify-center ${errors.consent ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "border-white/20"
                      }`}>
                      {consent && <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                  </div>
                  <span className={`transition-colors ${errors.consent ? "text-red-400/60" : "group-hover:text-white/60"}`}>
                    I agree to join the WhatsApp group and receive exclusive promotional offers.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-red-400/80 text-[10px] font-medium italic pl-7 leading-none">
                    {errors.consent}
                  </p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                  <p className="text-red-400 text-xs font-medium">{errors.general}</p>
                </div>
              )}

              {/* CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full h-14 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden ${loading
                  ? "bg-white/5 text-white/20 cursor-not-allowed"
                  : "bg-white text-black hover:bg-[#C9A24D] hover:shadow-[0_0_30px_rgba(201,162,77,0.4)]"
                  }`}
              >
                {loading ? "Submitting..." : (
                  <>
                    Join the Club
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 15, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      className="inline-block origin-bottom ml-1 text-base"
                    >
                      👋
                    </motion.span>
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20 animate-ping ml-1" />
                  </>
                )}

                {/* Refined Liquid Shimmer Effect */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-16 px-8 space-y-6">
            <div className="w-20 h-20 bg-[#C9A24D]/10 rounded-full flex items-center justify-center mx-auto border border-[#C9A24D]/20">
              <CheckCircle2 className="w-10 h-10 text-[#C9A24D]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white italic tracking-tight">The Journey Begins</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Your VIP access is confirmed. Watch your WhatsApp for the first artisan treasure.
              </p>
            </div>
            <button
              className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Enter the Boutique
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          /* PhoneInput dark mode overrides */
          .react-tel-input .form-control {
            background-color: #222 !important;
            color: #fff !important;
            border-color: rgba(201, 162, 77, 0.2) !important;
            padding-left: 48px !important;
          }
          .react-tel-input .flag-dropdown {
            background-color: #222 !important;
            border-color: rgba(201, 162, 77, 0.2) !important;
          }
          .react-tel-input .country-list {
            background-color: #1A1A1A !important;
            color: #fff !important;
            border: 1px solid rgba(201, 162, 77, 0.2) !important;
            border-radius: 12px !important;
          }
          .react-tel-input .country-list .country:hover {
            background-color: #C9A24D !important;
            color: #000 !important;
          }

          @keyframes aura-pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
          .animate-aura-pulse { animation: aura-pulse 4s ease-in-out infinite; }

          @keyframes luxury-glow {
            0%, 100% { box-shadow: 0 0 30px rgba(201, 162, 77, 0.1); }
            50% { box-shadow: 0 0 50px rgba(201, 162, 77, 0.25); }
          }
          .animate-luxury-glow { animation: luxury-glow 3s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}
