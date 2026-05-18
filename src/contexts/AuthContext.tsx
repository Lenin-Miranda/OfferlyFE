"use client";
import { createContext } from "react";
import { AuthContextType } from "@/types/index";

export const AuthContext = createContext({
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
} as AuthContextType);
