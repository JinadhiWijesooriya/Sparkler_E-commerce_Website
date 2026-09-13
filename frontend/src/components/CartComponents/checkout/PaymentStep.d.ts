import type { ShippingInfo } from "./ShippingStep";
interface PaymentStepProps {
    shippingInfo: ShippingInfo;
    invoiceConsent: boolean;
    setInvoiceConsent: React.Dispatch<React.SetStateAction<boolean>>;
    onBack: () => void;
}
export default function PaymentStep({ shippingInfo, invoiceConsent, setInvoiceConsent, onBack, }: PaymentStepProps): import("react/jsx-runtime").JSX.Element;
export {};
