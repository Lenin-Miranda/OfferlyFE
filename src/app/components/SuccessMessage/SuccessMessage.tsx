"use client";

import FeedbackMessage from "../FeedbackMessage/FeedbackMessage";

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
}

export default function SuccessMessage({
  message,
  onClose,
}: SuccessMessageProps) {
  return <FeedbackMessage message={message} type="success" onClose={onClose} />;
}
