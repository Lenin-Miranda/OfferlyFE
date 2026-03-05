"use client";
import "./NavBar.css";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TypeWriter from "../TypeWriter/TypeWriter";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleNav() {
    setIsOpen((prev) => !prev);
  }
  return (
    <nav className="nav">
      <div className={isOpen ? "nav__ctn-open" : "nav__ctn"}>
        {" "}
        <div className={isOpen ? "nav__logo-ctn-open" : "nav__logo-ctn"}>
          <button type="button" onClick={toggleNav} className="nav__logo-btn">
            <Image
              src="/offerly-logo.svg"
              alt="Offerly Logo"
              width={32}
              height={32}
              className="nav__logo"
            />
          </button>
          <span className={isOpen ? "nav__logo-title-open" : "nav__logo-title"}>
            Offerly
          </span>
        </div>
        <div className={isOpen ? "nav__link-ctn-open" : "nav__link-ctn"}>
          <Link
            className={isOpen ? "nav__link-open" : "nav__link"}
            href="/login"
          >
            Login
          </Link>
          <Link
            className={isOpen ? "nav__link-open" : "nav__link"}
            href="/register"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
