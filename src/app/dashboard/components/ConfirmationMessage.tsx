"use client";
import { useContext, useState } from "react";
import { Application } from "@/types";
import { ApplicationContext } from "@/contexts/ApplicationContext";

export default function ConfirmationMessage({
  message,
  mode,
  id,
  changes,
}: {
  message: string;
  mode?: "delete" | "edit";
  id: string;
  changes: Partial<
    Omit<Application, "id" | "userId" | "createdAt" | "updatedAt">
  >;
}) {
  const { deleteApplication, editApplication, setIsMessage, setMessageType } =
    useContext(ApplicationContext);
  async function handleSubmit() {
    try {
      if (mode === "delete") {
        await deleteApplication(id);
        setMessageType("success");
        setIsMessage("Application deleted successfully!");
      } else {
        await editApplication(id, changes);
        setMessageType("success");
        setIsMessage("Application updated successfully!");
      }
    } catch (e) {
      console.error("Error Message:", e);
      setMessageType("error");
      setIsMessage("An error occurred. Please try again.");
    }
  }
  return (
    <div className="confirm__message">
      <div className="confirm__ctn">
        <p className="confirm__text">{message}</p>
        <div className="confirm__btn-ctn">
          <button className="deny__btn">Cancel</button>
          <button className="confirm__btn">Confirm</button>
        </div>
      </div>
    </div>
  );
}
