export interface Service {
    title: string;
    description: string;
    estimatedCost: string;
    beforeAfterImages: string[];
}
interface Props {
    service: Service | null;
    onClose: () => void;
}
export default function ServiceModal({ service, onClose }: Props): import("react/jsx-runtime").JSX.Element;
export {};
