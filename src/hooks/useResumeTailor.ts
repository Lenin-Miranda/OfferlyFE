"use client";

import { useEffect, useState } from "react";
import { tailorResumeWithAI } from "@/lib/application";
import { ResumeTailorResponse } from "@/types";
import { createPdfBlobUrl, downloadPdfFile } from "@/utils/pdf";

interface SubmitTailorResumeParams {
  resumeFile: File;
  jobPost: string;
}

export function useResumeTailor() {
  const [result, setResult] = useState<ResumeTailorResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!result) {
      setPreviewUrl(null);
      return undefined;
    }

    const nextPreviewUrl = createPdfBlobUrl(result.pdfBase64, result.mimeType);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [result]);

  const submitTailorResume = async ({
    resumeFile,
    jobPost,
  }: SubmitTailorResumeParams) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const tailoredResume = await tailorResumeWithAI(resumeFile, jobPost);
      setResult(tailoredResume);
      return tailoredResume;
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "We couldn't tailor your resume right now. Please try again.";
      setError(message);
      throw submitError;
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const downloadTailoredResume = () => {
    if (!result) {
      return;
    }

    downloadPdfFile(result.pdfBase64, result.mimeType, result.fileName);
  };

  return {
    result,
    previewUrl,
    isLoading,
    error,
    submitTailorResume,
    clearResult,
    clearError,
    downloadTailoredResume,
  };
}
