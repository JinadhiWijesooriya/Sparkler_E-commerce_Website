import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
// Conversion rate: LKR only
const RATE_LKR = 320;
// Create context
export const CurrencyContext = createContext(null);
// Provider component
export function CurrencyProvider({ children }) {
    const currency = "LKR";
    // Format function
    const format = (price) => new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency,
    }).format(price * RATE_LKR);
    return (_jsx(CurrencyContext.Provider, { value: { currency, format }, children: children }));
}
// Custom hook
export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within CurrencyProvider");
    }
    return context;
}
