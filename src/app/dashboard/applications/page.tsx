"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
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

function getEmptyColumnBuckets() {
  return Object.fromEntries(
    kanbanColumns.map((column) => [column.id, [] as Application[]]),
  ) as Record<string, Application[]>;
}

function isKanbanColumnId(value: string | null) {
  return value ? kanbanColumns.some((column) => column.id === value) : false;
}

function ApplicationCardContent({
  application,
  onEditApplication,
  onDeleteApplication,
  showInsights = true,
  showActions = true,
}: {
  application: Application;
  onEditApplication?: (application: Application) => void;
  onDeleteApplication?: (applicationId: string, companyName: string) => void;
  showInsights?: boolean;
  showActions?: boolean;
}) {
  return (
    <>
      <div className="applications-page__card-head">
        <h4>{application.company}</h4>
        <span
          className={`applications-page__status-dot ${getStatusClass(
            application.status,
          )}`}
        />
      </div>

      <p className="applications-page__card-role">{application.position}</p>

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
          <span>{formatApplicationDate(application.appliedAt)}</span>
        </div>
      </div>

      {showInsights ? (
        <LtcScoreCard
          application={application}
          compact
          onEditApplication={onEditApplication}
          className="applications-page__ltc-card"
        />
      ) : null}

      {showActions && onEditApplication && onDeleteApplication ? (
        <div className="applications-page__card-actions">
          <button
            type="button"
            className="applications-page__card-button applications-page__card-button--edit"
            onClick={() => onEditApplication(application)}
          >
            Edit
          </button>
          <button
            type="button"
            className="applications-page__card-button applications-page__card-button--delete"
            onClick={() =>
              onDeleteApplication(
                getApplicationIdentifier(application),
                application.company,
              )
            }
          >
            Delete
          </button>
        </div>
      ) : null}
    </>
  );
}

function DraggableApplicationCard({
  application,
  isUpdating,
  isActive,
  onEditApplication,
  onDeleteApplication,
}: {
  application: Application;
  isUpdating: boolean;
  isActive: boolean;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (applicationId: string, companyName: string) => void;
}) {
  const applicationId = getApplicationIdentifier(application);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useDraggable({
      id: applicationId,
      disabled: isUpdating,
    });

  return (
    <div
      ref={setNodeRef}
      className={`applications-page__card ${getStatusClass(application.status)} ${
        isDragging || isActive ? "applications-page__card--dragging" : ""
      } ${isUpdating ? "applications-page__card--updating" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        viewTransitionName: getCardTransitionName(applicationId),
      }}
      {...listeners}
      {...attributes}
    >
      <ApplicationCardContent
        application={application}
        onEditApplication={onEditApplication}
        onDeleteApplication={onDeleteApplication}
      />
    </div>
  );
}

function DroppableColumnBody({
  columnId,
  isDragActive,
  isHighlighted,
  children,
}: {
  columnId: string;
  isDragActive: boolean;
  isHighlighted: boolean;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: columnId,
    disabled: !isDragActive,
  });

  return (
    <div
      ref={setNodeRef}
      className={`applications-page__cards ${
        isDragActive ? "applications-page__cards--drop-ready" : ""
      } ${isOver || isHighlighted ? "applications-page__cards--drag-over" : ""}`}
    >
      {children}
    </div>
  );
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
    Set<string>
  >(() => new Set());
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

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
  const visibleApplicationsByColumn = useMemo(() => {
    const groupedApplications = getEmptyColumnBuckets();

    visibleApplications.forEach((application) => {
      const columnId = getKanbanColumnByStatus(application.status)?.id;

      if (!columnId) {
        return;
      }

      groupedApplications[columnId].push(application);
    });

    return groupedApplications;
  }, [visibleApplications]);
  const activeApplication = useMemo(
    () =>
      draggedApplicationId
        ? boardApplications.find(
            (application) =>
              getApplicationIdentifier(application) === draggedApplicationId,
          ) || null
        : null,
    [boardApplications, draggedApplicationId],
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
    setUpdatingApplicationIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(applicationId);
      return nextIds;
    });

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
      setUpdatingApplicationIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(applicationId);
        return nextIds;
      });
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

  const handleDragStart = ({ active }: DragStartEvent) => {
    const applicationId = String(active.id);
    const application = boardApplications.find(
      (item) => getApplicationIdentifier(item) === applicationId,
    );

    setDraggedApplicationId(applicationId);
    setDraggedOverColumnId(
      application ? getKanbanColumnByStatus(application.status)?.id ?? null : null,
    );
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    const nextColumnId = over ? String(over.id) : null;
    setDraggedOverColumnId(
      isKanbanColumnId(nextColumnId) ? nextColumnId : null,
    );
  };

  const handleDragCancel = () => {
    setDraggedApplicationId(null);
    setDraggedOverColumnId(null);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    const applicationId = String(active.id);
    const overColumnId = over ? String(over.id) : null;
    const targetColumnId = isKanbanColumnId(overColumnId)
      ? overColumnId
      : draggedOverColumnId;

    if (!targetColumnId) {
      setDraggedApplicationId(null);
      setDraggedOverColumnId(null);
      return;
    }

    await moveApplicationToColumn(applicationId, targetColumnId);
    setDraggedApplicationId(null);
    setDraggedOverColumnId(null);
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
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={(event) => {
                void handleDragEnd(event);
              }}
              onDragCancel={handleDragCancel}
            >
              {kanbanColumns.map((column) => {
                const columnApplications = visibleApplicationsByColumn[column.id] || [];

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

                    <DroppableColumnBody
                      columnId={column.id}
                      isDragActive={Boolean(draggedApplicationId)}
                      isHighlighted={draggedOverColumnId === column.id}
                    >
                      {columnApplications.length > 0 ? (
                        columnApplications.map((application) => (
                          <DraggableApplicationCard
                            key={getApplicationIdentifier(application)}
                            application={application}
                            isUpdating={updatingApplicationIds.has(
                              getApplicationIdentifier(application),
                            )}
                            isActive={
                              draggedApplicationId ===
                              getApplicationIdentifier(application)
                            }
                            onEditApplication={handleEditClick}
                            onDeleteApplication={handleDeleteClick}
                          />
                        ))
                      ) : (
                        <div className="applications-page__empty-column">
                          No applications match this column right now.
                        </div>
                      )}
                    </DroppableColumnBody>
                  </div>
                );
              })}

              <DragOverlay
                dropAnimation={{
                  duration: 220,
                  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {activeApplication ? (
                  <div className="applications-page__drag-overlay">
                    <ApplicationCardContent
                      application={activeApplication}
                      showInsights={false}
                      showActions={false}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
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
