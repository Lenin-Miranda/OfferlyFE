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

export interface JobApplication {
  id: string;
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
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

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
