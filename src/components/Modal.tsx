import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-white">
      <div className="bg-custom-secondary border border-custom-secondary rounded shadow-lg w-[50%]">
        {children}
      </div>
    </div>
  );
};

export default Modal;
