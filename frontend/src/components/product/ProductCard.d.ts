export interface ProductCardType {
    id: number;
    name: string;
    price: number;
    description?: string;
    images: string[];
    product_type?: "shop" | "set" | "gem";
}
interface ProductCardProps {
    product: ProductCardType;
    maxDescriptionLength?: number;
    onClick?: (id: number) => void;
}
export default function ProductCard({ product, maxDescriptionLength, onClick, }: ProductCardProps): import("react/jsx-runtime").JSX.Element;
export {};
