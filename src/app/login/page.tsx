"use client";
import { useState, useEffect } from "react";
import "./page.css";
export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  function togleForm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsRegister((prev) => !prev);
  }

  return (
    <section className="login">
      <form className="login__form">
        <label
          htmlFor="name"
          className={
            isRegister ? "login__form-label" : "login__form-label-hide"
          }
        >
          Name:
          <input
            id="name"
            className="login__form-input"
            placeholder="Enter Your Name"
          />
        </label>

        <label htmlFor="email" className="login__form-label">
          Email:
          <input
            placeholder="Enter Your Email"
            id="email"
            className="login__form-input"
          />
        </label>

        <label htmlFor="password" className="login__form-label">
          Password:
          <input
            placeholder="Enter Your Label"
            id="password"
            className="login__form-input"
          />
        </label>
        <button
          onClick={togleForm}
          className={isRegister ? "login__form-btn-hide" : "login__form-btn"}
        >
          Don't have an account?, Register here!
        </button>
        <button
          onClick={togleForm}
          className={!isRegister ? "login__form-btn-hide" : "login__form-btn"}
        >
          Already register?, Login here!
        </button>
      </form>
      <div className="login__ctn">
        <h2
          className={!isRegister ? "login__ctn-title" : "login__ctn-title-hide"}
        >
          Welcome Back To Offerly
        </h2>
        <h2
          className={isRegister ? "login__ctn-title" : "login__ctn-title-hide"}
        >
          Welcome To Offerly
        </h2>
        <p className={isRegister ? "login__ctn-p" : "login__ctn-p-hide"}>
          Stay on top of every application, interview, and follow-up in one
          place.
        </p>
        <p className={!isRegister ? "login__ctn-p" : "login__ctn-p-hide"}>
          Start organizing your job search with a smarter way to track
          applications, interviews, and next steps.
        </p>
      </div>
    </section>
  );
}
