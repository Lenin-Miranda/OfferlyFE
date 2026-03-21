"use client";
import { useEffect, useState, useRef } from "react";
import { ApplicationStatus } from "@/types";
import {
  FiX,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiLink,
  FiFileText,
  FiMessageSquare,
} from "react-icons/fi";
import "./ApplicationModal.css";
import { ApplicationModalProps, Application } from "@/types";

export default function ApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
}: ApplicationModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: ApplicationStatus.SAVED,
    location: "",
    salary: "",
    currency: "USD",
    jobUrl: "",
    description: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        company: initialData.company || "",
        position: initialData.position || "",
        status: initialData.status || ApplicationStatus.SAVED,
        location: initialData.location || "",
        salary: initialData.salary ? String(initialData.salary) : "",
        currency: initialData.currency || "USD",
        jobUrl: initialData.jobUrl || "",
        description: initialData.description || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData, mode]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  function handleCloseKeydown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      handleClose();
    }
  }

  function handleCloseOutside(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      salary: formData.salary ? Number(formData.salary) : undefined,
    };
    onSubmit(submitData);
    handleClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`modal-overlay ${isAnimating ? "modal-overlay--open" : ""}`}
      onClick={handleCloseOutside}
      onKeyDown={handleCloseKeydown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className={`modal ${isAnimating ? "modal--open" : ""}`}>
        <div className="modal__header">
          <h2 className="modal__title">
            {mode === "create" ? "Add New Application" : "Edit Application"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="modal__close-btn"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form">
          <div className="modal__form-container">
            <div className="modal__form-row">
              <label className="modal__form-label">
                <FiBriefcase className="modal__form-icon" />
                Company *
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="modal__form-input"
                  required
                  placeholder="e.g., Google, Microsoft"
                />
              </label>

              <label className="modal__form-label">
                <FiBriefcase className="modal__form-icon" />
                Position *
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="modal__form-input"
                  required
                  placeholder="e.g., Frontend Developer"
                />
              </label>
            </div>

            <div className="modal__form-row">
              <label className="modal__form-label">
                Status *
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="modal__form-select"
                  required
                >
                  <option value={ApplicationStatus.SAVED}>Saved</option>
                  <option value={ApplicationStatus.APPLIED}>Applied</option>
                  <option value={ApplicationStatus.INTERVIEWING}>
                    Interviewing
                  </option>
                  <option value={ApplicationStatus.OFFER}>Offer</option>
                  <option value={ApplicationStatus.REJECTED}>Rejected</option>
                  <option value={ApplicationStatus.ACCEPTED}>Accepted</option>
                  <option value={ApplicationStatus.WITHDRAWN}>Withdrawn</option>
                  <option value={ApplicationStatus.GHOSTED}>Ghosted</option>
                </select>
              </label>

              <label className="modal__form-label">
                <FiMapPin className="modal__form-icon" />
                Location
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="modal__form-input"
                  placeholder="e.g., San Francisco, CA"
                />
              </label>
            </div>

            <div className="modal__form-row">
              <label className="modal__form-label">
                <FiDollarSign className="modal__form-icon" />
                Salary
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="modal__form-input"
                  placeholder="120000"
                />
              </label>

              <label className="modal__form-label">
                Currency
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="modal__form-select"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="MXN">MXN</option>
                </select>
              </label>
            </div>

            <label className="modal__form-label">
              <FiLink className="modal__form-icon" />
              Job URL
              <input
                type="url"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleInputChange}
                className="modal__form-input"
                placeholder="https://..."
              />
            </label>

            <label className="modal__form-label">
              <FiFileText className="modal__form-icon" />
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="modal__form-textarea"
                rows={3}
                placeholder="Job description, requirements, etc."
              />
            </label>

            <label className="modal__form-label">
              <FiMessageSquare className="modal__form-icon" />
              Notes
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="modal__form-textarea"
                rows={3}
                placeholder="Personal notes, interview experience, etc."
              />
            </label>
          </div>

          <div className="modal__form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="modal__btn modal__btn--cancel"
            >
              Cancel
            </button>
            <button type="submit" className="modal__btn modal__btn--submit">
              {mode === "create" ? "Add Application" : "Update Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
