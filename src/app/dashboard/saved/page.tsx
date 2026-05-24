"use client";

import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBookmark,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiExternalLink,
  FiFileText,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiSend,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import ApplicationModal from "../components/ApplicationModal";
import ConfirmationMessage from "../components/ConfirmationMessage";
import MessageNotification from "../components/MessageNotification";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import SuccessMessage from "@/app/components/SuccessMessage/SuccessMessage";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import { Application, ApplicationFormData, ApplicationStatus } from "@/types";
import {
  formatApplicationDate,
  getRecentActivityCount,
  getRecentApplications,
  getStatusClass,
  getStatusDisplayName,
  matchesApplicationSearch,
} from "../applicationHelpers";
import "./page.css";

const savedQueueFilters = [
  { id: "all", label: "All saved" },
  { id: "with-link", label: "With link" },
  { id: "with-notes", label: "With notes" },
  { id: "recent", label: "Recent" },
] as const;

type SavedQueueFilter = (typeof savedQueueFilters)[number]["id"];

function getApplicationIdentifier(application: Application) {
  return application._id || application.id;
}

function isRecentSavedJob(application: Application) {
  const activityDate = application.updatedAt || application.createdAt;
  const timestamp = new Date(activityDate).getTime();

  if (Number.isNaN(timestamp)) {
    return false;
  }

  const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp <= twoWeeksInMs;
}

function SavedJobCard({
  application,
  isUpdating,
  onEdit,
  onDelete,
  onMarkApplied,
}: {
  application: Application;
  isUpdating: boolean;
  onEdit: (application: Application) => void;
  onDelete: (applicationId: string, companyName: string) => void;
  onMarkApplied: (application: Application) => void;
}) {
  return (
    <article
      className={`saved-page__card ${getStatusClass(application.status)} ${
        isUpdating ? "saved-page__card--updating" : ""
      }`}
    >
      <div className="saved-page__card-head">
        <div>
          <h3>{application.company}</h3>
          <p>{application.position}</p>
        </div>
        <span
          className={`saved-page__status-badge ${getStatusClass(application.status)}`}
        >
          {getStatusDisplayName(application.status)}
        </span>
      </div>

      <div className="saved-page__card-details">
        <div className="saved-page__detail-item">
          <FiMapPin />
          <span>{application.location || "Remote / TBD"}</span>
        </div>
        <div className="saved-page__detail-item">
          <FiDollarSign />
          <span>
            {typeof application.salary === "number"
              ? `${application.salary}`
              : "Compensation not added"}
          </span>
        </div>
        <div className="saved-page__detail-item">
          <FiCalendar />
          <span>
            Saved {formatApplicationDate(application.updatedAt || application.createdAt)}
          </span>
        </div>
      </div>

      {application.notes ? (
        <div className="saved-page__note">
          <FiFileText />
          <p>{application.notes}</p>
        </div>
      ) : (
        <div className="saved-page__note saved-page__note--empty">
          Add a note to remember why this role made the shortlist.
        </div>
      )}

      <div className="saved-page__card-footer">
        {application.jobUrl ? (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="saved-page__link"
          >
            View job post
            <FiExternalLink />
          </a>
        ) : (
          <span className="saved-page__link saved-page__link--muted">
            No job link added yet
          </span>
        )}

        <div className="saved-page__card-actions">
          <button
            type="button"
            className="saved-page__card-button saved-page__card-button--primary"
            onClick={() => onMarkApplied(application)}
            disabled={isUpdating}
          >
            <FiSend />
            Mark Applied
          </button>
          <button
            type="button"
            className="saved-page__card-button saved-page__card-button--secondary"
            onClick={() => onEdit(application)}
            disabled={isUpdating}
          >
            Edit
          </button>
          <button
            type="button"
            className="saved-page__card-button saved-page__card-button--danger"
            onClick={() =>
              onDelete(getApplicationIdentifier(application), application.company)
            }
            disabled={isUpdating}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default function SavedJobsPage() {
  const {
    applications,
    editApplication,
    isMessage,
    setIsMessage,
    messageType,
    setMessageType,
  } = useContext(ApplicationContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [queueFilter, setQueueFilter] = useState<SavedQueueFilter>("all");
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [selectedAppForDelete, setSelectedAppForDelete] = useState<{
    id: string;
    company: string;
  } | null>(null);
  const [editConfirmationData, setEditConfirmationData] = useState<{
    isOpen: boolean;
    appData: ApplicationFormData;
  } | null>(null);
  const [updatingApplicationIds, setUpdatingApplicationIds] = useState<
    Set<string>
  >(() => new Set());

  useEffect(() => {
    if (!isMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setIsMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [isMessage, setIsMessage]);

  const savedApplications = useMemo(
    () =>
      applications
        .filter((application) => application.status === ApplicationStatus.SAVED)
        .sort((left, right) => {
          const leftTime = new Date(left.updatedAt || left.createdAt).getTime();
          const rightTime = new Date(right.updatedAt || right.createdAt).getTime();
          return rightTime - leftTime;
        }),
    [applications],
  );

  const visibleSavedApplications = useMemo(() => {
    return savedApplications.filter((application) => {
      const matchesQuery = matchesApplicationSearch(application, searchQuery);

      if (!matchesQuery) {
        return false;
      }

      switch (queueFilter) {
        case "with-link":
          return Boolean(application.jobUrl);
        case "with-notes":
          return Boolean(application.notes?.trim());
        case "recent":
          return isRecentSavedJob(application);
        default:
          return true;
      }
    });
  }, [queueFilter, savedApplications, searchQuery]);

  const recentSavedApplications = useMemo(
    () => getRecentApplications(savedApplications, 3),
    [savedApplications],
  );

  const savedWithLinks = useMemo(
    () => savedApplications.filter((application) => application.jobUrl).length,
    [savedApplications],
  );
  const savedWithNotes = useMemo(
    () =>
      savedApplications.filter((application) => application.notes?.trim()).length,
    [savedApplications],
  );
  const recentlyUpdatedSavedJobs = useMemo(
    () => getRecentActivityCount(savedApplications, 14),
    [savedApplications],
  );

  const handleEditClick = (application: Application) => {
    setEditingApp(application);
  };

  const handleDeleteClick = (applicationId: string, companyName: string) => {
    setSelectedAppForDelete({ id: applicationId, company: companyName });
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
    setSelectedAppForDelete(null);
  };

  const handleCloseModal = () => {
    setEditingApp(null);
  };

  const handleCloseEditConfirmation = () => {
    setEditConfirmationData(null);
  };

  const handleModalSubmit = async (data: ApplicationFormData) => {
    if (!data.company || !data.position || !data.status) {
      setMessageType("error");
      setIsMessage(
        "Please fill in all required fields: Company, Position, and Status.",
      );
      throw new Error("Missing required application fields");
    }

    setEditConfirmationData({
      isOpen: true,
      appData: data,
    });
  };

  const handleMarkApplied = async (application: Application) => {
    const applicationId = getApplicationIdentifier(application);

    setUpdatingApplicationIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(applicationId);
      return nextIds;
    });

    try {
      await editApplication(applicationId, {
        status: ApplicationStatus.APPLIED,
        appliedAt: application.appliedAt || new Date().toISOString(),
      });
      setMessageType("success");
      setIsMessage(`${application.company} moved from saved to applied.`);
    } catch {
      setMessageType("error");
      setIsMessage("We couldn't move this role to applied. Please try again.");
    } finally {
      setUpdatingApplicationIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(applicationId);
        return nextIds;
      });
    }
  };

  const queueInsights = [
    `${savedApplications.length} saved role${savedApplications.length === 1 ? "" : "s"} ready to review.`,
    `${savedWithLinks} saved job${savedWithLinks === 1 ? "" : "s"} already include a direct job link.`,
    `${savedWithNotes} saved role${savedWithNotes === 1 ? "" : "s"} have notes attached for later context.`,
  ];

  return (
    <>
      <Sidebar />
      <main className="saved-page">
        <section className="saved-page__hero" data-aos="fade-up">
          <div className="saved-page__hero-copy">
            <span className="saved-page__eyebrow">Saved Jobs</span>
            <h1 className="saved-page__title">
              Keep your shortlist clean before you start applying
            </h1>
            <p className="saved-page__subtitle">
              Review the roles you bookmarked, tighten the details that matter,
              and push the right ones into your active application pipeline.
            </p>
          </div>

          <div className="saved-page__hero-actions">
            <Link
              href="/dashboard/applications/new"
              className="saved-page__button saved-page__button--primary"
            >
              <FiPlus />
              Save New Job
            </Link>
            <Link
              href="/dashboard/applications"
              className="saved-page__button saved-page__button--secondary"
            >
              Open Applications
              <FiArrowRight />
            </Link>
          </div>
        </section>

        <section className="saved-page__stats" data-aos="fade-up" data-aos-delay="80">
          <article className="saved-page__stat-card">
            <FiBookmark />
            <strong>{savedApplications.length}</strong>
            <span>Total saved jobs</span>
          </article>
          <article className="saved-page__stat-card">
            <FiClock />
            <strong>{recentlyUpdatedSavedJobs}</strong>
            <span>Updated in the last 14 days</span>
          </article>
          <article className="saved-page__stat-card">
            <FiSearch />
            <strong>{visibleSavedApplications.length}</strong>
            <span>Visible with current filters</span>
          </article>
        </section>

        <section
          className="saved-page__toolbar"
          data-aos="fade-up"
          data-aos-delay="140"
        >
          <div className="saved-page__search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by company, role, or location"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="saved-page__filters">
            {savedQueueFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={
                  queueFilter === filter.id
                    ? "saved-page__filter saved-page__filter--active"
                    : "saved-page__filter"
                }
                onClick={() => setQueueFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className="saved-page__content" data-aos="fade-up" data-aos-delay="200">
          <article className="saved-page__panel saved-page__panel--queue">
            <div className="saved-page__panel-head">
              <div>
                <span className="saved-page__panel-eyebrow">Saved queue</span>
                <h2>Roles waiting for the next move</h2>
              </div>
              <p>
                Edit details, open the original post, or mark a role as applied
                the moment it leaves your shortlist.
              </p>
            </div>

            {savedApplications.length === 0 ? (
              <div className="saved-page__empty-state">
                <h3>No saved jobs yet</h3>
                <p>
                  Start by adding a job with status <strong>Saved</strong> so it
                  shows up here.
                </p>
                <Link
                  href="/dashboard/applications/new"
                  className="saved-page__button saved-page__button--primary"
                >
                  <FiPlus />
                  Add First Saved Job
                </Link>
              </div>
            ) : visibleSavedApplications.length > 0 ? (
              <div className="saved-page__grid">
                {visibleSavedApplications.map((application) => (
                  <SavedJobCard
                    key={getApplicationIdentifier(application)}
                    application={application}
                    isUpdating={updatingApplicationIds.has(
                      getApplicationIdentifier(application),
                    )}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onMarkApplied={handleMarkApplied}
                  />
                ))}
              </div>
            ) : (
              <div className="saved-page__empty-results">
                No saved jobs match the current search or filter.
              </div>
            )}
          </article>

          <aside className="saved-page__panel saved-page__panel--insights">
            <div className="saved-page__panel-head">
              <div>
                <span className="saved-page__panel-eyebrow">Queue signals</span>
                <h2>What stands out</h2>
              </div>
            </div>

            <div className="saved-page__insight-list">
              {queueInsights.map((insight) => (
                <p key={insight} className="saved-page__insight-item">
                  {insight}
                </p>
              ))}
            </div>

            <div className="saved-page__recent">
              <div className="saved-page__recent-head">
                <span className="saved-page__panel-eyebrow">Latest saves</span>
              </div>

              {recentSavedApplications.length > 0 ? (
                recentSavedApplications.map((application) => (
                  <div
                    key={getApplicationIdentifier(application)}
                    className="saved-page__recent-item"
                  >
                    <div>
                      <strong>{application.company}</strong>
                      <p>{application.position}</p>
                    </div>
                    <small>
                      {formatApplicationDate(
                        application.updatedAt || application.createdAt,
                      )}
                    </small>
                  </div>
                ))
              ) : (
                <p className="saved-page__recent-empty">
                  Your newest saved jobs will appear here.
                </p>
              )}
            </div>
          </aside>
        </section>
      </main>

      <ApplicationModal
        isOpen={Boolean(editingApp)}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        mode="edit"
        initialData={editingApp}
      />

      {isMessage && messageType === "success" ? (
        <SuccessMessage message={isMessage} onClose={() => setIsMessage("")} />
      ) : null}

      {isMessage && messageType === "error" ? (
        <ErrorMessage message={isMessage} onClose={() => setIsMessage("")} />
      ) : null}

      {isMessage && messageType === "info" ? (
        <MessageNotification
          message={isMessage}
          type="info"
          onClose={() => setIsMessage("")}
        />
      ) : null}

      {selectedAppForDelete ? (
        <ConfirmationMessage
          message={`Are you sure you want to delete the saved job for ${selectedAppForDelete.company}? This action cannot be undone.`}
          isOpen={isDeleteConfirmationOpen}
          onClose={handleCloseDeleteConfirmation}
          mode="delete"
          id={selectedAppForDelete.id}
          changes={{}}
        />
      ) : null}

      {editConfirmationData ? (
        <ConfirmationMessage
          message={`Are you sure you want to update the saved job for ${editConfirmationData.appData.company}?`}
          isOpen={editConfirmationData.isOpen}
          onClose={handleCloseEditConfirmation}
          mode="edit"
          id={editConfirmationData.appData._id || editConfirmationData.appData.id || ""}
          changes={editConfirmationData.appData}
        />
      ) : null}
    </>
  );
}
