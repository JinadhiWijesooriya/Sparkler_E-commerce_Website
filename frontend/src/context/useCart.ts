import { useContext } from "react";
import { CartContext, type CartContextType } from "./CartContext";

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  // Provide default values for optional props
  return {
    ...context,
    orders: context.orders ?? [],
    fetchAllOrders: context.fetchAllOrders ?? (async () => {}),
    fetchOrderById: context.fetchOrderById ?? (async () => undefined),
  };
};
