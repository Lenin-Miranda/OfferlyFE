"use client";
import { createContext } from "react";
import { ApplicationContextType } from "@/types";

export const ApplicationContext = createContext<ApplicationContextType>({
  applications: [],
  addApplication: async () => {
    throw new Error("ApplicationProvider not found");
  },
  deleteApplication: async () => {
    throw new Error("ApplicationProvider not found");
  },
  editApplication: async () => {
    throw new Error("ApplicationProvider not found");
  },
  isMessage: "",
  setIsMessage: () => {},
  messageType: "info",
  setMessageType: () => {},
});
