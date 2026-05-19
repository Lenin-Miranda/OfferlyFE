"use client";

import Link from "next/link";
import { FiAlertCircle, FiArrowRight, FiTarget } from "react-icons/fi";
import { Application } from "@/types";
import { cn } from "@/utils/helpers";
import "./LtcScoreCard.css";

interface LtcScoreCardProps {
  application: Application;
  compact?: boolean;
  onEditApplication?: (application: Application) => void;
  className?: string;
}

const RECOMMENDATION_META = {
  apply: {
    label: "Apply",
    tone: "success",
  },
  consider: {
    label: "Consider",
    tone: "warning",
  },
  skip: {
    label: "Skip",
    tone: "danger",
  },
} as const;

function getRecommendationMeta(recommendation?: string | null) {
  if (!recommendation) {
    return {
      label: "Needs review",
      tone: "neutral",
    } as const;
  }

  const normalizedRecommendation = recommendation.toLowerCase();

  if (normalizedRecommendation in RECOMMENDATION_META) {
    return RECOMMENDATION_META[
      normalizedRecommendation as keyof typeof RECOMMENDATION_META
    ];
  }

  return {
    label: recommendation,
    tone: "neutral",
  } as const;
}

function getSkippedAnalysisCopy(reason?: string | null) {
  switch (reason) {
    case "missing_job_description":
      return {
        title: "Add the job description to get a match score.",
        description:
          "Including responsibilities and requirements helps Offerly compare the role against your profile.",
        ctaLabel: "Add description",
        ctaType: "edit",
      } as const;
    case "insufficient_profile":
      return {
        title: "Complete your profile to unlock a better match analysis.",
        description:
          "Add your experience, skills, and target roles so the score can reflect your actual fit.",
        ctaLabel: "Complete profile",
        ctaType: "profile",
      } as const;
    case "analysis_failed":
      return {
        title:
          "We couldn’t analyze this job right now. Try updating the application again later.",
        description:
          "The application is still saved, but the advisory could not be generated this time.",
        ctaLabel: null,
        ctaType: null,
      } as const;
    default:
      return {
        title: "No match analysis is available for this application yet.",
        description:
          "You can still track the role normally and refresh it later by editing the application.",
        ctaLabel: null,
        ctaType: null,
      } as const;
  }
}

function formatGeneratedAt(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderListItems(items: string[], compact: boolean) {
  const visibleItems = compact ? items.slice(0, 2) : items;

  return visibleItems.map((item) => (
    <li key={item} className="ltc-score-card__signal-item">
      {item}
    </li>
  ));
}

export default function LtcScoreCard({
  application,
  compact = false,
  onEditApplication,
  className,
}: LtcScoreCardProps) {
  const analysis = application.ltcAnalysis ?? null;

  if (!analysis) {
    const skippedCopy = getSkippedAnalysisCopy(application.analysisSkippedReason);

    return (
      <section
        className={cn(
          "ltc-score-card",
          "ltc-score-card--empty",
          compact && "ltc-score-card--compact",
          className,
        )}
      >
        <div className="ltc-score-card__header">
          <div className="ltc-score-card__title-wrap">
            <span className="ltc-score-card__eyebrow">ltcScore advisory</span>
            <strong>Match score unavailable</strong>
          </div>
          <FiAlertCircle className="ltc-score-card__empty-icon" />
        </div>

        <p className="ltc-score-card__summary">{skippedCopy.title}</p>
        <p className="ltc-score-card__caption">{skippedCopy.description}</p>

        {skippedCopy.ctaType === "profile" ? (
          <Link href="/dashboard/profile" className="ltc-score-card__cta">
            {skippedCopy.ctaLabel}
            <FiArrowRight />
          </Link>
        ) : null}

        {skippedCopy.ctaType === "edit" && onEditApplication ? (
          <button
            type="button"
            className="ltc-score-card__cta ltc-score-card__cta--button"
            onClick={() => onEditApplication(application)}
          >
            {skippedCopy.ctaLabel}
            <FiArrowRight />
          </button>
        ) : null}
      </section>
    );
  }

  const recommendation = getRecommendationMeta(analysis.recommendation);
  const generatedAt = formatGeneratedAt(analysis.generatedAt);
  const signalGroups = [
    {
      label: "Matched",
      items: analysis.matchedSignals,
      emptyLabel: "No matched signals highlighted yet.",
    },
    {
      label: "Gaps",
      items: analysis.gaps,
      emptyLabel: "No major gaps called out.",
    },
    {
      label: "Profile signals",
      items: analysis.missingProfileSignals,
      emptyLabel: "No missing profile signals reported.",
    },
  ];

  return (
    <section
      className={cn(
        "ltc-score-card",
        `ltc-score-card--${recommendation.tone}`,
        compact && "ltc-score-card--compact",
        className,
      )}
    >
      <div className="ltc-score-card__header">
        <div className="ltc-score-card__title-wrap">
          <span className="ltc-score-card__eyebrow">ltcScore advisory</span>
          <strong>Role match</strong>
        </div>

        <div className="ltc-score-card__score-wrap">
          <div className="ltc-score-card__score">
            <FiTarget />
            <span>{analysis.score}</span>
          </div>
          <span
            className={`ltc-score-card__badge ltc-score-card__badge--${recommendation.tone}`}
          >
            {recommendation.label}
          </span>
        </div>
      </div>

      <p className="ltc-score-card__summary">{analysis.summary}</p>

      {generatedAt ? (
        <p className="ltc-score-card__caption">Updated {generatedAt}</p>
      ) : null}

      <div className="ltc-score-card__signals">
        {signalGroups.map((group) => (
          <div key={group.label} className="ltc-score-card__signal-group">
            <span className="ltc-score-card__signal-label">{group.label}</span>
            {group.items.length > 0 ? (
              <ul className="ltc-score-card__signal-list">
                {renderListItems(group.items, compact)}
              </ul>
            ) : (
              <p className="ltc-score-card__signal-empty">{group.emptyLabel}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
