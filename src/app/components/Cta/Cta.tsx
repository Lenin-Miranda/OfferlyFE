import "./Cta.css";

export default function Cta() {
  return (
    <section className="cta">
      <div className="cta__content">
        <h2 className="cta__title">
          Ready to take control of your job search?
        </h2>
        <p className="cta__subtitle">
          Join thousands of professionals who are already tracking their
          applications smarter.
        </p>
        <div className="cta__btn-container">
          <button className="cta__btn cta__btn-primary">Iniciar Ahora</button>
        </div>
      </div>
    </section>
  );
}
