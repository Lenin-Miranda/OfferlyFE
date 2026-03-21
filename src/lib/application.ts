import { api } from "./axios";
import { Application } from "@/types";

export const getApplications = async (): Promise<Application[]> => {
  try {
    const response = await api.get("/applications");
    return (response.data?.apps || []).map((app: any) => ({
      ...app,
      id: app._id,
    }));
  } catch (e) {
    console.error(`Error Getting applications: ${e}`);
    return [];
  }
};

export async function addApplication(
  applicationData: Omit<
    Application,
    "id" | "userId" | "createdAt" | "updatedAt"
  >,
): Promise<Application> {
  try {
    const response = await api.post("/applications", applicationData);
    return response.data.app;
  } catch (error) {
    console.error("Error adding application:", error);
    throw error;
  }
}

export async function deleteApplication(id: string): Promise<void> {
  try {
    const response = await api.delete(`/applications/${id}`);
    return response.data.app;
  } catch (e) {
    console.error("Error deleting application", e);
    throw new Error();
  }
}

export async function editApplication(
  id: string,
  updates: Partial<
    Omit<Application, "id" | "userId" | "createdAt" | "updatedAt">
  >,
): Promise<Application> {
  try {
    const res = await api.patch(`/applications/${id}`, updates);
    return res.data.app;
  } catch (e) {
    console.error("Error updating info", e);
    throw new Error();
  }
}
