import "./Hero.css";
import TypeWriter from "../TypeWriter/TypeWriter";
export default function Hero() {
  const texts = ["tracking.", "landing offers.", "growing.", "managing."];
  return (
    <section className="hero">
      <div className="hero__text-container">
        <p data-aos="fade-down" className="hero__text-subtitle">
          Manage applications, interviews, and offers in one clean dashboard.
          Never miss a follow-up again.
        </p>
        <h1 data-aos="fade-up" className="hero__title">
          Stop guessing. <br />
          <span>
            Start {""}
            <TypeWriter texts={texts} typingSpeed={80} deletingSpeed={70} />
          </span>
        </h1>
      </div>
      <div data-aos="fade-up" className="hero__btn-container">
        <button className="hero__btn">Start Tracking</button>
        <button className="hero__btn">See How It Works</button>
      </div>
    </section>
  );
}
