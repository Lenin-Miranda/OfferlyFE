import { api } from "./axios";
import { Profile, ProfileUpdatePayload } from "@/types";

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
): Promise<{ profile: Profile; message: string }> {
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
    .filter((item, index, array) => item.length > 0 && array.indexOf(item) === index);
}
