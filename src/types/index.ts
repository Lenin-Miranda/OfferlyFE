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
  onSubmit: (data: ApplicationFormData) => void;
  initialData?: Partial<Application> | null;
  mode?: "create" | "edit";
}

export interface ApplicationContextType {
  applications: Application[];
  addApplication: (
    applicationData: Omit<
      Application,
      "id" | "userId" | "createdAt" | "updatedAt"
    >,
  ) => Promise<Application>;
  deleteApplication: (id: string) => Promise<void>;
  editApplication: (
    id: string,
    updates: Partial<
      Omit<Application, "id" | "userId" | "createdAt" | "updatedAt">
    >,
  ) => Promise<Application>;
  isMessage: string;
  setIsMessage: (message: string) => void;
  messageType: "success" | "error" | "info";
  setMessageType: (type: "success" | "error" | "info") => void;
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
  appliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationFormData = Partial<Application> &
  Pick<Application, "company" | "position" | "status"> & {
    _id?: string;
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
