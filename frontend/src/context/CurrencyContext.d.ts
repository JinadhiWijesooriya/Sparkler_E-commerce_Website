import { type ReactNode } from "react";
export interface CurrencyContextType {
    currency: "LKR";
    format: (price: number) => string;
}
export declare const CurrencyContext: import("react").Context<CurrencyContextType | null>;
export declare function CurrencyProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useCurrency(): CurrencyContextType;
