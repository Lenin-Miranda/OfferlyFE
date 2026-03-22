"use client";
import { useState, useEffect } from "react";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import {
  getApplications,
  editApplication,
  deleteApplication,
  addApplication,
} from "@/lib/application";
import { Application } from "@/types";

export function ApplicationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isMessage, setIsMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info",
  );

  useEffect(() => {
    handleApplications();
  }, []);

  const handleApplications = async () => {
    try {
      const apps = await getApplications();
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (e) {
      console.error("Error deleting application:", e);
      throw e;
    }
  };

  const handleAddApplication = async (
    applicationData: Omit<
      Application,
      "id" | "userId" | "createdAt" | "updatedAt"
    >,
  ): Promise<Application> => {
    try {
      const newApplication = await addApplication(applicationData);
      setApplications((prev) => [...prev, newApplication]);
      return newApplication;
    } catch (e) {
      console.error("Error adding application", e);
      throw e;
    }
  };

  const handleEditApplication = async (
    id: string,
    updates: Partial<
      Omit<Application, "id" | "userId" | "createdAt" | "updatedAt">
    >,
  ): Promise<Application> => {
    try {
      const updatedApplication = await editApplication(id, updates);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updatedApplication : app)),
      );
      return updatedApplication;
    } catch (e) {
      console.error("Error updating application", e);
      throw e;
    }
  };

  const value = {
    applications,
    addApplication: handleAddApplication,
    deleteApplication: handleDeleteApplication,
    editApplication: handleEditApplication,
    isMessage,
    setIsMessage,
    messageType,
    setMessageType,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}
