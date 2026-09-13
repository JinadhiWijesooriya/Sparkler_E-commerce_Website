"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import type { CartType, OrderType, CountryType } from "../api/cartApi";
import { CartAPI } from "../api/cartApi";
import { CartContext, type CartItemTypeExtended } from "./CartContext";

interface Props {
  children: ReactNode;
}

export const CartProvider = ({ children }: Props) => {
  const [items, setItems] = useState<CartItemTypeExtended[]>([]);
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);

  // ------------------------- FETCH CART -------------------------
  const fetchCart = async () => {
    setLoading(true);
    try {
      const cart: CartType = await CartAPI.getCart();
      setItems(
        cart.items.map((item) => ({
          ...item,
          product_images: item.product_images ?? [],
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------- FETCH COUNTRIES -------------------------
  const fetchCountries = async () => {
    try {
      const data = await CartAPI.getCountries();
      setCountries(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load countries");
    }
  };

  // ------------------------- FETCH ALL ORDERS -------------------------
  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const data = await CartAPI.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------- FETCH SINGLE ORDER -------------------------
  const fetchOrderById = async (order_id: string): Promise<OrderType | undefined> => {
    try {
      return await CartAPI.getOrder(order_id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch order");
      return undefined;
    }
  };

  // ------------------------- ADD / UPDATE / REMOVE CART ITEMS -------------------------
  const addToCart = async (
    product_id: number,
    product_type: "shop" | "set" | "gem",
    quantity = 1
  ) => {
    try {
      const cart = await CartAPI.addToCart(product_id, product_type, quantity);
      setItems(cart.items.map((item) => ({ ...item, product_images: item.product_images ?? [] })));
      toast.success("Item added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item");
    }
  };

  const updateCartItem = async (id: number, quantity: number) => {
    try {
      const cart = await CartAPI.updateCartItem(id, quantity);
      setItems(cart.items.map((item) => ({ ...item, product_images: item.product_images ?? [] })));
      toast.success("Cart updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    }
  };

  const removeCartItem = async (id: number) => {
    try {
      const cart = await CartAPI.removeCartItem(id);
      setItems(cart.items.map((item) => ({ ...item, product_images: item.product_images ?? [] })));
      toast.success("Item removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  // ------------------------- CART SUBTOTAL & TOTAL -------------------------
  const getCartSubtotal = () => items.reduce((sum, item) => sum + item.total_price, 0);

  const getCountrySettings = (countryName?: string) => {
    const country = countries.find((c) => c.name === countryName);
    return {
      shipping_cost: country?.order_settings?.shipping_cost ?? 0,
      tax_rate: country?.order_settings?.tax_rate ?? 0.07,
      vat_rate: country?.order_settings?.vat_rate ?? 0,
    };
  };

  const getCartTotal = (countryName?: string) => {
    const subtotal = getCartSubtotal();
    const { shipping_cost, tax_rate, vat_rate } = getCountrySettings(countryName);
    const tax = subtotal * tax_rate;
    const vat = subtotal * vat_rate;
    return subtotal + shipping_cost + tax + vat;
  };

  // ------------------------- CHECKOUT -------------------------
  const checkout = async (orderData: {
    full_name: string;
    email: string;
    phone?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    country: string;
    payment_method: string;
    cart?: CartItemTypeExtended[];
  }): Promise<{ checkout_url: string; order_id: string } | undefined> => {
    try {
      const res = await CartAPI.checkout(orderData);
      toast.success(`Redirecting to payment gateway...`);
      fetchAllOrders(); // refresh orders
      return res;
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate payment link");
      return undefined;
    }
  };

  // ------------------------- INIT -------------------------
  useEffect(() => {
    fetchCart();
    fetchCountries();
    fetchAllOrders();
  }, []);

  // ------------------------- PROVIDER -------------------------
  return (
    <CartContext.Provider
      value={{
        items,
        countries,
        orders,
        loading,
        fetchCart,
        fetchAllOrders,
        fetchOrderById,
        addToCart,
        updateCartItem,
        removeCartItem,
        getCartSubtotal,
        getCountrySettings,
        getCartTotal,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
