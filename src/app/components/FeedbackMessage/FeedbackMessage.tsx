"use client";

import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";
import { MessageNotificationProps } from "@/types";
import "./FeedbackMessage.css";

function getIcon(type: NonNullable<MessageNotificationProps["type"]>) {
  switch (type) {
    case "success":
      return <FiCheckCircle className="feedback-message__icon" />;
    case "error":
      return <FiAlertCircle className="feedback-message__icon" />;
    default:
      return <FiInfo className="feedback-message__icon" />;
  }
}

export default function FeedbackMessage({
  message,
  type = "info",
  onClose,
}: MessageNotificationProps) {
  return (
    <div className={`feedback-message feedback-message--${type}`}>
      <div className="feedback-message__content">
        {getIcon(type)}
        <span className="feedback-message__text">{message}</span>
      </div>
      {onClose ? (
        <button
          type="button"
          className="feedback-message__close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
