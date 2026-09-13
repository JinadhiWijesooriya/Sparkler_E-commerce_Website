export interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrderPlaced: (orderId: string) => void;
}
export default function CheckoutModal({ isOpen, onClose, }: CheckoutModalProps): import("react/jsx-runtime").JSX.Element;
