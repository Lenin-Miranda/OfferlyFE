"use client";

import Link from "next/link";
import { useContext, useMemo } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiClock,
  FiLayers,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import {
  formatApplicationDate,
  getAnalyticsSnapshot,
  getPipelineDistribution,
  getRecentActivityCount,
  getRecentApplications,
  getStatusDisplayName,
  getTopPipelineStage,
} from "../applicationHelpers";
import "./page.css";

const segmentColors = {
  gray: "rgba(107, 114, 128, 0.88)",
  blue: "rgba(59, 130, 246, 0.88)",
  orange: "rgba(249, 115, 22, 0.88)",
  green: "rgba(34, 197, 94, 0.88)",
} as const;

function getPipelineGradient(
  distribution: ReturnType<typeof getPipelineDistribution>,
) {
  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return "linear-gradient(90deg, rgba(17, 24, 39, 0.08) 0%, rgba(17, 24, 39, 0.08) 100%)";
  }

  let currentStop = 0;
  const segments = distribution
    .filter((item) => item.count > 0)
    .map((item) => {
      const start = currentStop;
      currentStop += (item.count / total) * 100;
      const color = segmentColors[item.color];
      return `${color} ${start}% ${currentStop}%`;
    });

  if (currentStop < 100) {
    segments.push(
      `rgba(17, 24, 39, 0.08) ${currentStop}% 100%`,
    );
  }

  return `linear-gradient(90deg, ${segments.join(", ")})`;
}

export default function AnalyticsPage() {
  const { applications } = useContext(ApplicationContext);

  const snapshot = useMemo(
    () => getAnalyticsSnapshot(applications),
    [applications],
  );
  const distribution = useMemo(
    () => getPipelineDistribution(applications),
    [applications],
  );
  const recentActivityCount = useMemo(
    () => getRecentActivityCount(applications, 14),
    [applications],
  );
  const topStage = useMemo(
    () => getTopPipelineStage(applications),
    [applications],
  );
  const latestMovement = useMemo(
    () => getRecentApplications(applications, 2),
    [applications],
  );

  const inProgressPercentage =
    snapshot.total > 0
      ? Math.round((snapshot.inProgress / snapshot.total) * 100)
      : 0;
  const pipelineGradient = useMemo(
    () => getPipelineGradient(distribution),
    [distribution],
  );

  const insights = [
    topStage
      ? `Most of your pipeline is sitting in ${topStage.label.toLowerCase()} with ${topStage.count} tracked roles.`
      : "Your pipeline will start to form here as soon as you add your first application.",
    `${inProgressPercentage}% of your tracked roles are currently moving through interviews or offer stages.`,
    `${recentActivityCount} application${recentActivityCount === 1 ? "" : "s"} changed in the last 14 days.`,
  ];

  const kpis = [
    {
      label: "Total tracked",
      value: snapshot.total,
      icon: FiLayers,
    },
    {
      label: "Active pipeline",
      value: snapshot.active,
      icon: FiActivity,
    },
    {
      label: "In progress",
      value: snapshot.inProgress,
      icon: FiClock,
    },
    {
      label: "Offers",
      value: snapshot.offers,
      icon: FiTarget,
    },
  ];

  return (
    <>
      <Sidebar />
      <main className="analytics-page">
        {snapshot.total === 0 ? (
          <section className="analytics-page__empty-state" data-aos="fade-up">
            <span className="analytics-page__eyebrow">Analytics</span>
            <h1 className="analytics-page__empty-title">
              See your search at a glance
            </h1>
            <p className="analytics-page__empty-copy">
              Add a few applications first and this page will turn them into a
              clean pipeline snapshot.
            </p>
            <Link
              href="/dashboard/applications"
              className="analytics-page__button analytics-page__button--primary"
            >
              Open Applications
              <FiArrowRight />
            </Link>
          </section>
        ) : (
          <>
            <section className="analytics-page__hero" data-aos="fade-up">
              <div className="analytics-page__hero-copy">
                <span className="analytics-page__eyebrow">Analytics</span>
                <h1 className="analytics-page__title">
                  See your search at a glance
                </h1>
                <p className="analytics-page__subtitle">
                  A minimal snapshot of where your applications stand right now.
                </p>
              </div>

              <Link
                href="/dashboard/applications"
                className="analytics-page__button analytics-page__button--secondary"
              >
                Open Applications
                <FiArrowRight />
              </Link>
            </section>

            <section
              className="analytics-page__kpis"
              data-aos="fade-up"
              data-aos-delay="70"
            >
              {kpis.map((item) => (
                <article key={item.label} className="analytics-page__kpi-card">
                  <item.icon />
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </section>

            <section
              className="analytics-page__content"
              data-aos="fade-up"
              data-aos-delay="120"
            >
              <article className="analytics-page__panel analytics-page__panel--distribution">
                <div className="analytics-page__panel-head">
                  <div>
                    <span className="analytics-page__panel-eyebrow">
                      Pipeline distribution
                    </span>
                    <h2>Where your search is sitting</h2>
                  </div>
                </div>

                <div className="analytics-page__bar-shell" aria-hidden="true">
                  <span
                    className="analytics-page__bar-fill"
                    style={{ background: pipelineGradient }}
                  />
                </div>

                <div className="analytics-page__legend">
                  {distribution.map((item) => (
                    <div key={item.id} className="analytics-page__legend-item">
                      <span
                        className={`analytics-page__legend-swatch analytics-page__legend-swatch--${item.color}`}
                      />
                      <div className="analytics-page__legend-copy">
                        <strong>{item.label}</strong>
                        <small>
                          {item.count} roles • {item.percentage}%
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="analytics-page__panel analytics-page__panel--signals">
                <div className="analytics-page__panel-head">
                  <div>
                    <span className="analytics-page__panel-eyebrow">
                      Signals
                    </span>
                    <h2>What stands out</h2>
                  </div>
                  <FiTrendingUp className="analytics-page__panel-icon" />
                </div>

                <div className="analytics-page__signal-list">
                  {insights.map((insight) => (
                    <p key={insight} className="analytics-page__signal-item">
                      {insight}
                    </p>
                  ))}
                </div>

                <div className="analytics-page__latest">
                  <div className="analytics-page__latest-head">
                    <span className="analytics-page__panel-eyebrow">
                      Latest movement
                    </span>
                  </div>

                  {latestMovement.map((application) => (
                    <div
                      key={application._id || application.id}
                      className="analytics-page__latest-item"
                    >
                      <div>
                        <strong>{application.company}</strong>
                        <p>{application.position}</p>
                      </div>
                      <div className="analytics-page__latest-meta">
                        <span>{getStatusDisplayName(application.status)}</span>
                        <small>
                          {formatApplicationDate(
                            application.updatedAt || application.createdAt,
                          )}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </>
  );
}
