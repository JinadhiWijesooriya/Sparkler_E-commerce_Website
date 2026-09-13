import { type ReactNode } from "react";
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
}
export default function Modal({ isOpen, onClose, title, children, }: ModalProps): import("react/jsx-runtime").JSX.Element;
export {};
