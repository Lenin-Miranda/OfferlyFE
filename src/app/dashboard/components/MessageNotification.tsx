"use client";
import FeedbackMessage from "@/app/components/FeedbackMessage/FeedbackMessage";
import { MessageNotificationProps } from "@/types";

export default function MessageNotification({
  message,
  type = "info",
  onClose,
}: MessageNotificationProps) {
  return <FeedbackMessage message={message} type={type} onClose={onClose} />;
}
