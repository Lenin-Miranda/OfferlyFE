"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import LtcScoreCard from "./LtcScoreCard";
import { Application } from "@/types";
import "./LtcScoreModal.css";

interface LtcScoreModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LtcScoreModal({
  application,
  isOpen,
  onClose,
}: LtcScoreModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 220);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose, isOpen]);

  if (!application && !isOpen) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  if (!application) {
    return null;
  }

  return (
    <div
      className={`ltc-modal ${isClosing ? "ltc-modal--closing" : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ltc-modal-title"
    >
      <div className={`ltc-modal__panel ${isClosing ? "ltc-modal__panel--closing" : ""}`}>
        <div className="ltc-modal__header">
          <div className="ltc-modal__copy">
            <span className="ltc-modal__eyebrow">LTC Score</span>
            <h2 id="ltc-modal-title" className="ltc-modal__title">
              {application.company}
            </h2>
            <p className="ltc-modal__subtitle">
              {application.position}
            </p>
          </div>

          <button
            type="button"
            className="ltc-modal__close"
            onClick={handleClose}
            aria-label="Close LTC score modal"
          >
            <X />
          </button>
        </div>

        <div className="ltc-modal__body">
          <LtcScoreCard application={application} />
        </div>
      </div>
    </div>
  );
}
