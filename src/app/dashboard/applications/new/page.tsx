"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CircleCheckBig,
  FileText,
  Info,
  Link2,
  MapPin,
  MessageSquareText,
  Plus,
  Target,
  Wallet,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import { ApplicationPayload, ApplicationStatus } from "@/types";
import { getApplicationMutationSuccessMessage } from "../../applicationHelpers";
import "./page.css";

const STATUS_OPTIONS = [
  { value: ApplicationStatus.SAVED, label: "Saved" },
  { value: ApplicationStatus.APPLIED, label: "Applied" },
  { value: ApplicationStatus.INTERVIEWING, label: "Interviewing" },
  { value: ApplicationStatus.OFFER, label: "Offer" },
  { value: ApplicationStatus.REJECTED, label: "Rejected" },
  { value: ApplicationStatus.ACCEPTED, label: "Accepted" },
  { value: ApplicationStatus.WITHDRAWN, label: "Withdrawn" },
  { value: ApplicationStatus.GHOSTED, label: "Ghosted" },
] as const;

const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "CAD", "MXN"] as const;

function getInitialFormData() {
  return {
    company: "",
    position: "",
    status: ApplicationStatus.SAVED,
    location: "",
    salary: "",
    currency: "USD",
    jobUrl: "",
    description: "",
    appliedAt: "",
    notes: "",
  };
}

export default function NewApplicationPage() {
  const router = useRouter();
  const { addApplication, setIsMessage, setMessageType } =
    useContext(ApplicationContext);
  const [formData, setFormData] = useState(getInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.company || !formData.position || !formData.status) {
      setErrorMessage(
        "Please complete the required fields: company, position, and status.",
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload: ApplicationPayload = {
      ...formData,
      salary: formData.salary === "" ? undefined : Number(formData.salary),
      appliedAt: formData.appliedAt
        ? new Date(formData.appliedAt).toISOString()
        : undefined,
    };

    try {
      const createdApplication = await addApplication(payload);
      setMessageType("success");
      setIsMessage(
        getApplicationMutationSuccessMessage(createdApplication, "added"),
      );
      router.push("/dashboard/applications");
    } catch {
      setErrorMessage("We couldn't add the application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sidebar />
      <main className="new-application-page">
        <section className="new-application-page__hero" data-aos="fade-up">
          <Link
            href="/dashboard/applications"
            className="new-application-page__back-link"
          >
            <ArrowLeft />
            Back to applications board
          </Link>
          <p className="new-application-page__subtitle">
            Add the role details you want to track now. You can update status,
            notes, and the rest of the workflow later from the board.
          </p>
        </section>

        <section className="new-application-page__layout" data-aos="fade-up">
          <form
            className="new-application-page__form-shell"
            onSubmit={handleSubmit}
          >
            <div className="new-application-page__section-row">
              <div className="new-application-page__section">
                <div className="new-application-page__section-head">
                  <h2>Core job details</h2>
                  <p>
                    Start with the fields you need to recognize the opportunity at
                    a glance.
                  </p>
                </div>

                <div className="new-application-page__grid new-application-page__grid--two">
                  <label className="new-application-page__field">
                    <span>
                      <BriefcaseBusiness />
                      Company *
                    </span>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Google, Stripe, Airbnb"
                      required
                    />
                  </label>

                  <label className="new-application-page__field">
                    <span>
                      <Target />
                      Position *
                    </span>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Frontend Engineer"
                      required
                    />
                  </label>

                  <label className="new-application-page__field">
                    <span>
                      <CircleCheckBig />
                      Status *
                    </span>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="new-application-page__field">
                    <span>
                      <MapPin />
                      Location
                    </span>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="San Francisco, CA or Remote"
                    />
                  </label>
                </div>
              </div>

              <div className="new-application-page__section new-application-page__section--split-right">
                <div className="new-application-page__section-head">
                  <h2>Timing and pay</h2>
                  <p>
                    Capture when you applied and the salary data you want to compare
                    later.
                  </p>
                </div>

                <div className="new-application-page__grid new-application-page__grid--timing">
                  <label className="new-application-page__field">
                    <span>
                      <Wallet />
                      Salary
                    </span>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="120000"
                      min="0"
                    />
                  </label>

                  <label className="new-application-page__field">
                    <span>
                      <CalendarDays />
                      Date applied
                    </span>
                    <input
                      type="date"
                      name="appliedAt"
                      value={formData.appliedAt}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="new-application-page__field">
                    <span>
                      <Wallet />
                      Currency
                    </span>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      {CURRENCY_OPTIONS.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className="new-application-page__section">
              <div className="new-application-page__section-head">
                <h2>Job post and notes</h2>
                <p>
                  The more context you save here, the easier it is to come back
                  ready for the next step.
                </p>
              </div>

              <div className="new-application-page__grid new-application-page__grid--context">
                <label className="new-application-page__field new-application-page__field--full">
                  <span>
                    <Link2 />
                    Job URL
                  </span>
                  <input
                    type="url"
                    name="jobUrl"
                    value={formData.jobUrl}
                    onChange={handleChange}
                    placeholder="https://company.com/careers/role"
                  />
                </label>

                <label className="new-application-page__field new-application-page__field--large">
                  <span>
                    <FileText />
                    Description
                  </span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Paste the job description, responsibilities, requirements, and anything you want to keep for later."
                  />
                  <small>
                    <Info />
                    Adding the job description improves the ltcScore match
                    analysis.
                  </small>
                </label>

                <label className="new-application-page__field new-application-page__field--large">
                  <span>
                    <MessageSquareText />
                    Notes
                  </span>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Referral details, recruiter notes, interview prep, follow-up plan, or anything else you want attached to this role."
                  />
                </label>
              </div>
            </div>

            <div className="new-application-page__actions">
              <Link
                href="/dashboard/applications"
                className="new-application-page__button new-application-page__button--secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="new-application-page__button new-application-page__button--primary"
                disabled={isSubmitting}
              >
                <Plus />
                {isSubmitting ? "Saving application..." : "Create application"}
              </button>
            </div>
          </form>
        </section>
      </main>

      {errorMessage ? (
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      ) : null}
    </>
  );
}
