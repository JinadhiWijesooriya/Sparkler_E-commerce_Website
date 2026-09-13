"use client";

interface StepIndicatorProps {
  step: 1 | 2; // 1 = Shipping, 2 = Payment
}

const STEPS = [
  { id: 1, label: "Shipping" },
  { id: 2, label: "Payment" },
] as const;

export default function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className="flex justify-center gap-3 py-4 text-xs">
      {STEPS.map((s) => {
        const isActive = step === s.id;
        const isCompleted = step > s.id;

        return (
          <div
            key={s.id}
            className={`
              px-4 py-1 rounded-full font-medium transition-all
              ${
                isActive
                  ? "bg-[#C9A24D] text-[#1A1A1A]"
                  : isCompleted
                  ? "bg-[#2A2A2A] text-[#C9A24D] border border-[#C9A24D]/50"
                  : "border border-[#C9A24D]/30 text-[#BDBDBD]"
              }
            `}
          >
            {s.label}
          </div>
        );
      })}
    </div>
  );
}
