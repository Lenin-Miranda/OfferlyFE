"use client";

import {
  type ChangeEvent,
  type ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiAtSign,
  FiBriefcase,
  FiGlobe,
  FiLayers,
  FiMapPin,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiTarget,
  FiUser,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import MessageNotification from "../components/MessageNotification";
import {
  EMPTY_PROFILE,
  getProfile,
  parseCommaSeparatedList,
  updateProfile,
} from "@/lib/profile";
import { Profile, ProfileUpdatePayload, RemotePreference } from "@/types";
import "./page.css";

interface ProfileFormState {
  fullName: string;
  email: string;
  location: string;
  summary: string;
  yearsExperience: string;
  remotePreference: RemotePreference;
  workAuthorization: string;
  skillsInput: string;
  targetRolesInput: string;
  preferredLocationsInput: string;
}

const REMOTE_PREFERENCE_OPTIONS: Array<{
  value: RemotePreference;
  label: string;
}> = [
  { value: "unspecified", label: "Unspecified" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
  { value: "flexible", label: "Flexible" },
];

type ProfileFieldChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

function buildFormState(profile: Profile): ProfileFormState {
  return {
    fullName: profile.fullName,
    email: profile.email,
    location: profile.location,
    summary: profile.summary,
    yearsExperience: String(profile.yearsExperience),
    remotePreference: profile.remotePreference,
    workAuthorization: profile.workAuthorization,
    skillsInput: profile.skills.join(", "),
    targetRolesInput: profile.targetRoles.join(", "),
    preferredLocationsInput: profile.preferredLocations.join(", "),
  };
}

function buildProfilePayload(form: ProfileFormState): ProfileUpdatePayload {
  return {
    fullName: form.fullName.trim(),
    location: form.location.trim(),
    summary: form.summary.trim(),
    yearsExperience: Number(form.yearsExperience || 0),
    remotePreference: form.remotePreference,
    workAuthorization: form.workAuthorization.trim(),
    skills: parseCommaSeparatedList(form.skillsInput),
    targetRoles: parseCommaSeparatedList(form.targetRolesInput),
    preferredLocations: parseCommaSeparatedList(form.preferredLocationsInput),
  };
}

function validateProfileForm(form: ProfileFormState) {
  const fieldErrors: Partial<Record<keyof ProfileFormState, string>> = {};

  if (form.fullName.trim().length > 120) {
    fieldErrors.fullName = "Full name should stay under 120 characters.";
  }

  if (form.location.trim().length > 120) {
    fieldErrors.location = "Location should stay under 120 characters.";
  }

  if (form.summary.trim().length > 800) {
    fieldErrors.summary = "Summary should stay under 800 characters.";
  }

  if (!/^\d+$/.test(form.yearsExperience.trim())) {
    fieldErrors.yearsExperience = "Years of experience must be 0 or more.";
  }

  if (Number(form.yearsExperience) > 60) {
    fieldErrors.yearsExperience = "Years of experience looks too high.";
  }

  if (form.workAuthorization.trim().length > 120) {
    fieldErrors.workAuthorization =
      "Work authorization should stay under 120 characters.";
  }

  return fieldErrors;
}

function getProfileReadiness(profile: Profile) {
  const completedFields = [
    profile.fullName,
    profile.location,
    profile.summary,
    profile.workAuthorization,
    profile.skills.length > 0 ? "skills" : "",
    profile.targetRoles.length > 0 ? "roles" : "",
    profile.preferredLocations.length > 0 ? "locations" : "",
    profile.remotePreference !== "unspecified" ? profile.remotePreference : "",
  ].filter(Boolean).length;

  return Math.round((completedFields / 8) * 100);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [formState, setFormState] = useState<ProfileFormState>(
    buildFormState(EMPTY_PROFILE),
  );
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ProfileFormState, string>>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const loadProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError("");
      const nextProfile = await getProfile();
      setProfile(nextProfile);
      setFormState(buildFormState(nextProfile));
    } catch {
      setLoadError("We couldn't load your profile right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfileData();
  }, [loadProfileData]);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotification(null);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const parsedSkills = useMemo(
    () => parseCommaSeparatedList(formState.skillsInput),
    [formState.skillsInput],
  );
  const parsedTargetRoles = useMemo(
    () => parseCommaSeparatedList(formState.targetRolesInput),
    [formState.targetRolesInput],
  );
  const parsedPreferredLocations = useMemo(
    () => parseCommaSeparatedList(formState.preferredLocationsInput),
    [formState.preferredLocationsInput],
  );
  const readiness = useMemo(() => getProfileReadiness(profile), [profile]);
  const isProfileEmpty = useMemo(
    () =>
      !formState.fullName.trim() &&
      !formState.location.trim() &&
      !formState.summary.trim() &&
      !formState.workAuthorization.trim() &&
      Number(formState.yearsExperience || 0) === 0 &&
      formState.remotePreference === "unspecified" &&
      parsedSkills.length === 0 &&
      parsedTargetRoles.length === 0 &&
      parsedPreferredLocations.length === 0,
    [
      formState.fullName,
      formState.location,
      formState.remotePreference,
      formState.summary,
      formState.workAuthorization,
      formState.yearsExperience,
      parsedPreferredLocations.length,
      parsedSkills.length,
      parsedTargetRoles.length,
    ],
  );

  const handleInputChange = (event: ProfileFieldChangeEvent) => {
    const { name, value } = event.target;

    setFormState((current) => ({
      ...current,
      [name]: value,
    }));

    if (fieldErrors[name as keyof ProfileFormState]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const handleReset = () => {
    setFormState(buildFormState(profile));
    setFieldErrors({});
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateProfileForm(formState);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setNotification({
        message: "Please fix the highlighted profile fields and try again.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildProfilePayload(formState);
      const response = await updateProfile(payload);
      setProfile(response.profile);
      setFormState(buildFormState(response.profile));
      setFieldErrors({});
      setNotification({
        message: response.message,
        type: "success",
      });
    } catch {
      setNotification({
        message: "We couldn't save your profile. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const stats = [
    {
      label: "Profile readiness",
      value: `${readiness}%`,
      icon: FiTarget,
    },
    {
      label: "Skills captured",
      value: String(profile.skills.length),
      icon: FiLayers,
    },
    {
      label: "Target roles",
      value: String(profile.targetRoles.length),
      icon: FiBriefcase,
    },
  ];

  return (
    <>
      <Sidebar />
      <main className="profile-page">
        <section className="profile-page__hero" data-aos="fade-up">
          <div className="profile-page__hero-copy">
            <span className="profile-page__eyebrow">Profile</span>
            <h1 className="profile-page__title">
              Keep your professional profile ready for better job-fit analysis
            </h1>
            <p className="profile-page__subtitle">
              Your profile powers Offerly&apos;s ltcScore advisory. Keep it sharp
              so every application gets a more useful recommendation.
            </p>
          </div>

          <div className="profile-page__hero-actions">
            <Link href="/dashboard/applications" className="profile-page__button">
              View applications
              <FiArrowRight />
            </Link>
          </div>
        </section>

        <section
          className="profile-page__stats"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          {stats.map((stat) => (
            <article key={stat.label} className="profile-page__stat-card">
              <stat.icon />
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </section>

        {loadError ? (
          <section
            className="profile-page__state-card"
            data-aos="fade-up"
            data-aos-delay="140"
          >
            <strong>Profile unavailable</strong>
            <p>{loadError}</p>
            <button
              type="button"
              className="profile-page__state-action"
              onClick={() => void loadProfileData()}
            >
              <FiRefreshCw />
              Retry
            </button>
          </section>
        ) : null}

        {!loadError ? (
          <section
            className="profile-page__form-shell"
            data-aos="fade-up"
            data-aos-delay="140"
          >
            <div className="profile-page__form-head">
              <div>
                <span className="profile-page__section-eyebrow">
                  Professional details
                </span>
                <h2>Your Offerly profile</h2>
              </div>
              <p>
                Email stays read-only here. Everything else can be updated at any
                time and will be used on the next application analysis.
              </p>
            </div>

            {isLoading ? (
              <div className="profile-page__state-card profile-page__state-card--soft">
                <strong>Loading profile...</strong>
                <p>We&apos;re pulling in your latest professional details.</p>
              </div>
            ) : (
              <form className="profile-page__form" onSubmit={handleSubmit}>
                {isProfileEmpty ? (
                  <div className="profile-page__empty-banner">
                    <strong>Your profile is still mostly blank.</strong>
                    <p>
                      Add your skills, experience, and target roles so future
                      applications can get a stronger ltcScore recommendation.
                    </p>
                  </div>
                ) : null}

                <div className="profile-page__grid">
                  <label className="profile-page__field">
                    <span className="profile-page__field-label">
                      <FiUser />
                      Full name
                    </span>
                    <input
                      type="text"
                      name="fullName"
                      value={formState.fullName}
                      onChange={handleInputChange}
                      className="profile-page__input"
                      placeholder="Your full name"
                    />
                    {fieldErrors.fullName ? (
                      <span className="profile-page__field-error">
                        {fieldErrors.fullName}
                      </span>
                    ) : null}
                  </label>

                  <label className="profile-page__field">
                    <span className="profile-page__field-label">
                      <FiAtSign />
                      Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      readOnly
                      className="profile-page__input profile-page__input--readonly"
                      placeholder="Email address"
                    />
                  </label>

                  <label className="profile-page__field">
                    <span className="profile-page__field-label">
                      <FiMapPin />
                      Location
                    </span>
                    <input
                      type="text"
                      name="location"
                      value={formState.location}
                      onChange={handleInputChange}
                      className="profile-page__input"
                      placeholder="San Francisco, CA"
                    />
                    {fieldErrors.location ? (
                      <span className="profile-page__field-error">
                        {fieldErrors.location}
                      </span>
                    ) : null}
                  </label>

                  <label className="profile-page__field">
                    <span className="profile-page__field-label">
                      <FiBriefcase />
                      Years of experience
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      name="yearsExperience"
                      value={formState.yearsExperience}
                      onChange={handleInputChange}
                      className="profile-page__input"
                      placeholder="0"
                    />
                    {fieldErrors.yearsExperience ? (
                      <span className="profile-page__field-error">
                        {fieldErrors.yearsExperience}
                      </span>
                    ) : null}
                  </label>

                  <label className="profile-page__field profile-page__field--full">
                    <span className="profile-page__field-label">
                      <FiLayers />
                      Professional summary
                    </span>
                    <textarea
                      name="summary"
                      value={formState.summary}
                      onChange={handleInputChange}
                      className="profile-page__textarea"
                      rows={4}
                      placeholder="A concise summary of your experience, strengths, and goals."
                    />
                    {fieldErrors.summary ? (
                      <span className="profile-page__field-error">
                        {fieldErrors.summary}
                      </span>
                    ) : null}
                  </label>

                  <TagField
                    icon={FiLayers}
                    label="Skills"
                    name="skillsInput"
                    placeholder="React, TypeScript, Design systems"
                    value={formState.skillsInput}
                    tags={parsedSkills}
                    onChange={handleInputChange}
                  />

                  <TagField
                    icon={FiTarget}
                    label="Target roles"
                    name="targetRolesInput"
                    placeholder="Frontend Engineer, Product Engineer"
                    value={formState.targetRolesInput}
                    tags={parsedTargetRoles}
                    onChange={handleInputChange}
                  />

                  <TagField
                    icon={FiGlobe}
                    label="Preferred locations"
                    name="preferredLocationsInput"
                    placeholder="Remote, New York, Austin"
                    value={formState.preferredLocationsInput}
                    tags={parsedPreferredLocations}
                    onChange={handleInputChange}
                  />

                  <label className="profile-page__field">
                    <span className="profile-page__field-label">
                      <FiTarget />
                      Remote preference
                    </span>
                    <select
                      name="remotePreference"
                      value={formState.remotePreference}
                      onChange={handleInputChange}
                      className="profile-page__input profile-page__select"
                    >
                      {REMOTE_PREFERENCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="profile-page__field">
                    <span className="profile-page__field-label">
                      <FiShield />
                      Work authorization
                    </span>
                    <input
                      type="text"
                      name="workAuthorization"
                      value={formState.workAuthorization}
                      onChange={handleInputChange}
                      className="profile-page__input"
                      placeholder="US citizen, visa sponsorship required, etc."
                    />
                    {fieldErrors.workAuthorization ? (
                      <span className="profile-page__field-error">
                        {fieldErrors.workAuthorization}
                      </span>
                    ) : null}
                  </label>
                </div>

                <div className="profile-page__actions">
                  <button
                    type="button"
                    className="profile-page__button profile-page__button--secondary"
                    onClick={handleReset}
                    disabled={isSaving || isLoading}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="profile-page__button profile-page__button--primary"
                    disabled={isSaving || isLoading}
                  >
                    <FiSave />
                    {isSaving ? "Saving..." : "Save profile"}
                  </button>
                </div>
              </form>
            )}
          </section>
        ) : null}
      </main>

      {notification ? (
        <MessageNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      ) : null}
    </>
  );
}

function TagField({
  icon: Icon,
  label,
  name,
  placeholder,
  value,
  tags,
  onChange,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  name: keyof Pick<
    ProfileFormState,
    "skillsInput" | "targetRolesInput" | "preferredLocationsInput"
  >;
  placeholder: string;
  value: string;
  tags: string[];
  onChange: (event: ProfileFieldChangeEvent) => void;
}) {
  return (
    <label className="profile-page__field">
      <span className="profile-page__field-label">
        <Icon />
        {label}
      </span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="profile-page__input"
        placeholder={placeholder}
      />
      <span className="profile-page__field-hint">
        Separate items with commas.
      </span>
      <div className="profile-page__tags">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span key={tag} className="profile-page__tag">
              {tag}
            </span>
          ))
        ) : (
          <span className="profile-page__tag profile-page__tag--empty">
            No items yet
          </span>
        )}
      </div>
    </label>
  );
}
