"use client";
import { useState, useEffect } from "react";
import "./page.css";
import Link from "next/link";
import logo from "../../../public/offerly-logo.svg";
import Image from "next/image";
export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  function togleForm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsRegister((prev) => !prev);
  }

  return (
    <section className="login">
      <Link href="/" className="login__logo">
        <Image
          alt="logo"
          width={40}
          height={40}
          src={logo}
          className="login__img"
        />
      </Link>
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
            placeholder="Enter Your Password"
            id="password"
            className="login__form-input"
          />
        </label>

        <div className="login__form-btn-ctn">
          {" "}
          <button
            type="submit"
            className={
              !isRegister ? "login__form-submit" : "login__form-submit-hide"
            }
          >
            Login
          </button>
          <button
            type="submit"
            className={
              isRegister ? "login__form-submit" : "login__form-submit-hide"
            }
          >
            Register
          </button>
        </div>

        <div className="login__form-btn-ctn">
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
        </div>
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
        <ul className="login__ctn-features">
          <li className="login__ctn-feature">
            <span className="login__ctn-feature-check">✔</span> Track
            applications
          </li>
          <li className="login__ctn-feature">
            <span className="login__ctn-feature-check">✔</span> Manage
            interviews
          </li>
          <li className="login__ctn-feature">
            <span className="login__ctn-feature-check">✔</span> Never miss
            follow-ups
          </li>
        </ul>
      </div>
    </section>
  );
}
