"use client";
import React, { useState, useEffect } from "react";
import { login, register, logout, checkAuth } from "@/lib/auth";
import { AuthContext } from "@/contexts/AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuthStatus = async () => {
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);
    };
    checkAuthStatus();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);

    const authenticated = await checkAuth();
    setIsAuthenticated(authenticated);
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ) => {
    await register(name, email, password);
    const authenticated = await checkAuth();
    setIsAuthenticated(authenticated);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
