"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiZap } from "react-icons/fi";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { ErrorContext } from "@/contexts/ErrorContext";
import Sidebar from "../components/Sidebar";
import ResumeTailorForm from "../components/ResumeTailorForm";
import ResumeTailorResult from "../components/ResumeTailorResult";
import { useResumeTailor } from "@/hooks/useResumeTailor";
import "./page.css";

export default function TaylorPage() {
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
        <header className="taylor-page__header" data-aos="fade-up">
          <span className="taylor-page__eyebrow">Taylor Workspace</span>
          <h1 className="taylor-page__title">
            Tailor each resume to the role without losing your format
          </h1>
          <div className="taylor-page__hints">
            <span>
              <FiCheckCircle />
              Preserves your PDF layout whenever possible
            </span>
            <span>
              <FiZap />
              Skips edits that would break the available line space
            </span>
          </div>
        </header>

        <section className="taylor-page__content">
          <div
            className="taylor-page__form-panel"
            data-aos="fade-right"
            data-aos-delay="80"
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
            data-aos-delay="120"
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
