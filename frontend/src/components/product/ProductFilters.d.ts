import type { ShopSetQueryParams } from "../../api/shopSetsApi";
import type { ProductQueryParams } from "../../api/shopApi";
import type { GemQueryParams } from "../../api/gemApi";
export type FilterTarget = "shopSet" | "product" | "gem";
interface ProductFiltersProps<T extends FilterTarget = "shopSet"> {
    target?: T;
    onApply: T extends "shopSet" ? (filters: ShopSetQueryParams) => void : T extends "product" ? (filters: ProductQueryParams) => void : (filters: GemQueryParams) => void;
}
export default function ProductFilters<T extends FilterTarget = "shopSet">({ target, onApply, }: ProductFiltersProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
