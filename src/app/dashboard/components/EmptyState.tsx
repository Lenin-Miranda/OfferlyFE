"use client";
import { FiBriefcase, FiPlus } from "react-icons/fi";
import "./EmptyState.css";

interface EmptyStateProps {
  onAddApplication: () => void;
}

export default function EmptyState({ onAddApplication }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__content">
        <div className="empty-state__icon">
          <FiBriefcase />
        </div>
        <h3 className="empty-state__title">No Applications Yet</h3>
        <p className="empty-state__description">
          Start tracking your job applications and never miss an opportunity.
          Add your first application to get started!
        </p>
        <button className="empty-state__button" onClick={onAddApplication}>
          <FiPlus className="empty-state__button-icon" />
          Add Your First Application
        </button>
      </div>
    </div>
  );
}
