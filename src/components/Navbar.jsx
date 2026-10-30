"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Barlow, Satisfy } from "next/font/google";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"] });
const logoFont = Satisfy({ subsets: ["latin"], weight: ["400"] });

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Explore Cars", href: "/cars" },
  { label: "Add Car", href: "/add-car" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "My Added Cars", href: "/my-added-cars" },
];

function Logo({ gradId }) {
  return (
    <svg viewBox="0 0 40 32" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5ab0ff" />
          <stop offset="1" stopColor="#1f5fd6" />
        </linearGradient>
      </defs>
      <path
        d="M1 30 L13 7 Q20 -3 27 7 L39 30 L30.5 30 L23 14.5 Q20 10.5 17 14.5 L9.5 30 Z"
        fill={`url(#${gradId})`}
      />
      <rect x="15" y="19" width="10" height="4" rx="2" fill="#fff" />
      <rect
        x="17"
        y="26"
        width="6"
        height="4"
        rx="2"
        fill="#fff"
        opacity="0.85"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  );
}

// 1. We move the logic into a separate component
function NavbarContent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);
  const closeRef = useRef(null);

  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const closeDrawer = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) burgerRef.current?.focus();
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeDrawer(true);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const onChange = (e) => !e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className={`rn-header ${barlow.className}`}>
      <div className="rn-bar">
        <Link href="/" className="rn-brand">
          <Logo gradId="rn-grad-bar" />
          <span className={logoFont.className}>RoadNest</span>
        </Link>

        <nav
          id="rn-drawer"
          className={`rn-links ${open ? "rn-open" : ""}`}
          aria-label="Primary"
        >
          <div className="rn-drawer-head">
            <Link href="/" className="rn-brand" onClick={() => closeDrawer()}>
              <Logo gradId="rn-grad-drawer" />
              <span className={logoFont.className}>RoadNest</span>
            </Link>
            <button
              ref={closeRef}
              type="button"
              className="rn-icon-btn"
              aria-label="Close menu"
              onClick={() => closeDrawer(true)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`rn-link ${isActive(href) ? "rn-active" : ""}`}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => closeDrawer()}
            >
              {label}
            </Link>
          ))}

          <Link
            href="/login"
            className="rn-login rn-login-drawer"
            onClick={() => closeDrawer()}
          >
            <UserIcon />
            Login / Register
          </Link>
        </nav>

        <div className="rn-actions">
          <Link href="/login" className="rn-login rn-login-bar">
            <UserIcon />
            Login / Register
          </Link>

          <button
            ref={burgerRef}
            type="button"
            className="rn-burger"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="rn-drawer"
            onClick={() => setOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`rn-overlay ${open ? "rn-open" : ""}`}
        onClick={() => closeDrawer(true)}
      />

      <style jsx global>{`
        .rn-header {
          --rn-bg-1: #04070d;
          --rn-bg-2: #0b1626;
          --rn-line: rgba(120, 160, 220, 0.16);
          --rn-text: #ffffff;
          --rn-muted: #9aa7ba;
          --rn-accent: #2f8bff;
          --rn-accent-soft: rgba(47, 139, 255, 0.14);
          --rn-h: 64px;
          position: sticky;
          top: 0;
          z-index: 100;
          color: var(--rn-text);
          background: linear-gradient(
            90deg,
            var(--rn-bg-1),
            var(--rn-bg-2) 50%,
            var(--rn-bg-1)
          );
          border-bottom: 1px solid var(--rn-line);
        }
        .rn-header *,
        .rn-header *::before,
        .rn-header *::after {
          box-sizing: border-box;
        }
        .rn-header a {
          color: inherit;
          text-decoration: none;
        }
        .rn-header button {
          font: inherit;
          color: inherit;
          background: none;
          border: 0;
          cursor: pointer;
        }
        .rn-bar {
          max-width: 1280px;
          margin: 0 auto;
          height: var(--rn-h);
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
        }
        .rn-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          justify-self: start;
          font-size: 1.8rem;
          font-weight: 400;
        }
        .rn-brand svg {
          width: 34px;
          height: 26px;
          flex: none;
        }
        .rn-links {
          display: flex;
          align-items: center;
          gap: 34px;
        }
        .rn-link {
          position: relative;
          padding: 8px 0;
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--rn-muted);
          transition: color 0.2s ease;
        }
        .rn-link:hover {
          color: var(--rn-text);
        }
        .rn-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -4px;
          height: 2px;
          border-radius: 2px;
          background: var(--rn-accent);
          transform: scaleX(0);
          transition: transform 0.25s ease;
        }
        .rn-link.rn-active {
          color: var(--rn-text);
        }
        .rn-link.rn-active::after {
          transform: scaleX(1);
        }
        .rn-actions {
          justify-self: end;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .rn-icon-btn {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          transition: background 0.2s ease;
        }
        .rn-icon-btn:hover {
          background: var(--rn-accent-soft);
        }
        .rn-icon-btn svg {
          width: 20px;
          height: 20px;
        }
        .rn-login {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid rgba(120, 160, 220, 0.35);
          background: rgba(47, 139, 255, 0.1);
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }
        .rn-login:hover {
          background: rgba(47, 139, 255, 0.22);
          border-color: var(--rn-accent);
        }
        .rn-login svg {
          width: 16px;
          height: 16px;
        }
        .rn-drawer-head,
        .rn-login-drawer,
        .rn-overlay,
        .rn-burger {
          display: none;
        }
        @media (max-width: 860px) {
          .rn-bar {
            grid-template-columns: 1fr auto;
            padding: 0 16px;
          }
          .rn-login-bar {
            display: none;
          }
          .rn-burger {
            display: grid;
            place-items: center;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .rn-burger:hover {
            background: var(--rn-accent-soft);
          }
          .rn-burger svg {
            width: 24px;
            height: 24px;
          }
          .rn-overlay {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 110;
            background: rgba(2, 6, 12, 0.65);
            opacity: 0;
            visibility: hidden;
            transition:
              opacity 0.3s ease,
              visibility 0s 0.3s;
          }
          .rn-overlay.rn-open {
            opacity: 1;
            visibility: visible;
            transition-delay: 0s;
          }
          .rn-links {
            position: fixed;
            top: 0;
            right: 0;
            z-index: 120;
            width: min(320px, 85vw);
            height: 100vh;
            flex-direction: column;
            align-items: stretch;
            gap: 4px;
            padding: 0 16px 24px;
            background: linear-gradient(180deg, var(--rn-bg-2), var(--rn-bg-1));
            border-left: 1px solid var(--rn-line);
            overflow-y: auto;
            transform: translateX(100%);
            visibility: hidden;
            transition:
              transform 0.3s ease,
              visibility 0s 0.3s;
          }
          .rn-links.rn-open {
            transform: translateX(0);
            visibility: visible;
            transition-delay: 0s;
          }
          .rn-drawer-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: var(--rn-h);
            margin-bottom: 12px;
            border-bottom: 1px solid var(--rn-line);
          }
          .rn-drawer-head .rn-brand {
            font-size: 1.6rem;
          }
          .rn-link {
            padding: 14px 16px;
            border-radius: 10px;
            font-size: 1rem;
          }
          .rn-link::after {
            left: 0;
            right: auto;
            top: 10px;
            bottom: 10px;
            width: 3px;
            height: auto;
            transform: scaleY(0);
          }
          .rn-link.rn-active {
            background: var(--rn-accent-soft);
          }
          .rn-link.rn-active::after {
            transform: scaleY(1);
          }
          .rn-login-drawer {
            display: inline-flex;
            justify-content: center;
            margin-top: 20px;
            padding: 12px 16px;
          }
        }
      `}</style>
    </header>
  );
}

// 2. Main Navbar export wrapped in Suspense
export default function Navbar() {
  return (
    <Suspense
      fallback={
        <div
          className="rn-header"
          style={{ height: "64px", background: "#04070d" }}
        />
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
