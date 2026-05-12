import { useContext, useEffect } from "react";
import "./ErrorMessage.css";
import { ErrorMessageProps } from "@/types/errorTypes";
import { CgClose } from "react-icons/cg";
import { ErrorContext } from "@/contexts/ErrorContext";

export default function ErrorMessage({ message }: ErrorMessageProps) {
  const { setIsOpen } = useContext(ErrorContext);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsOpen(false);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [setIsOpen]);

  return (
    <div className="error__message">
      <p className="error__message-text">{message}</p>
      <button onClick={() => setIsOpen(false)} className="error__message-close">
        <CgClose />
      </button>
    </div>
  );
}
