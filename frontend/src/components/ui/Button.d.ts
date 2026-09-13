interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "outline";
    className?: string;
    onClick?: () => void;
}
export default function Button({ children, variant, className, onClick, }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
