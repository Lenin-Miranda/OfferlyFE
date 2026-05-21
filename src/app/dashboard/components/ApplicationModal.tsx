"use client";
import { useEffect, useState, useRef } from "react";
import { Application, ApplicationStatus } from "@/types";
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleCheckBig,
  FileText,
  Info,
  Link2,
  MapPin,
  MessageSquareText,
  Target,
  Wallet,
  X,
} from "lucide-react";
import "./ApplicationModal.css";
import { ApplicationModalProps } from "@/types";
import LtcScoreCard from "./LtcScoreCard";

function getInitialFormData(initialData?: Partial<Application> | null) {
  return {
    company: initialData?.company || "",
    position: initialData?.position || "",
    status: initialData?.status || ApplicationStatus.SAVED,
    location: initialData?.location || "",
    salary:
      typeof initialData?.salary === "number" ? String(initialData.salary) : "",
    currency: initialData?.currency || "USD",
    jobUrl: initialData?.jobUrl || "",
    description: initialData?.description || "",
    appliedAt: initialData?.appliedAt
      ? new Date(initialData.appliedAt).toISOString().split("T")[0]
      : "",
    notes: initialData?.notes || "",
  };
}

export default function ApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
}: ApplicationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <ApplicationModalContent
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      mode={mode}
    />
  );
}

function ApplicationModalContent({
  onClose,
  onSubmit,
  initialData,
  mode,
}: Omit<ApplicationModalProps, "isOpen">) {
  const [isAnimating, setIsAnimating] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState(() => getInitialFormData(initialData));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      modalRef.current?.focus();
    }, 100);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      ...(mode === "edit" &&
        initialData && {
          _id: initialData._id || initialData.id,
        }),
      salary: formData.salary === "" ? undefined : Number(formData.salary),
      appliedAt: formData.appliedAt
        ? new Date(formData.appliedAt).toISOString()
        : undefined,
    };

    try {
      await onSubmit(submitData);
      handleClose();
    } catch {
      return;
    }
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

  const modalTitle =
    mode === "create" ? "Add New Application" : "Edit Application";
  const modalSubtitle =
    mode === "create"
      ? "Capture the key details now and keep the rest of the workflow moving."
      : "Update the essentials with a cleaner, focused view of this role.";

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
          <div className="modal__header-copy">
            <span className="modal__eyebrow">Application</span>
            <h2 className="modal__title">{modalTitle}</h2>
            <p className="modal__subtitle">{modalSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="modal__close-btn"
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form">
          <div className="modal__form-container">
            <div className="modal__form-row">
              <label className="modal__form-label">
                <span className="modal__field-head">
                  <BriefcaseBusiness className="modal__form-icon" />
                  Company *
                </span>
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
                <span className="modal__field-head">
                  <Target className="modal__form-icon" />
                  Position *
                </span>
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
                <span className="modal__field-head">
                  <CircleCheckBig className="modal__form-icon" />
                  Status *
                </span>
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
                <span className="modal__field-head">
                  <MapPin className="modal__form-icon" />
                  Location
                </span>
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
                <span className="modal__field-head">
                  <Wallet className="modal__form-icon" />
                  Salary
                </span>
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
                <span className="modal__field-head">
                  <CalendarDays className="modal__form-icon" />
                  Date Applied
                </span>
                <input
                  type="date"
                  name="appliedAt"
                  value={formData.appliedAt}
                  onChange={handleInputChange}
                  className="modal__form-input"
                />
              </label>

              <label className="modal__form-label">
                <span className="modal__field-head">
                  <Wallet className="modal__form-icon" />
                  Currency
                </span>
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
              <span className="modal__field-head">
                <Link2 className="modal__form-icon" />
                Job URL
              </span>
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
              <span className="modal__field-head">
                <FileText className="modal__form-icon" />
                Description
              </span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="modal__form-textarea"
                rows={3}
                placeholder="Job description, requirements, etc."
              />
              <span className="modal__form-hint">
                <Info />
                Adding the job description improves the ltcScore match analysis.
              </span>
            </label>

            <label className="modal__form-label">
              <span className="modal__field-head">
                <MessageSquareText className="modal__form-icon" />
                Notes
              </span>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="modal__form-textarea"
                rows={3}
                placeholder="Personal notes, interview experience, etc."
              />
            </label>

            {initialData ? (
              <div className="modal__score-card">
                <LtcScoreCard application={initialData as Application} />
              </div>
            ) : null}
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
