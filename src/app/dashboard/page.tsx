"use client";
import { useState } from "react";
import { FiBookmark, FiSend, FiClock, FiCheckCircle } from "react-icons/fi";
import "./page.css";
import Sidebar from "./components/Sidebar";
import ApplicationModal from "./components/ApplicationModal";

// Mock data for job applications
const mockApplications = [
  {
    id: 1,
    company: "Google",
    position: "Frontend Developer",
    status: "Saved",
    dateApplied: "2024-03-12",
    salary: "$120,000",
    location: "San Francisco, CA",
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Full Stack Developer",
    status: "Applied",
    dateApplied: "2024-03-10",
    salary: "$115,000",
    location: "Seattle, WA",
  },
  {
    id: 3,
    company: "Netflix",
    position: "React Developer",
    status: "In Progress",
    dateApplied: "2024-03-08",
    salary: "$130,000",
    location: "Los Angeles, CA",
  },
  {
    id: 4,
    company: "Uber",
    position: "Software Engineer",
    status: "Closed",
    dateApplied: "2024-03-01",
    salary: "$125,000",
    location: "San Francisco, CA",
  },
  {
    id: 5,
    company: "Airbnb",
    position: "Frontend Engineer",
    status: "Applied",
    dateApplied: "2024-02-28",
    salary: "$118,000",
    location: "San Francisco, CA",
  },
  {
    id: 6,
    company: "Tesla",
    position: "Software Engineer",
    status: "In Progress",
    dateApplied: "2024-02-25",
    salary: "$140,000",
    location: "Austin, TX",
  },
  {
    id: 7,
    company: "Apple",
    position: "iOS Developer",
    status: "Closed",
    dateApplied: "2024-02-20",
    salary: "$135,000",
    location: "Cupertino, CA",
  },
  {
    id: 8,
    company: "Meta",
    position: "Frontend Engineer",
    status: "Saved",
    dateApplied: "2024-02-18",
    salary: "$145,000",
    location: "Menlo Park, CA",
  },
];

const kanbanColumns = [
  {
    id: "saved",
    title: "Saved",
    status: "Saved",
    color: "gray",
    icon: FiBookmark,
  },
  {
    id: "applied",
    title: "Applied",
    status: "Applied",
    color: "blue",
    icon: FiSend,
  },
  {
    id: "inprogress",
    title: "In Progress",
    status: "In Progress",
    color: "orange",
    icon: FiClock,
  },
  {
    id: "closed",
    title: "Closed",
    status: "Closed",
    color: "green",
    icon: FiCheckCircle,
  },
];

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (data: any) => {
    console.log("New application data:", data);
  };

  const getApplicationsByStatus = (status: string) => {
    return mockApplications.filter((app) => app.status === status);
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "saved":
        return "status-saved";
      case "applied":
        return "status-applied";
      case "interviewing":
        return "status-interviewing";
      case "offer":
        return "status-offer";
      case "rejected":
        return "status-rejected";
      case "ghosted":
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
            <div className="stat-number">{mockApplications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {getApplicationsByStatus("In Progress").length}
            </div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {getApplicationsByStatus("Closed").length}
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
                    {getApplicationsByStatus(column.status).length}
                  </span>
                </div>

                <div className="kanban-cards">
                  {getApplicationsByStatus(column.status).map((app) => (
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
                          <span className="detail-text">{app.dateApplied}</span>
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
