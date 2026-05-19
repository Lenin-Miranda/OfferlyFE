"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiFileText,
  FiTarget,
} from "react-icons/fi";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { ErrorContext } from "@/contexts/ErrorContext";
import Sidebar from "../components/Sidebar";
import ResumeTailorForm from "../components/ResumeTailorForm";
import ResumeTailorResult from "../components/ResumeTailorResult";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import { useResumeTailor } from "@/hooks/useResumeTailor";
import { getApplicationOverviewStats } from "../applicationHelpers";
import "./page.css";

export default function TaylorPage() {
  const { applications } = useContext(ApplicationContext);
  const { setErrorMessage, isOpen, setIsOpen } = useContext(ErrorContext);
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

  const applicationStats = useMemo(
    () => getApplicationOverviewStats(applications),
    [applications],
  );

  const displayedError = formError ?? error;

  useEffect(() => {
    if (displayedError) {
      setErrorMessage(displayedError);
      setIsOpen(true);
      return;
    }

    setErrorMessage("");
    setIsOpen(false);
  }, [displayedError, setErrorMessage, setIsOpen]);

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
      <main className="taylor-page">
        <section className="taylor-page__hero" data-aos="fade-up">
          <div className="taylor-page__hero-copy">
            <span className="taylor-page__eyebrow">Taylor Workspace</span>
            <h1 className="taylor-page__title">
              Tailor each resume to the job without losing your format
            </h1>
            <p className="taylor-page__subtitle">
              Upload a PDF, paste the full job post, and review every applied or
              skipped change before you send your application.
            </p>
          </div>

          <div className="taylor-page__stats">
            <article className="taylor-page__stat-card">
              <FiBriefcase />
              <strong>{applicationStats.total}</strong>
              <span>Total applications tracked</span>
            </article>
            <article className="taylor-page__stat-card">
              <FiTarget />
              <strong>{applicationStats.active}</strong>
              <span>Active applications</span>
            </article>
            <article className="taylor-page__stat-card">
              <FiCheckCircle />
              <strong>{applicationStats.interviewing}</strong>
              <span>Interview pipeline</span>
            </article>
          </div>
        </section>

        <section
          className="taylor-page__guidance"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="taylor-page__guidance-card">
            <FiFileText />
            <p>
              The AI tries to preserve the same resume layout and may skip edits
              when a replacement would break the available line space.
            </p>
          </div>
        </section>

        <section className="taylor-page__content">
          <div
            className="taylor-page__form-panel"
            data-aos="fade-right"
            data-aos-delay="140"
          >
            <ResumeTailorForm
              selectedFile={selectedFile}
              jobPost={jobPost}
              isSubmitting={isLoading}
              onFileChange={handleFileChange}
              onJobPostChange={setJobPost}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
          </div>

          <div
            ref={resultPanelRef}
            className="taylor-page__result-panel"
            data-aos="fade-left"
            data-aos-delay="200"
          >
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

      {isOpen ? <ErrorMessage /> : null}
    </>
  );
}
