"use client";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import "./MessageNotification.css";
import { MessageNotificationProps } from "@/types";

export default function MessageNotification({
  message,
  type = "info",
  onClose,
}: MessageNotificationProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="message__icon" />;
      case "error":
        return <FiAlertCircle className="message__icon" />;
      default:
        return <FiInfo className="message__icon" />;
    }
  };

  return (
    <div className={`message-notification ${type}`}>
      <div className="message__content">
        {getIcon()}
        <span className="message__text">{message}</span>
      </div>
      {onClose && (
        <button className="message__close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}
