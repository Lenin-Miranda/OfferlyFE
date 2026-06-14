"use client";

import { useEffect, useId, useRef } from "react";
import {
  FiFileText,
  FiRefreshCcw,
  FiUploadCloud,
  FiZap,
} from "react-icons/fi";
import "./ResumeTailorForm.css";

interface ResumeTailorFormProps {
  selectedFile: File | null;
  jobPost: string;
  isSubmitting: boolean;
  onFileChange: (file: File | null) => void;
  onJobPostChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export default function ResumeTailorForm({
  selectedFile,
  jobPost,
  isSubmitting,
  onFileChange,
  onJobPostChange,
  onSubmit,
  onReset,
}: ResumeTailorFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaId = useId();
  const helperId = useId();

  useEffect(() => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [selectedFile]);

  return (
    <section className="resume-tailor-form">
      <div className="resume-tailor-form__field-group">
        <div className="resume-tailor-form__field-header">
          <label className="resume-tailor-form__label">Resume PDF</label>
          <span className="resume-tailor-form__meta">Required</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="resume-tailor-form__file-input"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />

        <button
          type="button"
          className="resume-tailor-form__upload-card"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting}
        >
          <span className="resume-tailor-form__upload-icon">
            <FiUploadCloud />
          </span>
          <span className="resume-tailor-form__upload-copy">
            <strong>
              {selectedFile ? "Replace PDF resume" : "Choose a PDF resume"}
            </strong>
            <span>
              {selectedFile
                ? `${selectedFile.name} • ${Math.max(
                    1,
                    Math.round(selectedFile.size / 1024),
                  )} KB`
                : "Only PDF files are accepted."}
            </span>
          </span>
          <span className="resume-tailor-form__upload-chip">
            {selectedFile ? "Selected" : "Upload"}
          </span>
        </button>
      </div>

      <div className="resume-tailor-form__field-group">
        <div className="resume-tailor-form__field-header">
          <label htmlFor={textareaId} className="resume-tailor-form__label">
            Full job post
          </label>
          <span className="resume-tailor-form__meta">
            {jobPost.trim().length} characters
          </span>
        </div>

        <div className="resume-tailor-form__textarea-wrap">
          <FiFileText className="resume-tailor-form__textarea-icon" />
          <textarea
            id={textareaId}
            value={jobPost}
            onChange={(event) => onJobPostChange(event.target.value)}
            className="resume-tailor-form__textarea"
            placeholder="Paste the full job description, including responsibilities, requirements, and key skills."
            rows={12}
            aria-describedby={helperId}
            disabled={isSubmitting}
          />
        </div>
        <p id={helperId} className="resume-tailor-form__helper">
          Include the complete posting so the AI can align achievements,
          keywords, and experience with better precision.
        </p>
      </div>

      <div className="resume-tailor-form__actions">
        <button
          type="button"
          className="resume-tailor-form__button resume-tailor-form__button--secondary"
          onClick={onReset}
          disabled={isSubmitting}
        >
          <FiRefreshCcw />
          Reset
        </button>
        <button
          type="button"
          className="resume-tailor-form__button resume-tailor-form__button--primary"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="resume-tailor-form__spinner" />
              Tailoring Resume...
            </>
          ) : (
            <>
              <FiZap />
              Tailor Resume
            </>
          )}
        </button>
      </div>
    </section>
  );
}
