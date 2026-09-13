import type { ReactNode } from "react";
import clsx from "clsx";

export default function Card({
  children,
  className,
  showButton = false, // optional prop to show/hide default button
}: {
  children: ReactNode;
  className?: string;
  showButton?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative bg-[#1A1A1A] rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl",
        className
      )}
    >
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C9A24D] via-[#B08B3E] to-[#C9A24D]"></div>

      {/* Card content wrapper */}
      <div className="p-4 sm:p-6 flex flex-col gap-4 text-[#EDEDED]">
        {children}
      </div>

      {/* Optional CTA / Button area */}
      {showButton && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <button className="w-full bg-[#C9A24D] hover:bg-[#B08B3E] text-[#1A1A1A] font-semibold py-3 rounded-lg transition-colors duration-300 text-sm sm:text-base">
            Shop Now
          </button>
        </div>
      )}
    </div>
  );
}
