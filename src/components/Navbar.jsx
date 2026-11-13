"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Barlow, Satisfy } from "next/font/google";
import { authClient } from "@/lib/auth-client";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"] });
const logoFont = Satisfy({ subsets: ["latin"], weight: ["400"] });

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Explore Cars", href: "/cars" },
  { label: "Add Car", href: "/add-car" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "My Added Cars", href: "/my-added-cars" },
  { label: "Orders", href: "/orders" },
];

function OrderBadge({ count }) {
  if (!count || count <= 0) return null;
  return (
    <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#0b1626] animate-in zoom-in duration-300">
      {count > 99 ? "99+" : count}
    </span>
  );
}

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

function LogoutIcon() {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function Avatar({ user, name, large = false }) {
  const [failed, setFailed] = useState(false);
  const cls = `rn-avatar ${large ? "rn-avatar-lg" : ""}`;
  if (user?.image && !failed) {
    return (
      <img
        src={user.image}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={cls}
      />
    );
  }
  return (
    <span className={cls} aria-hidden="true">
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [lastSeenCount, setLastSeenCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const burgerRef = useRef(null);
  const closeRef = useRef(null);
  const cancelRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();

  // The server always renders the loading state. Session data is used only after
  // the browser has mounted, so the first browser render matches the server HTML.
  const ready = mounted && !isPending;
  const user = ready ? session?.user : null;
  const name = user?.name || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load the 'last seen' count from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("rn_last_seen_orders");
    if (saved) setLastSeenCount(parseInt(saved, 10));
  }, []);

  // Polling logic to update order count
  useEffect(() => {
    if (!user?.id) return;

    async function updateOrderCount() {
      try {
        const res = await fetch(
          `${API_URL}/orders?ownerId=${encodeURIComponent(user.id)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const count = Array.isArray(data) ? data.length : 0;
          setOrderCount(count);
        }
      } catch (e) {
        console.error("Order fetch failed", e);
      }
    }

    updateOrderCount();
    const interval = setInterval(updateOrderCount, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // MARK AS READ: When user visits the orders page, save the current count
  useEffect(() => {
    if (pathname === "/orders" && orderCount > 0) {
      setLastSeenCount(orderCount);
      localStorage.setItem("rn_last_seen_orders", String(orderCount));
    }
  }, [pathname, orderCount]);

  // Calculate unread orders (only show if total > what we last saw)
  const unreadCount =
    orderCount > lastSeenCount ? orderCount - lastSeenCount : 0;

  function handleLogout() {
    setConfirmOpen(true);
  }

  // logout

  async function confirmLogout() {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Logout failed:", error);
        return;
      }

      setConfirmOpen(false);

      // Hard redirect to login page
      window.location.replace("/");
    } finally {
      setLoggingOut(false);
    }
  }

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
    if (!confirmOpen) return;
    cancelRef.current?.focus();
    const onKey = (e) =>
      e.key === "Escape" && !loggingOut && setConfirmOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmOpen, loggingOut]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 980px)");
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
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {user && (
            <div className="rn-user-card">
              <Link href="/profile">
                <Avatar user={user} name={name} large />
              </Link>
              <div className="rn-user-meta">
                <strong>{name}</strong>
                {user.email && <span>{user.email}</span>}
              </div>
            </div>
          )}

          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`rn-link relative ${isActive(href) ? "rn-active" : ""}`}
              onClick={() => closeDrawer()}
            >
              {label}
              {label === "Orders" && <OrderBadge count={unreadCount} />}
            </Link>
          ))}

          {ready && !user && (
            <Link
              href="/register"
              className="rn-login rn-login-drawer"
              onClick={() => closeDrawer()}
            >
              <UserIcon />
              Login / Register
            </Link>
          )}
        </nav>

        <div className="rn-actions">
          {!ready ? (
            <div className="rn-skel" aria-hidden="true" />
          ) : user ? (
            <>
              <div className="rn-user" title={name}>
                <Link href="/profile" className="rn-user" title={name}>
                  <Avatar user={user} name={name} />
                  <span className="rn-user-name">{name}</span>
                </Link>
              </div>
              <button
                type="button"
                className="rn-logout rn-logout-bar"
                onClick={handleLogout}
              >
                <LogoutIcon />
                <span className="rn-logout-text">Logout</span>
              </button>
            </>
          ) : (
            <Link href="/register" className="rn-login rn-login-bar">
              <UserIcon />
              Login / Register
            </Link>
          )}

          <button
            ref={burgerRef}
            type="button"
            className="rn-burger relative"
            onClick={() => setOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <OrderBadge count={unreadCount} />
          </button>
        </div>
      </div>

      <div
        className={`rn-overlay ${open ? "rn-open" : ""}`}
        onClick={() => closeDrawer(true)}
      />

      {confirmOpen && (
        <div
          className="rn-modal-backdrop"
          onClick={() => !loggingOut && setConfirmOpen(false)}
        >
          <div className="rn-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rn-modal-icon">
              <LogoutIcon />
            </div>
            <h2 className="rn-modal-title">Log out?</h2>
            <p className="rn-modal-text">
              Are you sure you want to log out of RoadNest?
            </p>
            <div className="rn-modal-actions">
              <button
                ref={cancelRef}
                type="button"
                className="rn-modal-btn"
                disabled={loggingOut}
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rn-modal-btn rn-modal-danger"
                disabled={loggingOut}
                onClick={confirmLogout}
              >
                {loggingOut ? "Logging out…" : "Yes, log out"}
              </button>
            </div>
          </div>
        </div>
      )}

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
          min-width: 0;
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
        .rn-user {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .rn-user-name {
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .rn-avatar {
          display: grid;
          place-items: center;
          flex: none;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(120, 160, 220, 0.45);
          background: linear-gradient(135deg, #5ab0ff, #1f5fd6);
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
        }
        .rn-avatar-lg {
          width: 44px;
          height: 44px;
          font-size: 1.1rem;
        }
        .rn-header .rn-logout {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(248, 113, 113, 0.35);
          background: rgba(248, 113, 113, 0.08);
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }
        .rn-header .rn-logout:hover {
          background: rgba(248, 113, 113, 0.2);
          border-color: #f87171;
        }
        .rn-logout svg {
          width: 16px;
          height: 16px;
        }
        .rn-skel {
          width: 150px;
          height: 36px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          animation: rn-pulse 1.4s ease-in-out infinite;
        }
        @keyframes rn-pulse {
          50% {
            opacity: 0.4;
          }
        }
        .rn-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          padding: 16px;
          background: rgba(2, 6, 12, 0.7);
          backdrop-filter: blur(4px);
          animation: rn-fade 0.2s ease both;
        }
        .rn-modal {
          width: min(100%, 400px);
          padding: 28px 24px 22px;
          text-align: center;
          border-radius: 20px;
          border: 1px solid var(--rn-line);
          background: linear-gradient(180deg, var(--rn-bg-2), var(--rn-bg-1));
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
          animation: rn-pop 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
        }
        .rn-modal-icon {
          display: grid;
          place-items: center;
          width: 52px;
          height: 52px;
          margin: 0 auto 14px;
          border-radius: 50%;
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.35);
          background: rgba(248, 113, 113, 0.1);
        }
        .rn-modal-icon svg {
          width: 24px;
          height: 24px;
        }
        .rn-modal-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .rn-modal-text {
          margin: 8px 0 22px;
          font-size: 0.92rem;
          color: var(--rn-muted);
        }
        .rn-modal-actions {
          display: flex;
          gap: 10px;
        }
        .rn-header .rn-modal-btn {
          flex: 1;
          height: 42px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid var(--rn-line);
          background: rgba(255, 255, 255, 0.06);
          font-size: 0.9rem;
          font-weight: 600;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.15s ease;
        }
        .rn-header .rn-modal-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.12);
        }
        .rn-header .rn-modal-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .rn-header .rn-modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .rn-header .rn-modal-danger {
          border-color: rgba(248, 113, 113, 0.5);
          background: #dc2626;
        }
        .rn-header .rn-modal-danger:hover:not(:disabled) {
          background: #ef4444;
        }
        @keyframes rn-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes rn-pop {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rn-modal-backdrop,
          .rn-modal {
            animation: none;
          }
        }
        .rn-drawer-head,
        .rn-login-drawer,
        .rn-user-card,
        .rn-logout-drawer,
        .rn-overlay,
        .rn-burger {
          display: none;
        }
        @media (max-width: 1100px) {
          .rn-links {
            gap: 16px;
          }
          .rn-link {
            font-size: 0.88rem;
          }
          .rn-user-name,
          .rn-logout-text {
            display: none;
          }
          .rn-header .rn-logout-bar {
            padding: 8px 10px;
          }
        }
        @media (max-width: 980px) {
          .rn-bar {
            grid-template-columns: 1fr auto;
            padding: 0 16px;
          }
          .rn-actions {
            gap: 10px;
          }
          .rn-login-bar,
          .rn-logout-bar {
            display: none;
          }
          .rn-skel {
            width: 34px;
            height: 34px;
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
            height: 100dvh;
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
          .rn-user-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 12px;
            border: 1px solid var(--rn-line);
            background: var(--rn-accent-soft);
          }
          .rn-user-meta {
            display: flex;
            flex-direction: column;
            min-width: 0;
          }
          .rn-user-meta strong {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.95rem;
            font-weight: 600;
          }
          .rn-user-meta span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.78rem;
            color: var(--rn-muted);
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
          .rn-header .rn-logout-drawer {
            display: inline-flex;
            justify-content: center;
            margin-top: auto;
            padding: 12px 16px;
          }
        }
      `}</style>
    </header>
  );
}

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
