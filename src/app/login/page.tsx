"use client";
import { useState, useEffect, useContext } from "react";
import "./page.css";
import Link from "next/link";
import logo from "../../../public/offerly-logo.svg";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";
export default function Login() {
  const { isAuthenticated, login, register } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isMessage, setIsMessage] = useState("");
  const [isForm, setIsForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      setIsMessage("Logueo Exitoso");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    }
  }, [isAuthenticated]);

  function setForm(field: string, value: string) {
    setIsForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function togleForm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsRegister((prev) => !prev);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(isForm.name, isForm.email, isForm.password);
      } else {
        await login(isForm.email, isForm.password);
      }

      setIsForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (e) {
      console.error(`Error Message:`, e);
      setIsError(true);
    }
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
      <form className="login__form" onSubmit={handleSubmit}>
        <label
          htmlFor="name"
          className={
            isRegister ? "login__form-label" : "login__form-label-hide"
          }
        >
          Name:
          <input
            value={isForm.name}
            type="text"
            id="name"
            className="login__form-input"
            placeholder="Enter Your Name"
            onChange={(e) => setForm("name", e.target.value)}
          />
        </label>
        <label htmlFor="email" className="login__form-label">
          Email:
          <input
            value={isForm.email}
            type="email"
            placeholder="Enter Your Email"
            id="email"
            className="login__form-input"
            onChange={(e) => setForm("email", e.target.value)}
          />
        </label>
        <label htmlFor="password" className="login__form-label">
          Password:
          <input
            value={isForm.password}
            type="password"
            placeholder="Enter Your Password"
            id="password"
            className="login__form-input"
            onChange={(e) => setForm("password", e.target.value)}
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
            type="button"
            onClick={togleForm}
            className={isRegister ? "login__form-btn-hide" : "login__form-btn"}
          >
            Don't have an account?, Register here!
          </button>
          <button
            type="button"
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
