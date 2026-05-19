import axios from "axios";
import { api } from "./axios";
import { Application, ApplicationPayload, ResumeTailorResponse } from "@/types";

interface ApplicationApiRecord extends Omit<Application, "id"> {
  _id?: string;
  id?: string;
}

interface ApplicationsResponse {
  apps?: ApplicationApiRecord[];
}

function normalizeApplication(app: ApplicationApiRecord): Application {
  return {
    ...app,
    id: app._id ?? app.id ?? "",
    userId: app.userId ?? "",
    status: app.status,
    company: app.company ?? "",
    position: app.position ?? "",
    createdAt: app.createdAt ?? "",
    updatedAt: app.updatedAt ?? "",
    appliedAt: app.appliedAt ?? null,
    ltcAnalysis: app.ltcAnalysis ?? null,
    analysisSkippedReason: app.analysisSkippedReason ?? null,
  };
}

export const getApplications = async (): Promise<Application[]> => {
  try {
    const response = await api.get<ApplicationsResponse>("/applications");
    return (response.data?.apps || []).map(normalizeApplication);
  } catch (e) {
    console.error(`Error Getting applications:`, e);
    return [];
  }
};

export async function addApplication(
  applicationData: ApplicationPayload,
): Promise<Application> {
  try {
    const response = await api.post<{ app: ApplicationApiRecord }>(
      "/applications",
      applicationData,
    );
    return normalizeApplication(response.data.app);
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
  updates: Partial<ApplicationPayload>,
): Promise<Application> {
  try {
    const res = await api.patch<{ app: ApplicationApiRecord }>(
      `/applications/${id}`,
      updates,
    );
    return normalizeApplication(res.data.app);
  } catch (e) {
    console.error("Error updating info:", e);
    throw new Error();
  }
}

export async function tailorResumeWithAI(
  resume: File,
  jobPost: string,
): Promise<ResumeTailorResponse> {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("jobPost", jobPost);

  try {
    const response = await api.post<ResumeTailorResponse>(
      "/applications/resume/tailor",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error tailoring resume:", error);

    if (axios.isAxiosError(error)) {
      const apiMessage =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "";

      throw new Error(
        apiMessage ||
          "We couldn't tailor your resume right now. Please try again in a moment.",
      );
    }

    throw new Error(
      "We couldn't tailor your resume right now. Please try again in a moment.",
    );
  }
}
