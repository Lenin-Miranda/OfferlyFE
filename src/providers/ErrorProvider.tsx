"use client";
import { useState } from "react";
import { ErrorContext } from "@/contexts/ErrorContext";
import { ErrorContextType } from "@/types";

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ErrorContext.Provider
      value={{ errorMessage, setErrorMessage, isOpen, setIsOpen }}
    >
      {children}
    </ErrorContext.Provider>
  );
}
