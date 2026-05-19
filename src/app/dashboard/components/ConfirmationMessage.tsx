"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import { ApplicationPayload } from "@/types";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import { getApplicationMutationSuccessMessage } from "../applicationHelpers";
import "./ConfirmationMessage.css";

export default function ConfirmationMessage({
  message,
  isOpen,
  onClose,
  mode,
  id,
  changes,
}: {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  mode?: "delete" | "edit";
  id: string;
  changes: Partial<ApplicationPayload>;
}) {
  const { deleteApplication, editApplication, setIsMessage, setMessageType } =
    useContext(ApplicationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [handleClose, isOpen]);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      if (mode === "delete") {
        await deleteApplication(id);
        setMessageType("success");
        setIsMessage("Application deleted successfully!");
      } else {
        const updatedApplication = await editApplication(id, changes);
        setMessageType("success");
        setIsMessage(
          getApplicationMutationSuccessMessage(updatedApplication, "updated"),
        );
      }
      handleClose();
    } catch {
      setMessageType("error");
      setIsMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`${
        isOpen && !isClosing ? "confirm__message" : "confirm__message--hidden"
      } ${isClosing ? "confirm__message--closing" : ""}`}
      onClick={handleOverlayClick}
      data-mode={mode}
    >
      <div className="confirm__ctn">
        <p className="confirm__text">{message}</p>
        <div className="confirm__btn-ctn">
          <button
            className="deny__btn"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="confirm__btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
