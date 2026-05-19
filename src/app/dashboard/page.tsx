"use client";

import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiZap,
} from "react-icons/fi";
import Sidebar from "./components/Sidebar";
import ApplicationModal from "./components/ApplicationModal";
import MessageNotification from "./components/MessageNotification";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import { ApplicationFormData, ApplicationStatus } from "@/types";
import {
  formatApplicationDate,
  getApplicationMutationSuccessMessage,
  getApplicationOverviewStats,
  getApplicationsByStatuses,
  getRecentApplications,
  getStatusDisplayName,
  kanbanColumns,
} from "./applicationHelpers";
import "./page.css";

export default function Dashboard() {
  const {
    applications,
    addApplication,
    isMessage,
    setIsMessage,
    messageType,
    setMessageType,
  } = useContext(ApplicationContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const recentApplications = useMemo(
    () => getRecentApplications(applications),
    [applications],
  );
  const maxColumnCount = useMemo(
    () =>
      Math.max(
        1,
        ...kanbanColumns.map(
          (column) =>
            getApplicationsByStatuses(applications, column.statuses).length,
        ),
      ),
    [applications],
  );

  const handleModalSubmit = async (data: ApplicationFormData) => {
    if (!data.company || !data.position || !data.status) {
      setMessageType("error");
      setIsMessage(
        "Please fill in all required fields: Company, Position, and Status.",
      );
      throw new Error("Missing required application fields");
    }

    try {
      const createdApplication = await addApplication(data);
      setMessageType("success");
      setIsMessage(
        getApplicationMutationSuccessMessage(createdApplication, "added"),
      );
      setIsModalOpen(false);
    } catch {
      setMessageType("error");
      setIsMessage("We couldn't add the application. Please try again.");
      throw new Error("Application creation failed");
    }
  };

  return (
    <>
      <Sidebar />
      <main className="dashboard-overview">
        <section className="dashboard-overview__hero" data-aos="fade-up">
          <div className="dashboard-overview__hero-copy">
            <h1 className="dashboard-overview__title">
              Keep your job search clear, focused, and moving forward
            </h1>
            <p className="dashboard-overview__subtitle">
              Get a quick read on your pipeline, jump into the applications
              workspace, and tailor your next resume without losing momentum.
            </p>
            <div className="dashboard-overview__hero-actions">
              <Link
                href="/dashboard/applications"
                className="dashboard-overview__button dashboard-overview__button--primary"
              >
                Open Applications
                <FiArrowRight />
              </Link>
              <Link
                href="/dashboard/taylor"
                className="dashboard-overview__button dashboard-overview__button--secondary"
              >
                Open Taylor
                <FiZap />
              </Link>
            </div>
          </div>
        </section>

        <section
          className="dashboard-overview__stats-grid"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <article className="dashboard-overview__stat-card">
            <FiBriefcase />
            <strong>{overviewStats.total}</strong>
            <span>Total applications tracked</span>
          </article>
          <article className="dashboard-overview__stat-card">
            <FiClock />
            <strong>{overviewStats.interviewing}</strong>
            <span>In progress right now</span>
          </article>
          <article className="dashboard-overview__stat-card">
            <FiCheckCircle />
            <strong>{overviewStats.closed}</strong>
            <span>Closed outcomes logged</span>
          </article>
        </section>

        <section className="dashboard-overview__content">
          <article
            className="dashboard-overview__panel dashboard-overview__panel--pipeline"
            data-aos="fade-up"
            data-aos-delay="160"
          >
            <div className="dashboard-overview__panel-head">
              <div>
                <span className="dashboard-overview__panel-eyebrow">
                  Pipeline
                </span>
                <h2 style={{ marginTop: "24px" }}>Status snapshot</h2>
              </div>
              <Link href="/dashboard/applications">Manage workspace</Link>
            </div>

            <div className="dashboard-overview__pipeline-list">
              {kanbanColumns.map((column) => {
                const count = getApplicationsByStatuses(
                  applications,
                  column.statuses,
                ).length;
                const width = `${Math.max((count / maxColumnCount) * 100, count ? 14 : 0)}%`;

                return (
                  <div
                    key={column.id}
                    className="dashboard-overview__pipeline-item"
                  >
                    <div className="dashboard-overview__pipeline-top">
                      <div className="dashboard-overview__pipeline-label">
                        <column.icon />
                        <div className="dashboard-overview__pipeline-text">
                          <span>{column.title}</span>
                          <span className="dashboard-overview__pipeline-count">
                            {count}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-overview__pipeline-track">
                      <span
                        className={`dashboard-overview__pipeline-fill dashboard-overview__pipeline-fill--${column.color}`}
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article
            className="dashboard-overview__panel dashboard-overview__panel--recent"
            data-aos="fade-up"
            data-aos-delay="220"
          >
            <div className="dashboard-overview__panel-head">
              <div>
                <span className="dashboard-overview__panel-eyebrow">
                  Recent
                </span>
                <h2 style={{ marginTop: "24px" }}>
                  Latest application activity
                </h2>
              </div>
              <Link href="/dashboard/applications">View all</Link>
            </div>

            {recentApplications.length > 0 ? (
              <div className="dashboard-overview__recent-list">
                {recentApplications.map((application) => (
                  <div
                    key={application._id || application.id}
                    className="dashboard-overview__recent-item"
                  >
                    <div>
                      <strong>{application.company}</strong>
                      <p>{application.position}</p>
                    </div>
                    <div className="dashboard-overview__recent-meta">
                      <span>
                        {getStatusDisplayName(
                          application.status as ApplicationStatus,
                        )}
                      </span>
                      <small>
                        {formatApplicationDate(
                          application.updatedAt || application.createdAt,
                        )}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-overview__empty-state">
                No applications yet. Add your first one to start building your
                pipeline.
              </div>
            )}
          </article>

          <article
            className="dashboard-overview__panel dashboard-overview__panel--actions"
            data-aos="fade-up"
            data-aos-delay="280"
          >
            <div className="dashboard-overview__panel-head">
              <div>
                <span className="dashboard-overview__panel-eyebrow">
                  Actions
                </span>
                <h2>Move your search forward</h2>
              </div>
            </div>

            <div className="dashboard-overview__action-grid">
              <Link
                href="/dashboard/applications"
                className="dashboard-overview__action-card"
              >
                <FiBriefcase />
                <strong>Applications workspace</strong>
                <span>
                  Track, edit, and review every opportunity in one board.
                </span>
              </Link>
              <Link
                href="/dashboard/taylor"
                className="dashboard-overview__action-card"
              >
                <FiZap />
                <strong>Resume tailoring</strong>
                <span>
                  Adapt your resume to a job post and download the updated PDF.
                </span>
              </Link>
              <button
                type="button"
                className="dashboard-overview__action-card dashboard-overview__action-card--button"
                onClick={() => setIsModalOpen(true)}
              >
                <FiPlus />
                <strong>Add new application</strong>
                <span>
                  Create a fresh application entry without leaving the overview.
                </span>
              </button>
            </div>
          </article>
        </section>
      </main>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        mode="create"
      />

      {isMessage ? (
        <MessageNotification
          message={isMessage}
          type={messageType}
          onClose={() => setIsMessage("")}
        />
      ) : null}
    </>
  );
}
