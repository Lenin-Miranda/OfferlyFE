"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiFileText,
  FiTarget,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import ResumeTailorForm from "../components/ResumeTailorForm";
import ResumeTailorResult from "../components/ResumeTailorResult";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import { ApplicationStatus } from "@/types";
import { useResumeTailor } from "@/hooks/useResumeTailor";
import "./page.css";

const CLOSED_STATUSES = [
  ApplicationStatus.REJECTED,
  ApplicationStatus.ACCEPTED,
  ApplicationStatus.WITHDRAWN,
  ApplicationStatus.GHOSTED,
];

export default function TaylorPage() {
  const { applications } = useContext(ApplicationContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobPost, setJobPost] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const resultPanelRef = useRef<HTMLDivElement>(null);
  const {
    result,
    previewUrl,
    isLoading,
    error,
    submitTailorResume,
    clearResult,
    clearError,
    downloadTailoredResume,
  } = useResumeTailor();

  useEffect(() => {
    if (result || isLoading) {
      resultPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result, isLoading]);

  const applicationStats = useMemo(() => {
    const activeApplications = applications.filter(
      (application) => !CLOSED_STATUSES.includes(application.status),
    ).length;
    const interviewingApplications = applications.filter((application) =>
      [ApplicationStatus.INTERVIEWING, ApplicationStatus.OFFER].includes(
        application.status,
      ),
    ).length;

    return {
      total: applications.length,
      active: activeApplications,
      interviewing: interviewingApplications,
    };
  }, [applications]);

  const displayedError = formError ?? error;

  const handleFileChange = (file: File | null) => {
    clearError();
    setFormError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const isPdfFile =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdfFile) {
      setSelectedFile(null);
      setFormError("Please upload a PDF resume to continue.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    clearError();
    setFormError(null);

    if (!selectedFile) {
      setFormError("Upload your PDF resume before tailoring it.");
      return;
    }

    if (!jobPost.trim()) {
      setFormError("Paste the full job post so we can tailor the resume.");
      return;
    }

    try {
      await submitTailorResume({
        resumeFile: selectedFile,
        jobPost: jobPost.trim(),
      });
    } catch {
      // Error state is already handled inside the hook.
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setJobPost("");
    setFormError(null);
    clearError();
    clearResult();
  };

  return (
    <>
      <Sidebar />
      <main className="applications-page">
        <section className="applications-page__hero">
          <div className="applications-page__hero-copy">
            <span className="applications-page__eyebrow">Taylor Workspace</span>
            <h1 className="applications-page__title">
              Tailor each resume to the job without losing your format
            </h1>
            <p className="applications-page__subtitle">
              Upload a PDF, paste the full job post, and review every applied or
              skipped change before you send your application.
            </p>
          </div>

          <div className="applications-page__stats">
            <article className="applications-page__stat-card">
              <FiBriefcase />
              <strong>{applicationStats.total}</strong>
              <span>Total applications tracked</span>
            </article>
            <article className="applications-page__stat-card">
              <FiTarget />
              <strong>{applicationStats.active}</strong>
              <span>Active applications</span>
            </article>
            <article className="applications-page__stat-card">
              <FiCheckCircle />
              <strong>{applicationStats.interviewing}</strong>
              <span>Interview pipeline</span>
            </article>
          </div>
        </section>

        <section className="applications-page__guidance">
          <div className="applications-page__guidance-card">
            <FiFileText />
            <p>
              The AI tries to preserve the same resume layout and may skip edits
              when a replacement would break the available line space.
            </p>
          </div>
        </section>

        <section className="applications-page__content">
          <div className="applications-page__form-panel">
            <ResumeTailorForm
              selectedFile={selectedFile}
              jobPost={jobPost}
              isSubmitting={isLoading}
              errorMessage={displayedError}
              onFileChange={handleFileChange}
              onJobPostChange={setJobPost}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
          </div>

          <div ref={resultPanelRef} className="applications-page__result-panel">
            <ResumeTailorResult
              result={result}
              previewUrl={previewUrl}
              isLoading={isLoading}
              onDownload={downloadTailoredResume}
              onReset={handleReset}
            />
          </div>
        </section>
      </main>
    </>
  );
}
