/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode, useContext } from "react";

// Context type
export interface CurrencyContextType {
  currency: "LKR";
  format: (price: number) => string;
}

// Conversion rate: LKR only
const RATE_LKR = 320 as const;

// Create context
export const CurrencyContext = createContext<CurrencyContextType | null>(null);

// Provider component
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const currency = "LKR" as const;

  // Format function
  const format = (price: number) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency,
    }).format(price * RATE_LKR);

  return (
    <CurrencyContext.Provider value={{ currency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Custom hook
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
