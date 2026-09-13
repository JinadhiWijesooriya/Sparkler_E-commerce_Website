import type { CartItemType } from "../../../api/cartApi";
interface OrderSummaryProps {
    cartItems: CartItemType[];
    country?: string;
    shipping_cost?: number;
    tax?: number;
    vat?: number;
    total?: number;
}
export default function OrderSummary({ cartItems, country, shipping_cost, tax, total, }: OrderSummaryProps): import("react/jsx-runtime").JSX.Element;
export {};
