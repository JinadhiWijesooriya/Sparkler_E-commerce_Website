interface ProductImageType {
    image: string;
    alt_text: string | null;
}
interface CartItemCardProps {
    cartItemId: number;
    name: string;
    price: number;
    quantity: number;
    product_images?: ProductImageType[];
    minQuantity?: number;
    maxQuantity?: number;
    loading?: boolean;
}
export default function CartItemCard({ cartItemId, name, price, quantity, product_images, minQuantity, maxQuantity, loading, }: CartItemCardProps): import("react/jsx-runtime").JSX.Element;
export {};
