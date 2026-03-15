"use client";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import "./LogoutButton.css";

export default function LogoutButton() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) return null;

  return (
    <button className="logout-btn" onClick={logout}>
      Logout
    </button>
  );
}
