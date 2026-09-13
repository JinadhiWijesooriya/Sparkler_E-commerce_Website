export interface ShippingInfo {
    name: string;
    email: string;
    phone?: string;
    address: string;
    address2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
}
interface ShippingStepProps {
    shippingInfo: ShippingInfo;
    setShippingInfo: (v: ShippingInfo) => void;
    onNext: () => void;
}
export default function ShippingStep({ shippingInfo, setShippingInfo, onNext, }: ShippingStepProps): import("react/jsx-runtime").JSX.Element;
export {};
