import { api } from "./axios";
import { Profile, ProfileMutationResult, ProfileUpdatePayload } from "@/types";

interface ProfileResponse {
  profile?: Partial<Profile> | null;
  message?: string;
}

export const EMPTY_PROFILE: Profile = {
  userId: "",
  email: "",
  fullName: "",
  location: "",
  summary: "",
  skills: [],
  yearsExperience: 0,
  targetRoles: [],
  preferredLocations: [],
  remotePreference: "unspecified",
  workAuthorization: "",
};

function normalizeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function normalizeProfile(profile?: Partial<Profile> | null): Profile {
  if (!profile) {
    return EMPTY_PROFILE;
  }

  return {
    userId: profile.userId ?? "",
    email: profile.email ?? "",
    fullName: profile.fullName ?? "",
    location: profile.location ?? "",
    summary: profile.summary ?? "",
    skills: normalizeStringArray(profile.skills),
    yearsExperience:
      typeof profile.yearsExperience === "number" ? profile.yearsExperience : 0,
    targetRoles: normalizeStringArray(profile.targetRoles),
    preferredLocations: normalizeStringArray(profile.preferredLocations),
    remotePreference: profile.remotePreference ?? "unspecified",
    workAuthorization: profile.workAuthorization ?? "",
  };
}

export async function getProfile(): Promise<Profile> {
  const response = await api.get<ProfileResponse>("/profile");
  return normalizeProfile(response.data.profile);
}

export async function updateProfile(
  updates: ProfileUpdatePayload,
): Promise<ProfileMutationResult> {
  const response = await api.patch<ProfileResponse>("/profile", updates);

  return {
    profile: normalizeProfile(response.data.profile),
    message: response.data.message || "Profile updated successfully",
  };
}

export function parseCommaSeparatedList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(
      (item, index, array) => item.length > 0 && array.indexOf(item) === index,
    );
}

export async function summarizeResumeToProfile(
  resumeFile: File,
): Promise<ProfileMutationResult> {
  const formData = new FormData();
  formData.append("resume", resumeFile);

  try {
    const baseUrl = api.defaults.baseURL ?? "";
    const response = await fetch(`${baseUrl}/profile/summarize-resume`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = (await response.json().catch(() => null)) as
      | ProfileResponse
      | { message?: string }
      | null;

    if (!response.ok) {
      const apiMessage =
        data && typeof data.message === "string" ? data.message : "";

      if (apiMessage) {
        throw new Error(apiMessage);
      }

      if (response.status === 400) {
        throw new Error("Please upload a valid PDF resume and try again.");
      }

      if (response.status === 401) {
        throw new Error("Your session expired. Please sign in and try again.");
      }

      throw new Error(
        "We couldn't analyze your resume right now. Please try again in a moment.",
      );
    }

    const profileData =
      data && "profile" in data ? data.profile : undefined;

    return {
      profile: normalizeProfile(profileData),
      message:
        data?.message ||
        "Profile updated with summarized resume data successfully",
    };
  } catch (error) {
    console.error("Error summarizing resume into profile:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "We couldn't analyze your resume right now. Please try again in a moment.",
    );
  }
}
