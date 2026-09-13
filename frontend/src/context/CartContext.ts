import type { CartItemType, OrderType, CountryType } from "../api/cartApi";
import { createContext } from "react";

// -------------------------
// Extended Cart Item Type
// -------------------------
export interface CartItemTypeExtended extends CartItemType {
  metal?: string;
  gem?: string;
  variant?: string;
  image?: string;
}

// -------------------------
// Context Types
// -------------------------
export interface CartContextType {
  items: CartItemTypeExtended[];
  loading: boolean;

  // Orders
  orders?: OrderType[];
  fetchAllOrders?: () => Promise<void>;
  fetchOrderById?: (order_id: string) => Promise<OrderType | undefined>;

  // Cart actions
  fetchCart: () => Promise<void>;
  addToCart: (
    product_id: number,
    product_type: "shop" | "set" | "gem",
    quantity?: number
  ) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  removeCartItem: (id: number) => Promise<void>;

  // Countries & pricing
  countries: CountryType[];
  getCountrySettings: (countryName?: string) => {
    shipping_cost: number;
    tax_rate: number;
    vat_rate: number;
  };

  // Totals
  getCartSubtotal: () => number;
  getCartTotal: (countryName?: string) => number;

  checkout: (orderData: {
    full_name: string;
    email: string;
    phone?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    country: string;
    payment_method: string;
    cart?: CartItemTypeExtended[]; // optional cart snapshot
  }) => Promise<{ checkout_url: string; order_id: string } | undefined>;
}

// -------------------------
// Context
// -------------------------
export const CartContext = createContext<CartContextType | undefined>(undefined);
