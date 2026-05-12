"use client";
import { createContext } from "react";
import { ErrorContextType } from "@/types";

export const ErrorContext = createContext<ErrorContextType>({
  errorMessage: "",
  setErrorMessage: () => {},
  isOpen: false,
  setIsOpen: () => {},
});
