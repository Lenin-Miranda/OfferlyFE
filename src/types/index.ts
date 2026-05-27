export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => void | Promise<void>;
  initialData?: Partial<Application> | null;
  mode?: "create" | "edit";
}

export interface ApplicationContextType {
  applications: Application[];
  addApplication: (applicationData: ApplicationPayload) => Promise<Application>;
  deleteApplication: (id: string) => Promise<void>;
  editApplication: (
    id: string,
    updates: Partial<ApplicationPayload>,
  ) => Promise<Application>;
  isMessage: string;
  setIsMessage: (message: string) => void;
  messageType: "success" | "error" | "info";
  setMessageType: (type: "success" | "error" | "info") => void;
}

export type RemotePreference =
  | "remote"
  | "hybrid"
  | "onsite"
  | "flexible"
  | "unspecified";

export interface Profile {
  userId: string;
  email: string;
  fullName: string;
  location: string;
  summary: string;
  skills: string[];
  yearsExperience: number;
  targetRoles: string[];
  preferredLocations: string[];
  remotePreference: RemotePreference;
  workAuthorization: string;
}

export interface ProfileMutationResult {
  profile: Profile;
  message: string;
}

export type ProfileUpdatePayload = Partial<
  Omit<Profile, "userId" | "email">
>;

export type LtcRecommendation = "apply" | "consider" | "skip";

export interface LtcAnalysis {
  score: number;
  recommendation: LtcRecommendation | string;
  summary: string;
  matchedSignals: string[];
  gaps: string[];
  missingProfileSignals: string[];
  generatedAt: string;
}

export interface Application {
  id: string;
  _id?: string;
  userId: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  location?: string;
  salary?: number;
  currency?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  appliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  ltcAnalysis?: LtcAnalysis | null;
  analysisSkippedReason?: string | null;
}

export interface ApplicationPayload {
  company: string;
  position: string;
  status: ApplicationStatus;
  location?: string;
  salary?: number;
  currency?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  appliedAt?: string | null;
}

export type ApplicationFormData = ApplicationPayload & {
  _id?: string;
  id?: string;
};

export enum ApplicationStatus {
  SAVED = "saved",
  APPLIED = "applied",
  INTERVIEWING = "interviewing",
  OFFER = "offer",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  WITHDRAWN = "withdrawn",
  GHOSTED = "ghosted",
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ResumeTailorChange {
  lineId: string;
  page: number;
  originalText: string;
  replacementText: string;
  reason: string;
}

export interface ResumeTailorSkippedChange {
  lineId: string;
  page: number;
  originalText: string;
  attemptedText: string;
  reason: string;
  skippedBecause: string;
}

export interface ResumeTailorNotes {
  preservedLayout: string;
}

export interface ResumeTailorResponse {
  fileName: string;
  mimeType: "application/pdf";
  pdfBase64: string;
  summary: string;
  changes: ResumeTailorChange[];
  skippedChanges: ResumeTailorSkippedChange[];
  notes: ResumeTailorNotes;
}

export interface MessageNotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

export type { ErrorContextType, ErrorMessageProps } from "./errorTypes";
