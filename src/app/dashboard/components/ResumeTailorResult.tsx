"use client";

import {
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiLoader,
  FiMinusCircle,
  FiRefreshCcw,
  FiShield,
} from "react-icons/fi";
import { ResumeTailorResponse } from "@/types";
import { normalizePdfFileName } from "@/utils/pdf";
import "./ResumeTailorResult.css";

interface ResumeTailorResultProps {
  result: ResumeTailorResponse | null;
  previewUrl: string | null;
  isLoading: boolean;
  onDownload: () => void;
  onReset: () => void;
}

export default function ResumeTailorResult({
  result,
  previewUrl,
  isLoading,
  onDownload,
  onReset,
}: ResumeTailorResultProps) {
  if (isLoading) {
    return (
      <section className="resume-tailor-result">
        <div className="resume-tailor-result__loading">
          <div className="resume-tailor-result__loading-icon">
            <FiLoader />
          </div>
          <h2>Tailoring your resume...</h2>
          <p>
            We are aligning your resume to the job post, preserving the PDF
            format when possible, and skipping edits that would break the line
            layout.
          </p>
          <div className="resume-tailor-result__loading-steps">
            <span>Reading the original PDF</span>
            <span>Matching role keywords and achievements</span>
            <span>Rendering your tailored PDF result</span>
          </div>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="resume-tailor-result">
        <div className="resume-tailor-result__empty">
          <div className="resume-tailor-result__empty-icon">
            <FiFileText />
          </div>
          <h2>Tailored output will appear here</h2>
          <p>
            Once the resume is processed, you will see the summary, line-by-line
            changes, any skipped edits, and a downloadable PDF preview.
          </p>
        </div>
      </section>
    );
  }

  const fileName = normalizePdfFileName(result.fileName);
  const hasChanges = result.changes.length > 0;
  const hasSkippedChanges = result.skippedChanges.length > 0;

  return (
    <section className="resume-tailor-result">
      <div className="resume-tailor-result__hero">
        <div>
          <span className="resume-tailor-result__eyebrow">Ready</span>
          <h2 className="resume-tailor-result__title">{fileName}</h2>
          <p className="resume-tailor-result__summary">{result.summary}</p>
        </div>

        <div className="resume-tailor-result__actions">
          <button
            type="button"
            className="resume-tailor-result__button resume-tailor-result__button--secondary"
            onClick={onReset}
          >
            <FiRefreshCcw />
            Start Over
          </button>
          <button
            type="button"
            className="resume-tailor-result__button resume-tailor-result__button--primary"
            onClick={onDownload}
          >
            <FiDownload />
            Download PDF
          </button>
        </div>
      </div>

      <div className="resume-tailor-result__stats">
        <article className="resume-tailor-result__stat">
          <span className="resume-tailor-result__stat-value">
            {result.changes.length}
          </span>
          <span className="resume-tailor-result__stat-label">
            Applied changes
          </span>
        </article>
        <article className="resume-tailor-result__stat">
          <span className="resume-tailor-result__stat-value">
            {result.skippedChanges.length}
          </span>
          <span className="resume-tailor-result__stat-label">
            Skipped changes
          </span>
        </article>
        <article className="resume-tailor-result__stat">
          <span className="resume-tailor-result__stat-value">PDF</span>
          <span className="resume-tailor-result__stat-label">Output type</span>
        </article>
      </div>

      <div className="resume-tailor-result__note">
        <FiShield />
        <div>
          <strong>Layout preservation note</strong>
          <p>{result.notes.preservedLayout}</p>
        </div>
      </div>

      <div className="resume-tailor-result__section">
        <div className="resume-tailor-result__section-header">
          <h3>
            <FiCheckCircle />
            Applied changes
          </h3>
        </div>

        {hasChanges ? (
          <div className="resume-tailor-result__list">
            {result.changes.map((change) => (
              <article
                key={`${change.lineId}-${change.page}`}
                className="resume-tailor-result__item"
              >
                <div className="resume-tailor-result__item-top">
                  <span>Page {change.page}</span>
                  <span>Line {change.lineId}</span>
                </div>
                <p className="resume-tailor-result__item-text">
                  <strong>Original:</strong> {change.originalText}
                </p>
                <p className="resume-tailor-result__item-text">
                  <strong>Updated:</strong> {change.replacementText}
                </p>
                <p className="resume-tailor-result__item-reason">
                  {change.reason}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="resume-tailor-result__placeholder">
            No line-level changes were needed for this resume.
          </div>
        )}
      </div>

      <div className="resume-tailor-result__section">
        <div className="resume-tailor-result__section-header">
          <h3>
            <FiMinusCircle />
            Skipped changes
          </h3>
        </div>

        {hasSkippedChanges ? (
          <div className="resume-tailor-result__list">
            {result.skippedChanges.map((change) => (
              <article
                key={`${change.lineId}-${change.page}-skipped`}
                className="resume-tailor-result__item resume-tailor-result__item--muted"
              >
                <div className="resume-tailor-result__item-top">
                  <span>Page {change.page}</span>
                  <span>Line {change.lineId}</span>
                </div>
                <p className="resume-tailor-result__item-text">
                  <strong>Original:</strong> {change.originalText}
                </p>
                <p className="resume-tailor-result__item-text">
                  <strong>Attempted:</strong> {change.attemptedText}
                </p>
                <p className="resume-tailor-result__item-reason">
                  {change.reason}
                </p>
                <p className="resume-tailor-result__item-footnote">
                  Skipped because: {change.skippedBecause}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="resume-tailor-result__placeholder">
            No changes had to be skipped in this run.
          </div>
        )}
      </div>

      <div className="resume-tailor-result__section">
        <div className="resume-tailor-result__section-header">
          <h3>
            <FiFileText />
            PDF preview
          </h3>
        </div>

        {previewUrl ? (
          <div className="resume-tailor-result__preview-frame">
            <iframe
              src={previewUrl}
              title="Tailored resume preview"
              className="resume-tailor-result__iframe"
            />
          </div>
        ) : (
          <div className="resume-tailor-result__placeholder">
            Preview is temporarily unavailable. You can still download the final
            PDF.
          </div>
        )}
      </div>
    </section>
  );
}
