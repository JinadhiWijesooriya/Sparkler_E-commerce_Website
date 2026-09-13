import type { FC } from "react";
interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}
declare const ConsultationModal: FC<ConsultationModalProps>;
export default ConsultationModal;
