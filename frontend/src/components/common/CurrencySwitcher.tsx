"use client";

import { useCurrency } from "../../context/CurrencyContext";

export default function CurrencySwitcher() {
  const { currency } = useCurrency();

  return (
    <div className="inline-flex items-center">
      <span className="mr-2 text-[10px] tracking-widest text-textSecondary uppercase">
        Curr
      </span>
      <span className="text-textPrimary text-xs font-medium px-3 py-1.5 rounded-full bg-charcoal border border-gold">
        {currency}
      </span>
    </div>
  );
}
