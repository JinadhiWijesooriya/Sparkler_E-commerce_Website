"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ShopSetQueryParams } from "../../api/shopSetsApi";
import type { ProductQueryParams } from "../../api/shopApi";
import { mapFiltersToBackend } from "../../api/shopSetsApi";
import type { GemQueryParams } from "../../api/gemApi";

export type FilterTarget = "shopSet" | "product" | "gem";

interface ProductFiltersProps<T extends FilterTarget = "shopSet"> {
  target?: T; // optional, defaults to "shopSet"
  onApply: T extends "shopSet"
  ? (filters: ShopSetQueryParams) => void
  : T extends "product"
  ? (filters: ProductQueryParams) => void
  : (filters: GemQueryParams) => void;
}

export default function ProductFilters<T extends FilterTarget = "shopSet">({
  target = "shopSet" as T,
  onApply,
}: ProductFiltersProps<T>) {
  const [priceSort, setPriceSort] =
    useState<"low-high" | "high-low">("low-high");

  const [gem, setGem] =
    useState<"Diamond" | "Ruby" | "Emerald" | "Sapphire" | undefined>();
  const [metal, setMetal] =
    useState<"Gold" | "Silver" | "Platinum" | undefined>();
  const [availability, setAvailability] =
    useState<"in_stock" | "out_of_stock" | undefined>();
  const [origin, setOrigin] = useState<string | undefined>();
  const [shape, setShape] = useState<string | undefined>();
  const [carat, setCarat] = useState<number | undefined>();
  const [priceGte, setPriceGte] = useState<number | undefined>();
  const [priceLte, setPriceLte] = useState<number | undefined>();

  const applyFilters = () => {
    if (target === "shopSet") {
      // Map frontend values to backend-compatible ShopSet query params
      const filters: ShopSetQueryParams = mapFiltersToBackend({
        gem,
        metal,
        availability,
        ordering: priceSort === "low-high" ? "price" : "-price",
        carat,
        price_gte: priceGte,
        price_lte: priceLte,
      });

      (onApply as (filters: ShopSetQueryParams) => void)(filters);
      return;
    }

    if (target === "gem") {
      const filters: GemQueryParams = {
        gem_type: gem,
        origin: origin,
        shape: shape,
        // Add other mappings if needed, like weight_carat or price
      };
      (onApply as (filters: GemQueryParams) => void)(filters);
      return;
    }

    // Product target...
    const filters: ProductQueryParams = {
      ordering: priceSort === "low-high" ? "price" : "-price",
      gem,
      metal,
      availability:
        availability === undefined
          ? undefined
          : availability === "in_stock"
            ? true
            : false,
      ...(carat ? { carat } : {}),
      ...(priceGte ? { price_gte: priceGte } : {}),
      ...(priceLte ? { price_lte: priceLte } : {}),
    };

    (onApply as (filters: ProductQueryParams) => void)(filters);
  };

  const inputClass =
    "w-full p-3 rounded-xl bg-[#2A2A2A] text-white border border-[#444] " +
    "focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D] outline-none transition";

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A1A1A]/70 backdrop-blur-md p-6 rounded-3xl border border-[#C9A24D]/40"
    >
      <h3 className="text-[#C9A24D] font-bold text-2xl mb-6 text-center">
        Filter Products
      </h3>

      {/* ---------------- PRICE RANGE ---------------- */}
      <div className="flex gap-2 mt-4">
        <div className="flex-1">
          <label htmlFor="priceGte" className="block mb-1 text-sm text-gray-300">
            Min Price (LKR)
          </label>
          <input
            id="priceGte"
            type="number"
            min={0}
            step={0.01}
            value={priceGte ?? ""}
            onChange={(e) =>
              setPriceGte(e.target.value ? Number(e.target.value) : undefined)
            }
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="priceLte" className="block mb-1 text-sm text-gray-300">
            Max Price (LKR)
          </label>
          <input
            id="priceLte"
            type="number"
            min={0}
            step={0.01}
            value={priceLte ?? ""}
            onChange={(e) =>
              setPriceLte(e.target.value ? Number(e.target.value) : undefined)
            }
            className={inputClass}
          />
        </div>
      </div>

      {/* ---------------- PRICE SORT ---------------- */}
      <label
        htmlFor="priceSort"
        className="block mt-4 mb-1 text-sm text-gray-300"
      >
        Sort By Price
      </label>
      <select
        id="priceSort"
        value={priceSort}
        onChange={(e) =>
          setPriceSort(e.target.value as "low-high" | "high-low")
        }
        className={inputClass}
      >
        <option value="low-high">Low → High</option>
        <option value="high-low">High → Low</option>
      </select>

      {/* ---------------- GEM ---------------- */}
      <label htmlFor="gem" className="block mt-4 mb-1 text-sm text-gray-300">
        Gem
      </label>
      <select
        id="gem"
        value={gem ?? ""}
        onChange={(e) =>
          setGem(
            e.target.value === ""
              ? undefined
              : (e.target.value as "Diamond" | "Ruby" | "Emerald" | "Sapphire")
          )
        }
        className={inputClass}
      >
        <option value="">All</option>
        <option value="Diamond">Diamond</option>
        <option value="Ruby">Ruby</option>
        <option value="Emerald">Emerald</option>
        <option value="Sapphire">Sapphire</option>
      </select>

      {/* ---------------- METAL ---------------- */}
      <label
        htmlFor="metal"
        className="block mt-4 mb-1 text-sm text-gray-300"
      >
        Metal
      </label>
      <select
        id="metal"
        value={metal ?? ""}
        onChange={(e) =>
          setMetal(
            e.target.value === ""
              ? undefined
              : (e.target.value as "Gold" | "Silver" | "Platinum")
          )
        }
        className={inputClass}
      >
        <option value="">All</option>
        <option value="Gold">Gold</option>
        <option value="Silver">Silver</option>
        <option value="Platinum">Platinum</option>
      </select>

      {/* ---------------- CARAT ---------------- */}
      <label
        htmlFor="carat"
        className="block mt-4 mb-1 text-sm text-gray-300"
      >
        Carat Weight
      </label>
      <input
        id="carat"
        type="number"
        step="0.01"
        min="0"
        placeholder="e.g. 1.25"
        value={carat ?? ""}
        onChange={(e) =>
          setCarat(e.target.value ? Number(e.target.value) : undefined)
        }
        className={inputClass}
      />

      {/* ---------------- ORIGIN ---------------- */}
      <label htmlFor="origin" className="block mt-4 mb-1 text-sm text-gray-300">
        Origin
      </label>
      <select
        id="origin"
        value={origin ?? ""}
        onChange={(e) => setOrigin(e.target.value === "" ? undefined : e.target.value)}
        className={inputClass}
      >
        <option value="">All</option>
        <option value="Ceylon">Ceylon</option>
        <option value="Madagascar">Madagascar</option>
        <option value="Burma">Burma</option>
        <option value="Mozambique">Mozambique</option>
        <option value="Colombia">Colombia</option>
      </select>

      {/* ---------------- SHAPE ---------------- */}
      <label htmlFor="shape" className="block mt-4 mb-1 text-sm text-gray-300">
        Shape
      </label>
      <select
        id="shape"
        value={shape ?? ""}
        onChange={(e) => setShape(e.target.value === "" ? undefined : e.target.value)}
        className={inputClass}
      >
        <option value="">All</option>
        <option value="Oval">Oval</option>
        <option value="Cushion">Cushion</option>
        <option value="Round">Round</option>
        <option value="Emerald Cut">Emerald Cut</option>
        <option value="Pear">Pear</option>
        <option value="Heart">Heart</option>
      </select>

      {/* ---------------- AVAILABILITY ---------------- */}
      <label
        htmlFor="availability"
        className="block mt-4 mb-1 text-sm text-gray-300"
      >
        Availability
      </label>
      <select
        id="availability"
        value={availability ?? ""}
        onChange={(e) =>
          setAvailability(
            e.target.value === ""
              ? undefined
              : (e.target.value as "in_stock" | "out_of_stock")
          )
        }
        className={inputClass}
      >
        <option value="">All</option>
        <option value="in_stock">In Stock</option>
        <option value="out_of_stock">Out of Stock</option>
      </select>

      {/* ---------------- APPLY ---------------- */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={applyFilters}
        className="w-full mt-6 bg-[#C9A24D] py-3 rounded-xl font-bold text-black hover:bg-[#D4AF5A]"
      >
        Apply Filters
      </motion.button>
    </motion.div>
  );
}
