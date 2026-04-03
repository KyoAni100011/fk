import { Modal } from "./Modal";
import { Button } from "./Button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

export const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}: DialogProps & { isLoading?: boolean }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-black">{title}</h2>
          {description && (
            <p className="text-sm text-black opacity-70 mt-2">{description}</p>
          )}
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button 
              variant={variant === "danger" ? "danger" : "primary"} 
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
