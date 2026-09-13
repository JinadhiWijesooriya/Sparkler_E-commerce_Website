"use client";

import { motion } from "framer-motion";

export default function Auth() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#1A1A1A] px-4 sm:px-6 overflow-hidden">
      
      {/* Animated gold ambient glow */}
      <motion.div
        initial={{ opacity: 0.4, scale: 0.95 }}
        animate={{ opacity: 0.7, scale: 1.05 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,162,77,0.15),_transparent_60%)]"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md sm:max-w-lg bg-[#1A1A1A] 
                   border border-[#C9A24D]/30 rounded-3xl 
                   shadow-[0_30px_90px_rgba(0,0,0,0.75)] 
                   overflow-hidden"
      >
        {/* Gold accent shimmer */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute top-0 left-0 h-1 w-full 
                     bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent opacity-60"
        />

        <div className="p-6 sm:p-8 md:p-10">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 sm:mb-8 text-center"
          >
            <h2 className="text-[#C9A24D] text-2xl sm:text-3xl md:text-3xl font-semibold tracking-wide">
              Welcome Back
            </h2>
            <p className="text-[#BDBDBD] text-xs sm:text-sm mt-1 sm:mt-2">
              Sign in to access your jewelry collection
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {/* Email */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mb-4 sm:mb-5"
            >
              <label className="block text-[#BDBDBD] text-[10px] sm:text-xs mb-1 sm:mb-2 tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#1A1A1A] text-[#EDEDED] 
                           p-3 sm:p-3.5 rounded-lg border border-[#C9A24D]/30 
                           placeholder-[#777] 
                           focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D]/40 
                           outline-none transition-all text-sm sm:text-base"
              />
            </motion.div>

            {/* Password */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mb-4 sm:mb-6"
            >
              <label className="block text-[#BDBDBD] text-[10px] sm:text-xs mb-1 sm:mb-2 tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#1A1A1A] text-[#EDEDED] 
                           p-3 sm:p-3.5 rounded-lg border border-[#C9A24D]/30 
                           placeholder-[#777] 
                           focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D]/40 
                           outline-none transition-all text-sm sm:text-base"
              />
            </motion.div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-2 sm:gap-0"
          >
            <label className="flex items-center gap-2 text-xs sm:text-sm text-[#BDBDBD]">
              <input type="checkbox" className="accent-[#C9A24D]" />
              Remember me
            </label>

            <button className="text-xs sm:text-sm text-[#C9A24D] hover:text-[#B08B3E] transition self-start sm:self-auto">
              Forgot password?
            </button>
          </motion.div>

          {/* CTA */}
          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 30px rgba(201,162,77,0.35)",
            }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-[#C9A24D] text-[#1A1A1A] py-3 sm:py-3.5 
                       rounded-xl font-semibold tracking-wide 
                       hover:bg-[#B08B3E] transition-all text-sm sm:text-base"
          >
            Sign In
          </motion.button>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-[#BDBDBD] text-[10px] sm:text-xs mt-4 sm:mt-6"
          >
            Don’t have an account?{" "}
            <span className="text-[#C9A24D] hover:text-[#B08B3E] cursor-pointer transition">
              Create one
            </span>
          </motion.p>
        </div>

        {/* Inner luxury glow */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl 
                        bg-gradient-to-t from-[#C9A24D]/10 via-transparent to-transparent" />
      </motion.div>
    </section>
  );
}
