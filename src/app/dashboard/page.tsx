"use client";
import { useEffect, useState } from "react";
import { FiBookmark, FiSend, FiClock, FiCheckCircle } from "react-icons/fi";
import "./page.css";
import Sidebar from "./components/Sidebar";
import ApplicationModal from "./components/ApplicationModal";
import { useContext } from "react";
import { Application, ApplicationStatus } from "@/types";
import { ApplicationContext } from "@/contexts/ApplicationContext";

const mockApplications = [
  {
    id: 1,
    company: "Google",
    position: "Frontend Developer",
    status: ApplicationStatus.SAVED,
    dateApplied: "2024-03-12",
    salary: "$120,000",
    location: "San Francisco, CA",
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Full Stack Developer",
    status: ApplicationStatus.APPLIED,
    dateApplied: "2024-03-10",
    salary: "$115,000",
    location: "Seattle, WA",
  },
  {
    id: 3,
    company: "Netflix",
    position: "React Developer",
    status: ApplicationStatus.INTERVIEWING,
    dateApplied: "2024-03-08",
    salary: "$130,000",
    location: "Los Angeles, CA",
  },
  {
    id: 4,
    company: "Uber",
    position: "Software Engineer",
    status: ApplicationStatus.OFFER,
    dateApplied: "2024-03-01",
    salary: "$125,000",
    location: "San Francisco, CA",
  },
  {
    id: 5,
    company: "Airbnb",
    position: "Frontend Engineer",
    status: ApplicationStatus.APPLIED,
    dateApplied: "2024-02-28",
    salary: "$118,000",
    location: "San Francisco, CA",
  },
  {
    id: 6,
    company: "Tesla",
    position: "Software Engineer",
    status: ApplicationStatus.INTERVIEWING,
    dateApplied: "2024-02-25",
    salary: "$140,000",
    location: "Austin, TX",
  },
  {
    id: 7,
    company: "Apple",
    position: "iOS Developer",
    status: ApplicationStatus.REJECTED,
    dateApplied: "2024-02-20",
    salary: "$135,000",
    location: "Cupertino, CA",
  },
  {
    id: 8,
    company: "Meta",
    position: "Frontend Engineer",
    status: ApplicationStatus.SAVED,
    dateApplied: "2024-02-18",
    salary: "$145,000",
    location: "Menlo Park, CA",
  },
];

const kanbanColumns = [
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
    statuses: [ApplicationStatus.INTERVIEWING, ApplicationStatus.OFFER],
    color: "orange",
    icon: FiClock,
  },
  {
    id: "closed",
    title: "Closed",
    statuses: [
      ApplicationStatus.REJECTED,
      ApplicationStatus.ACCEPTED,
      ApplicationStatus.WITHDRAWN,
      ApplicationStatus.GHOSTED,
    ],
    color: "green",
    icon: FiCheckCircle,
  },
];

export default function Dashboard() {
  const { applications, addApplication, editApplication } =
    useContext(ApplicationContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (data: Application) => {
    addApplication(data);
  };

  const getApplicationsByStatuses = (statuses: ApplicationStatus[]) => {
    if (!Array.isArray(applications)) {
      return [];
    }
    return applications.filter((app) => statuses.includes(app.status));
  };

  const getStatusDisplayName = (status: ApplicationStatus) => {
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
  };

  const getStatusClass = (status: ApplicationStatus) => {
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
  };

  return (
    <>
      <Sidebar />
      <section className="dashboard">
        {/* Header Section */}
        <div className="dashboard__header">
          <h1 className="dashboard__title">Job Application Tracker</h1>
          <p className="dashboard__subtitle">
            Organize and track your job applications efficiently
          </p>
        </div>

        {/* Stats Overview */}
        <div className="dashboard__stats">
          <div className="stat-card">
            <div className="stat-number">
              {Array.isArray(applications) ? applications.length : 0}
            </div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {
                getApplicationsByStatuses([
                  ApplicationStatus.INTERVIEWING,
                  ApplicationStatus.OFFER,
                ]).length
              }
            </div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {
                getApplicationsByStatuses([
                  ApplicationStatus.REJECTED,
                  ApplicationStatus.ACCEPTED,
                  ApplicationStatus.WITHDRAWN,
                  ApplicationStatus.GHOSTED,
                ]).length
              }
            </div>
            <div className="stat-label">Closed Applications</div>
          </div>
        </div>

        {/* Action Section */}
        <div className="dashboard__action">
          <div className="dashboard__button-ctn">
            <p className="dashboard__action-text">
              Ready to add your next job application? Track your progress and
              never miss an opportunity.
            </p>
            <button className="dashboard__ctn-btn" onClick={handleOpenModal}>
              Add New Application
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="kanban-board">
          <h2 className="kanban-title">Application Status Board</h2>

          <div className="kanban-columns">
            {kanbanColumns.map((column) => (
              <div key={column.id} className={`kanban-column ${column.color}`}>
                <div className="kanban-column-header">
                  <div className="kanban-header-left">
                    <column.icon className="kanban-icon" />
                    <h3 className="kanban-column-title">{column.title}</h3>
                  </div>
                  <span className="kanban-column-count">
                    {getApplicationsByStatuses(column.statuses).length}
                  </span>
                </div>

                <div className="kanban-cards">
                  {getApplicationsByStatuses(column.statuses).map((app) => (
                    <div
                      key={app.id}
                      className={`kanban-card ${getStatusClass(app.status)}`}
                    >
                      <div className="card-header">
                        <h4 className="card-company">{app.company}</h4>
                        <div
                          className={`status-dot ${getStatusClass(app.status)}`}
                        ></div>
                      </div>

                      <p className="card-position">{app.position}</p>
                      <div className="card-status">
                        <span className="status-label">Status:</span>
                        <span
                          className={`status-badge ${getStatusClass(
                            app.status,
                          )}`}
                        >
                          {getStatusDisplayName(app.status)}
                        </span>
                      </div>

                      <div className="card-details">
                        <div className="detail-item">
                          <span className="detail-icon">📍</span>
                          <span className="detail-text">{app.location}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">💰</span>
                          <span className="detail-text">{app.salary}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">📅</span>
                          <span className="detail-text">{app.appliedAt}</span>
                        </div>
                      </div>

                      <div className="card-actions">
                        <button className="btn-edit">Edit</button>
                        <button className="btn-view">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        mode="create"
      />
    </>
  );
}
