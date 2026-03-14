import { createContext } from "react";
import { AuthContextType } from "@/types/index";

export const AuthContext = createContext({
  isAuthenticated: false,
  login: async (_email: string, _password: string) => {},
  register: async (_name: string, _email: string, _password: string) => {},
  logout: async () => {},
} as AuthContextType);
