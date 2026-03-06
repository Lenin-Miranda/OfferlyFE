import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <section className="howitworks">
      <div className="howitworks__container">
        <h2 className="howitworks__title" data-aos="fade-up">
          How It Works
        </h2>
        <p
          className="howitworks__subtitle"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Track your job applications in three simple steps
        </p>

        <div className="howitworks__steps">
          {/* Step 1 */}
          <div
            className="howitworks__step"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div className="howitworks__step-number">1</div>
            <div className="howitworks__step-content">
              <h3 className="howitworks__step-title">Add Your Applications</h3>
              <p className="howitworks__step-description">
                Quickly log job opportunities with company details, position,
                and status. Save links, deadlines, and notes all in one place.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="howitworks__step"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="howitworks__step-number">2</div>
            <div className="howitworks__step-content">
              <h3 className="howitworks__step-title">Track Your Progress</h3>
              <p className="howitworks__step-description">
                Monitor each stage from application to offer. Update statuses,
                schedule interviews, and never miss a follow-up with smart
                reminders.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className="howitworks__step"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            <div className="howitworks__step-number">3</div>
            <div className="howitworks__step-content">
              <h3 className="howitworks__step-title">Analyze & Optimize</h3>
              <p className="howitworks__step-description">
                Get insights on your application success rate, response times,
                and interview conversion. Make data-driven decisions to improve
                your job hunt.
              </p>
            </div>
          </div>
        </div>

        <div
          className="howitworks__cta"
          data-aos="zoom-in"
          data-aos-delay="500"
        >
          <button className="howitworks__btn">Get Started Free</button>
        </div>
      </div>
    </section>
  );
}
