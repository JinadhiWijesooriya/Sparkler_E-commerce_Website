"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Grid, Input, PrimaryButton, Section, Select } from "./CheckoutInputs";
import { useCart } from "../../../context/useCart";

// -------------------------
// Types
// -------------------------
export interface ShippingInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;       // maps to address_1
  address2?: string;     // maps to address_2
  city: string;
  state?: string;
  country: string;
  postalCode: string;    // maps to postal_code
}

interface ShippingStepProps {
  shippingInfo: ShippingInfo;
  setShippingInfo: (v: ShippingInfo) => void;
  onNext: () => void;
}

// -------------------------
// Component
// -------------------------
export default function ShippingStep({
  shippingInfo,
  setShippingInfo,
  onNext,
}: ShippingStepProps) {
  const { items, countries, getCartSubtotal, getCountrySettings, getCartTotal } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // -------------------------
  // Input handler
  // -------------------------
  const handleChange = (key: keyof ShippingInfo, value: string) => {
    setShippingInfo({ ...shippingInfo, [key]: value });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  // -------------------------
  // Validation
  // -------------------------
  const validate = () => {
    const e: Record<string, string> = {};
    const required: (keyof ShippingInfo)[] = [
      "name",
      "email",
      "address",
      "city",
      "country",
      "postalCode",
    ];

    required.forEach((f) => {
      if (!shippingInfo[f]?.trim()) e[f] = "Required";
    });

    if (shippingInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      e.email = "Invalid email";
    }

    if (shippingInfo.phone && !/^[0-9+\s()-]{7,15}$/.test(shippingInfo.phone)) {
      e.phone = "Invalid phone";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // -------------------------
  // Totals (Preview Only)
  // -------------------------
  const subtotal = getCartSubtotal();
  const { shipping_cost, tax_rate,  } = getCountrySettings(shippingInfo.country);
  const tax = subtotal * tax_rate;
  // const vat = subtotal * vat_rate;
  const total = getCartTotal(shippingInfo.country);

  // -------------------------
  // Next step
  // -------------------------
  const handleNext = () => {
    if (!validate() || items.length === 0) return;
    onNext(); // go to PaymentStep
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <Section title="Shipping Details">
      <Grid>
        <Input
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />
        <Input
          placeholder="Email"
          type="email"
          value={shippingInfo.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
        />
        <Input
          placeholder="Phone (optional)"
          value={shippingInfo.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
        />
        <Input
          placeholder="City"
          value={shippingInfo.city}
          onChange={(e) => handleChange("city", e.target.value)}
          error={errors.city}
        />
      </Grid>

      <Grid>
        <Input
          placeholder="Address"
          value={shippingInfo.address}
          onChange={(e) => handleChange("address", e.target.value)}
          error={errors.address}
        />
        <Input
          placeholder="Address Line 2 (optional)"
          value={shippingInfo.address2 || ""}
          onChange={(e) => handleChange("address2", e.target.value)}
        />
      </Grid>

      <Grid>
        <Input
          placeholder="State / Province"
          value={shippingInfo.state || ""}
          onChange={(e) => handleChange("state", e.target.value)}
        />
        <Input
          placeholder="Postal Code"
          value={shippingInfo.postalCode}
          onChange={(e) => handleChange("postalCode", e.target.value)}
          error={errors.postalCode}
        />
      </Grid>

      <label className="flex flex-col text-sm mt-2">
        Country
        <Select
          value={shippingInfo.country}
          onChange={(e) => handleChange("country", e.target.value)}
          error={errors.country}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </Select>
      </label>

      {/* Totals Preview */}
      <div className="border-t border-[#C9A24D]/20 pt-3 mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>LKR.{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>LKR.{shipping_cost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>LKR.{tax.toFixed(2)}</span>
        </div>
        {/* {vat_rate > 0 && (
          <div className="flex justify-between">
            <span>VAT</span>
            <span>${vat.toFixed(2)}</span>
          </div>
        )} */}
        <div className="flex justify-between font-bold text-[#C9A24D]">
          <span>Total</span>
          <span>LKR.{total.toFixed(2)}</span>
        </div>
      </div>

      <PrimaryButton
        onClick={handleNext}
        disabled={items.length === 0}
        className="mt-4"
      >
        Continue to Payment <ArrowRight size={16} />
      </PrimaryButton>
    </Section>
  );
}
