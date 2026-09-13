import type { PropsWithChildren } from "react";

// -------------------------
// Section Component
// -------------------------
export const Section = ({
  title,
  children,
}: PropsWithChildren<{ title: string }>) => (
  <section className="space-y-3">
    <h2 className="text-sm font-semibold text-[#EDEDED]">{title}</h2>
    {children}
  </section>
);

// -------------------------
// Grid Component
// -------------------------
export const Grid = ({ children }: PropsWithChildren) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
);

// -------------------------
// Input Component
// -------------------------
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = ({ error, ...props }: InputProps) => (
  <div className="flex flex-col w-full">
    <input
      {...props}
      className={`w-full px-3 py-2.5 rounded-lg bg-[#0E0E0E]
               border ${error ? "border-red-500" : "border-[#C9A24D]/30"} 
               text-sm text-[#EDEDED]
               placeholder:text-[#777]
               focus:outline-none focus:ring-2 focus:ring-[#C9A24D]/40 transition`}
    />
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

// -------------------------
// Select Component
// -------------------------
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = ({ error, children, ...props }: SelectProps) => (
  <div className="flex flex-col w-full">
    <select
      {...props}
      className={`w-full px-3 py-2.5 rounded-lg bg-[#0E0E0E]
               border ${error ? "border-red-500" : "border-[#C9A24D]/30"} 
               text-sm text-[#EDEDED]
               focus:outline-none focus:ring-2 focus:ring-[#C9A24D]/40 transition`}
    >
      {children}
    </select>
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

// -------------------------
// Primary Button
// -------------------------
export const PrimaryButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <button
    {...props}
    className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2
               bg-gradient-to-r from-[#C9A24D] to-[#B08B3E] text-[#1A1A1A] disabled:opacity-50"
  >
    {props.children}
  </button>
);

// -------------------------
// Secondary Button
// -------------------------
export const SecondaryButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <button
    {...props}
    className="w-full py-3 rounded-xl border border-[#C9A24D]/30 text-[#C9A24D]
               flex items-center justify-center gap-2"
  >
    {props.children}
  </button>
);
