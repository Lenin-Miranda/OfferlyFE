"use client";
import "./Sidebar.css";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiHome,
  FiBriefcase,
  FiBarChart2,
  FiUser,
  FiSettings,
  FiBookmark,
} from "react-icons/fi";

const navItems = [
  { label: "Home", href: "/", icon: FiHome },
  { label: "Dashboard", href: "/dashboard", icon: FiBarChart2 },
  { label: "Applications", href: "/dashboard/applications", icon: FiBriefcase },
  { label: "Saved Jobs", href: "/dashboard/saved", icon: FiBookmark },
  { label: "Profile", href: "/dashboard/profile", icon: FiUser },
  { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className={isOpen ? "sidebar__ctn-open" : "sidebar__ctn"}>
        {/* Header: Logo Button + Title */}
        <div className={isOpen ? "sidebar__header-open" : "sidebar__header"}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="sidebar__logo-btn"
          >
            <Image
              src="/offerly-logo.svg"
              alt="Offerly Logo"
              width={32}
              height={32}
              className="sidebar__logo"
            />
          </button>
          <span className={isOpen ? "sidebar__title-open" : "sidebar__title"}>
            Offerly
          </span>
        </div>

        {/* Nav Links */}
        <nav className={isOpen ? "sidebar__nav-open" : "sidebar__nav"}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="sidebar__link">
              <item.icon className="sidebar__link-icon" />
              <span className="sidebar__link-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
