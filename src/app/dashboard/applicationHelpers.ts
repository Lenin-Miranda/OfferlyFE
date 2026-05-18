import { IconType } from "react-icons";
import { FiBookmark, FiCheckCircle, FiClock, FiSend } from "react-icons/fi";
import { Application, ApplicationStatus, ApplicationFormData } from "@/types";

export interface KanbanColumnConfig {
  id: string;
  title: string;
  statuses: ApplicationStatus[];
  color: "gray" | "blue" | "orange" | "green";
  icon: IconType;
}

export const CLOSED_STATUSES = [
  ApplicationStatus.REJECTED,
  ApplicationStatus.ACCEPTED,
  ApplicationStatus.WITHDRAWN,
  ApplicationStatus.GHOSTED,
];

export const IN_PROGRESS_STATUSES = [
  ApplicationStatus.INTERVIEWING,
  ApplicationStatus.OFFER,
];

export const kanbanColumns: KanbanColumnConfig[] = [
  {
    id: "saved",
    title: "Saved",
    statuses: [ApplicationStatus.SAVED],
    color: "gray",
    icon: FiBookmark,
  },
  {
    id: "applied",
    title: "Applied",
    statuses: [ApplicationStatus.APPLIED],
    color: "blue",
    icon: FiSend,
  },
  {
    id: "inprogress",
    title: "In Progress",
    statuses: IN_PROGRESS_STATUSES,
    color: "orange",
    icon: FiClock,
  },
  {
    id: "closed",
    title: "Closed",
    statuses: CLOSED_STATUSES,
    color: "green",
    icon: FiCheckCircle,
  },
];

export const applicationFocusFilters = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "active",
    label: "Active",
  },
  {
    id: "interviewing",
    label: "In Progress",
  },
  {
    id: "closed",
    label: "Closed",
  },
] as const;

export type ApplicationFocusFilter = (typeof applicationFocusFilters)[number]["id"];

export function getApplicationsByStatuses(
  applications: Application[],
  statuses: ApplicationStatus[],
) {
  return applications.filter((application) => statuses.includes(application.status));
}

export function getApplicationsForFocus(
  applications: Application[],
  focus: ApplicationFocusFilter,
) {
  switch (focus) {
    case "active":
      return applications.filter(
        (application) => !CLOSED_STATUSES.includes(application.status),
      );
    case "interviewing":
      return applications.filter((application) =>
        IN_PROGRESS_STATUSES.includes(application.status),
      );
    case "closed":
      return applications.filter((application) =>
        CLOSED_STATUSES.includes(application.status),
      );
    default:
      return applications;
  }
}

export function getStatusDisplayName(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.SAVED:
      return "Saved";
    case ApplicationStatus.APPLIED:
      return "Applied";
    case ApplicationStatus.INTERVIEWING:
      return "Interviewing";
    case ApplicationStatus.OFFER:
      return "Offer";
    case ApplicationStatus.REJECTED:
      return "Rejected";
    case ApplicationStatus.ACCEPTED:
      return "Accepted";
    case ApplicationStatus.WITHDRAWN:
      return "Withdrawn";
    case ApplicationStatus.GHOSTED:
      return "Ghosted";
    default:
      return "Unknown";
  }
}

export function getStatusClass(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.SAVED:
      return "status-saved";
    case ApplicationStatus.APPLIED:
      return "status-applied";
    case ApplicationStatus.INTERVIEWING:
      return "status-interviewing";
    case ApplicationStatus.OFFER:
      return "status-offer";
    case ApplicationStatus.REJECTED:
      return "status-rejected";
    case ApplicationStatus.GHOSTED:
      return "status-ghosted";
    default:
      return "status-applied";
  }
}

export function formatApplicationDate(dateString: string | Date | undefined) {
  if (!dateString) {
    return "Not specified";
  }

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

export function getApplicationOverviewStats(applications: Application[]) {
  const total = applications.length;
  const active = applications.filter(
    (application) => !CLOSED_STATUSES.includes(application.status),
  ).length;
  const interviewing = applications.filter((application) =>
    IN_PROGRESS_STATUSES.includes(application.status),
  ).length;
  const closed = applications.filter((application) =>
    CLOSED_STATUSES.includes(application.status),
  ).length;

  return {
    total,
    active,
    interviewing,
    closed,
  };
}

export function getRecentApplications(applications: Application[], limit = 4) {
  return [...applications]
    .sort((left, right) => {
      const leftTime = new Date(left.updatedAt || left.createdAt).getTime();
      const rightTime = new Date(right.updatedAt || right.createdAt).getTime();
      return rightTime - leftTime;
    })
    .slice(0, limit);
}

export function matchesApplicationSearch(
  application: Application,
  searchQuery: string,
) {
  if (!searchQuery.trim()) {
    return true;
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();
  return [application.company, application.position, application.location]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalizedQuery));
}

export type { ApplicationFormData };
