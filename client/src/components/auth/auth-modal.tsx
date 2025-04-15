import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignIn from "./sign-in";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <SignIn onSuccess={handleSuccess} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}