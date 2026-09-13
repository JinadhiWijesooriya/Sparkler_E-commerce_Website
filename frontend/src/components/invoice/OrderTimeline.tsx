import type { OrderType } from "../../api/cartApi";

interface Props {
  status: OrderType["status"];
}

export default function OrderTimeline({ status }: Props) {
  const steps: OrderType["status"][] = ["Placed", "Processing", "Shipped", "Delivered"];
  const current = steps.indexOf(status);

  return (
    <div className="mb-10">
      <h3 className="text-sm uppercase text-[#C9A24D] mb-4 font-semibold">Order Status</h3>
      <div className="flex justify-between relative">
        {steps.map((step, idx) => (
          <div key={step} className="flex-1 text-center relative">
            {/* Circle indicator */}
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                idx <= current ? "bg-[#C9A24D] text-black" : "bg-[#2A2A2A] text-[#777]"
              }`}
            >
              {idx + 1}
            </div>

            {/* Step label */}
            <p className="mt-2 text-xs text-[#BDBDBD]">{step}</p>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className={`absolute top-3 left-1/2 w-full h-[2px] -translate-x-1/2 -z-10 ${
                  idx < current ? "bg-[#C9A24D]" : "bg-[#2A2A2A]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
