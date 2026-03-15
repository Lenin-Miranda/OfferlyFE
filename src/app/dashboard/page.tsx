import "./page.css";

export default function DashBoard() {
  return (
    <section className="dashboard">
      <div className="dashboard__ctn">
        <h1 className="dashboard__ctn-title">Dashboard</h1>
        <p className="dashboard__ctn-subtitle">
          Start tracking you application
        </p>
      </div>
      <div className="dashboard__ctn">
        <div className="dashboard__button-ctn">
          <p className="dashboard__p-ctn">
            Click the button and start tracking you application
          </p>
          <button className="dashboard__ctn-btn">Add Application</button>
        </div>
      </div>
    </section>
  );
}
