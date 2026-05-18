"use client";

import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
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
import MessageNotification from "../components/MessageNotification";
import ConfirmationMessage from "../components/ConfirmationMessage";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import { Application, ApplicationFormData } from "@/types";
import {
  applicationFocusFilters,
  ApplicationFocusFilter,
  formatApplicationDate,
  getApplicationOverviewStats,
  getApplicationsByStatuses,
  getApplicationsForFocus,
  getStatusClass,
  getStatusDisplayName,
  kanbanColumns,
  matchesApplicationSearch,
} from "../applicationHelpers";
import "./page.css";

export default function ApplicationsPage() {
  const {
    applications,
    addApplication,
    isMessage,
    setIsMessage,
    messageType,
    setMessageType,
  } = useContext(ApplicationContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    if (isMessage) {
      const timer = setTimeout(() => {
        setIsMessage("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isMessage, setIsMessage]);

  const overviewStats = useMemo(
    () => getApplicationOverviewStats(applications),
    [applications],
  );
  const scopedApplications = useMemo(
    () => getApplicationsForFocus(applications, focusFilter),
    [applications, focusFilter],
  );
  const visibleApplications = useMemo(
    () =>
      scopedApplications.filter((application) =>
        matchesApplicationSearch(application, searchQuery),
      ),
    [scopedApplications, searchQuery],
  );

  const handleOpenModal = () => {
    setEditingApp(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (application: Application) => {
    setEditingApp(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApp(null);
  };

  const handleDeleteClick = (applicationId: string, companyName: string) => {
    setSelectedAppForDelete({ id: applicationId, company: companyName });
    setIsMessageOpen(true);
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
      return;
    }

    if (editingApp) {
      setEditConfirmationData({
        isOpen: true,
        appData: data,
      });
      setIsModalOpen(false);
      return;
    }

    try {
      await addApplication(data);
      setMessageType("success");
      setIsMessage("Application added successfully!");
      setIsModalOpen(false);
    } catch {
      setMessageType("error");
      setIsMessage("We couldn't add the application. Please try again.");
    }
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
            <button
              type="button"
              className="applications-page__button applications-page__button--primary"
              onClick={handleOpenModal}
            >
              <FiPlus />
              Add New Application
            </button>
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

                  <div className="applications-page__cards">
                    {columnApplications.length > 0 ? (
                      columnApplications.map((application) => (
                        <div
                          key={application._id || application.id}
                          className={`applications-page__card ${getStatusClass(
                            application.status,
                          )}`}
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
                                  application._id || application.id,
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        mode={editingApp ? "edit" : "create"}
        initialData={editingApp}
      />

      {isMessage ? (
        <MessageNotification
          message={isMessage}
          type={messageType}
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
