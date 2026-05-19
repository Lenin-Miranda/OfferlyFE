import { useCallback, useContext, useEffect } from "react";
import { ErrorMessageProps } from "@/types/errorTypes";
import { ErrorContext } from "@/contexts/ErrorContext";
import FeedbackMessage from "../FeedbackMessage/FeedbackMessage";

export default function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  const { errorMessage, setIsOpen } = useContext(ErrorContext);
  const displayedMessage = message || errorMessage;
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
      return;
    }

    setIsOpen(false);
  }, [onClose, setIsOpen]);

  useEffect(() => {
    if (!displayedMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      handleClose();
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [displayedMessage, handleClose]);

  if (!displayedMessage) {
    return null;
  }

  return (
    <FeedbackMessage
      message={displayedMessage}
      type="error"
      onClose={handleClose}
    />
  );
}
