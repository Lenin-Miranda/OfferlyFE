"use client";

import Link from "next/link";
import { startTransition, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiTarget,
  FiZap,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import ApplicationModal from "../components/ApplicationModal";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import SuccessMessage from "@/app/components/SuccessMessage/SuccessMessage";
import MessageNotification from "../components/MessageNotification";
import ConfirmationMessage from "../components/ConfirmationMessage";
import LtcScoreCard from "../components/LtcScoreCard";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import { Application, ApplicationFormData } from "@/types";
import {
  applicationFocusFilters,
  ApplicationFocusFilter,
  formatApplicationDate,
  getDropStatusForColumn,
  getApplicationOverviewStats,
  getApplicationsByStatuses,
  getApplicationsForFocus,
  getKanbanColumnByStatus,
  getStatusClass,
  getStatusDisplayName,
  kanbanColumns,
  matchesApplicationSearch,
} from "../applicationHelpers";
import "./page.css";

function getApplicationIdentifier(application: Application) {
  return application._id || application.id;
}

function getCardTransitionName(applicationId: string) {
  const safeId = applicationId.replace(/[^a-zA-Z0-9_-]/g, "");
  return `application-card-${safeId || "unknown"}`;
}

function updateBoardWithTransition(update: () => void) {
  const documentWithTransition = document as Document & {
    startViewTransition?: (callback: () => void) => void;
  };

  if (typeof documentWithTransition.startViewTransition === "function") {
    documentWithTransition.startViewTransition(() => {
      flushSync(update);
    });
    return;
  }

  update();
}

export default function ApplicationsPage() {
  const {
    applications,
    editApplication,
    isMessage,
    setIsMessage,
    messageType,
    setMessageType,
  } = useContext(ApplicationContext);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [selectedAppForDelete, setSelectedAppForDelete] = useState<{
    id: string;
    company: string;
  } | null>(null);
  const [editConfirmationData, setEditConfirmationData] = useState<{
    isOpen: boolean;
    appData: ApplicationFormData;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusFilter, setFocusFilter] =
    useState<ApplicationFocusFilter>("all");
  const [boardApplications, setBoardApplications] =
    useState<Application[]>(applications);
  const [draggedApplicationId, setDraggedApplicationId] = useState<
    string | null
  >(null);
  const [draggedOverColumnId, setDraggedOverColumnId] = useState<string | null>(
    null,
  );
  const [updatingApplicationIds, setUpdatingApplicationIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (isMessage) {
      const timer = setTimeout(() => {
        setIsMessage("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isMessage, setIsMessage]);

  useEffect(() => {
    startTransition(() => {
      setBoardApplications(applications);
    });
  }, [applications]);

  const overviewStats = useMemo(
    () => getApplicationOverviewStats(boardApplications),
    [boardApplications],
  );
  const scopedApplications = useMemo(
    () => getApplicationsForFocus(boardApplications, focusFilter),
    [boardApplications, focusFilter],
  );
  const visibleApplications = useMemo(
    () =>
      scopedApplications.filter((application) =>
        matchesApplicationSearch(application, searchQuery),
      ),
    [scopedApplications, searchQuery],
  );

  const handleEditClick = (application: Application) => {
    setEditingApp(application);
  };

  const handleCloseModal = () => {
    setEditingApp(null);
  };

  const handleDeleteClick = (applicationId: string, companyName: string) => {
    setSelectedAppForDelete({ id: applicationId, company: companyName });
    setIsMessageOpen(true);
  };

  const moveApplicationToColumn = async (
    applicationId: string,
    targetColumnId: string,
  ) => {
    const targetStatus = getDropStatusForColumn(targetColumnId);
    const targetColumn = kanbanColumns.find((column) => column.id === targetColumnId);
    const application = boardApplications.find(
      (item) => getApplicationIdentifier(item) === applicationId,
    );

    if (!application || !targetStatus || !targetColumn) {
      return;
    }

    const currentColumnId = getKanbanColumnByStatus(application.status)?.id;
    if (currentColumnId === targetColumnId) {
      return;
    }

    const previousApplications = boardApplications;
    const nextStatus =
      targetColumnId === "closed" &&
      getKanbanColumnByStatus(application.status)?.id === "closed"
        ? application.status
        : targetStatus;

    updateBoardWithTransition(() => {
      setBoardApplications((currentApplications) =>
        currentApplications.map((item) =>
          getApplicationIdentifier(item) === applicationId
            ? { ...item, status: nextStatus }
            : item,
        ),
      );
    });

    setDraggedApplicationId(null);
    setDraggedOverColumnId(null);
    setUpdatingApplicationIds((currentIds) => [...currentIds, applicationId]);

    try {
      await editApplication(applicationId, { status: nextStatus });
      setMessageType("success");
      setIsMessage(
        `${application.company} moved to ${getStatusDisplayName(nextStatus)}.`,
      );
    } catch {
      updateBoardWithTransition(() => {
        setBoardApplications(previousApplications);
      });
      setMessageType("error");
      setIsMessage("We couldn't update the application status. Please try again.");
    } finally {
      setUpdatingApplicationIds((currentIds) =>
        currentIds.filter((id) => id !== applicationId),
      );
    }
  };

  const handleCloseConfirmation = () => {
    setIsMessageOpen(false);
    setSelectedAppForDelete(null);
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

  return (
    <>
      <Sidebar />
      <main className="applications-page">
        <section className="applications-page__hero" data-aos="fade-up">
          <div className="applications-page__hero-copy">
            <span className="applications-page__eyebrow">
              Applications Workspace
            </span>
            <h1 className="applications-page__title">
              Manage every application from one focused board
            </h1>
            <p className="applications-page__subtitle">
              Track status, update details, and keep your search organized with a
              workspace built for action instead of overview.
            </p>
          </div>

          <div className="applications-page__hero-actions">
            <Link
              href="/dashboard/applications/new"
              className="applications-page__button applications-page__button--primary"
            >
              <FiPlus />
              Add New Application
            </Link>
            <Link
              href="/dashboard/taylor"
              className="applications-page__button applications-page__button--secondary"
            >
              <FiZap />
              Open Taylor
            </Link>
          </div>
        </section>

        <section
          className="applications-page__stats"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          <article className="applications-page__stat-card">
            <FiTarget />
            <strong>{overviewStats.total}</strong>
            <span>Total tracked</span>
          </article>
          <article className="applications-page__stat-card">
            <FiClock />
            <strong>{overviewStats.active}</strong>
            <span>Active pipeline</span>
          </article>
          <article className="applications-page__stat-card">
            <FiCalendar />
            <strong>{visibleApplications.length}</strong>
            <span>Visible with current filters</span>
          </article>
        </section>

        <section
          className="applications-page__toolbar"
          data-aos="fade-up"
          data-aos-delay="140"
        >
          <div className="applications-page__search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by company, role, or location"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="applications-page__filters">
            {applicationFocusFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={
                  focusFilter === filter.id
                    ? "applications-page__filter applications-page__filter--active"
                    : "applications-page__filter"
                }
                onClick={() => setFocusFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section
          className="applications-page__board-shell"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="applications-page__board-head">
            <div>
              <span className="applications-page__board-eyebrow">
                Workspace Board
              </span>
              <h2>Application status board</h2>
            </div>
            <p>
              Edit or delete entries directly from the workflow board while
              keeping your search focused by filter or search term.
            </p>
          </div>

          <div className="applications-page__columns">
            {kanbanColumns.map((column) => {
              const columnApplications = getApplicationsByStatuses(
                visibleApplications,
                column.statuses,
              );

              return (
                <div
                  key={column.id}
                  className={`applications-page__column applications-page__column--${column.color}`}
                  data-aos="fade-up"
                  data-aos-delay="80"
                >
                  <div className="applications-page__column-head">
                    <div className="applications-page__column-label">
                      <column.icon className="applications-page__column-icon" />
                      <h3>{column.title}</h3>
                    </div>
                    <span className="applications-page__column-count">
                      {columnApplications.length}
                    </span>
                  </div>

                  <div
                    className={
                      draggedOverColumnId === column.id
                        ? "applications-page__cards applications-page__cards--drag-over"
                        : "applications-page__cards"
                    }
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (draggedApplicationId) {
                        event.dataTransfer.dropEffect = "move";
                      }
                    }}
                    onDragEnter={(event) => {
                      event.preventDefault();
                      if (draggedApplicationId) {
                        setDraggedOverColumnId(column.id);
                      }
                    }}
                    onDragLeave={(event) => {
                      if (
                        event.currentTarget.contains(event.relatedTarget as Node | null)
                      ) {
                        return;
                      }
                      setDraggedOverColumnId((currentColumnId) =>
                        currentColumnId === column.id ? null : currentColumnId,
                      );
                    }}
                    onDrop={async (event) => {
                      event.preventDefault();
                      const droppedApplicationId =
                        event.dataTransfer.getData("text/plain") ||
                        draggedApplicationId;

                      if (!droppedApplicationId) {
                        setDraggedOverColumnId(null);
                        return;
                      }

                      await moveApplicationToColumn(droppedApplicationId, column.id);
                    }}
                  >
                    {columnApplications.length > 0 ? (
                      columnApplications.map((application) => (
                        <div
                          key={getApplicationIdentifier(application)}
                          className={`applications-page__card ${getStatusClass(
                            application.status,
                          )} ${
                            draggedApplicationId === getApplicationIdentifier(application)
                              ? "applications-page__card--dragging"
                              : ""
                          } ${
                            updatingApplicationIds.includes(
                              getApplicationIdentifier(application),
                            )
                              ? "applications-page__card--updating"
                              : ""
                          }`}
                          draggable={
                            !updatingApplicationIds.includes(
                              getApplicationIdentifier(application),
                            )
                          }
                          onDragStart={(event) => {
                            const applicationId = getApplicationIdentifier(application);
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", applicationId);
                            setDraggedApplicationId(applicationId);
                          }}
                          onDragEnd={() => {
                            setDraggedApplicationId(null);
                            setDraggedOverColumnId(null);
                          }}
                          style={{
                            viewTransitionName: getCardTransitionName(
                              getApplicationIdentifier(application),
                            ),
                          }}
                        >
                          <div className="applications-page__card-head">
                            <h4>{application.company}</h4>
                            <span
                              className={`applications-page__status-dot ${getStatusClass(
                                application.status,
                              )}`}
                            />
                          </div>

                          <p className="applications-page__card-role">
                            {application.position}
                          </p>

                          <div className="applications-page__card-status">
                            <span>Status</span>
                            <strong
                              className={`applications-page__status-badge ${getStatusClass(
                                application.status,
                              )}`}
                            >
                              {getStatusDisplayName(application.status)}
                            </strong>
                          </div>

                          <div className="applications-page__card-details">
                            <div className="applications-page__detail-item">
                              <FiMapPin />
                              <span>{application.location || "Remote / TBD"}</span>
                            </div>
                            <div className="applications-page__detail-item">
                              <FiDollarSign />
                              <span>
                                {application.salary
                                  ? `${application.salary}`
                                  : "Compensation not added"}
                              </span>
                            </div>
                            <div className="applications-page__detail-item">
                              <FiCalendar />
                              <span>
                                {formatApplicationDate(application.appliedAt)}
                              </span>
                            </div>
                          </div>

                          <LtcScoreCard
                            application={application}
                            compact
                            onEditApplication={handleEditClick}
                            className="applications-page__ltc-card"
                          />

                          <div className="applications-page__card-actions">
                            <button
                              type="button"
                              className="applications-page__card-button applications-page__card-button--edit"
                              onClick={() => handleEditClick(application)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="applications-page__card-button applications-page__card-button--delete"
                              onClick={() =>
                                handleDeleteClick(
                                  getApplicationIdentifier(application),
                                  application.company,
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="applications-page__empty-column">
                        No applications match this column right now.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
          message={`Are you sure you want to delete the application for ${selectedAppForDelete.company}? This action cannot be undone.`}
          isOpen={isMessageOpen}
          onClose={handleCloseConfirmation}
          mode="delete"
          id={selectedAppForDelete.id}
          changes={{}}
        />
      ) : null}

      {editConfirmationData ? (
        <ConfirmationMessage
          message={`Are you sure you want to update the application for ${editConfirmationData.appData.company}?`}
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
