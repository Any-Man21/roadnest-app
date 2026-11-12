"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Barlow, Caveat } from "next/font/google";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
const caveat = Caveat({ subsets: ["latin"], weight: ["600"] });

const FEATURES = [
  { icon: "✨", title: "Premium Fleet", text: "Latest luxury models" },
  { icon: "💳", title: "Transparent", text: "No hidden fees" },
  { icon: "🛡️", title: "Insured", text: "Drive with peace of mind" },
  { icon: "🕒", title: "Instant", text: "Ready in minutes" },
];

export default function UltraLuxuryBanner() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isMobTypeOpen, setIsMobTypeOpen] = useState(false);
  const [form, setForm] = useState({ q: "", type: "", location: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (form.q) p.set("search", form.q);
    if (form.type) p.set("type", form.type);
    if (form.location) p.set("location", form.location);
    setIsSearchOpen(false);
    router.push(`/cars?${p.toString()}`);
  };

  return (
    <section className={`banner-root ${barlow.className}`}>
      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="bg-container">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury"
          className="bg-img"
        />
        <div className="bg-overlay" />
        <div className="light-leak" />
      </div>

      {/* --- MOBILE CAR ANIMATION --- */}
      <div className="mobile-car-track">
        <div className="mobile-car-wrapper">
          <div className="mobile-car-emoji">🏎️</div>
          <div className="car-smoke" />
        </div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="content-layer mt-10">
        <div className="inner-wrap">
          <div className="hero-in">
            <p className="eyebrow">THE GOLD STANDARD OF RENTALS</p>
            <h1 className="title">
              Your Next Ride <br />
              <span className="gradient-text">Is Just a Click Away</span>
            </h1>
            <p className="subtext">
              Curated performance. Unmatched luxury. <br className="hide-mob" />
              Experience the road like never before.
            </p>
          </div>

          <div className="cta-group">
            <Link href="/cars" className="btn-main">
              Explore Your Crates <span className="arrow">→</span>
            </Link>
            <button
              className="btn-mobile-trigger"
              onClick={() => setIsSearchOpen(true)}
            >
              Find Your Ride
            </button>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="desktop-search-wrap">
            <form className="search-bar" onSubmit={onSubmit}>
              <div className="field">
                <span className="field-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search Model..."
                  value={form.q}
                  onChange={(e) => setForm({ ...form, q: e.target.value })}
                />
              </div>

              {/* CUSTOM LUXURY DROP-UP DROPDOWN */}
              <div className="custom-dropdown">
                <div
                  className={`field dropdown-trigger ${isTypeOpen ? "active" : ""}`}
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                >
                  <span className="field-icon">🚘</span>
                  <span className="selected-type">
                    {form.type || "All Types"}
                  </span>
                  <span className={`chevron ${isTypeOpen ? "rotate" : ""}`}>
                    ▾
                  </span>
                </div>
                <AnimatePresence>
                  {isTypeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} // Start slightly lower
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="dropdown-menu"
                    >
                      {[
                        "Luxury",
                        "Sports",
                        "SUV",
                        "Electric",
                        "Sedan",
                        "Hatchback",
                        "Van",
                      ].map((type) => (
                        <div
                          key={type}
                          className={`dropdown-item ${form.type === type ? "selected" : ""}`}
                          onClick={() => {
                            setForm({ ...form, type });
                            setIsTypeOpen(false);
                          }}
                        >
                          {type}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="field">
                <span className="field-icon">📍</span>
                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="btn-search">
                Search
              </button>
            </form>
          </div>

          {/* FEATURES BAR */}
          <div className="features-section">
            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="feature-card">
                  <span className="f-icon">{f.icon}</span>
                  <div className="f-info">
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`signature ${caveat.className}`}>
              Drive More <br /> Worry Less
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE SEARCH OVERLAY --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-overlay"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-sheet"
            >
              <div
                className="sheet-handle"
                onClick={() => setIsSearchOpen(false)}
              />
              <h2 className="sheet-title">Find Your Ride</h2>
              <form className="sheet-form" onSubmit={onSubmit}>
                <div className="sheet-field">
                  <label>Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Porsche 911"
                    value={form.q}
                    onChange={(e) => setForm({ ...form, q: e.target.value })}
                  />
                </div>
                <div className="sheet-field">
                  <label>Category</label>
                  <div
                    className={`mobile-dropdown-trigger ${isMobTypeOpen ? "active" : ""}`}
                    onClick={() => setIsMobTypeOpen(!isMobTypeOpen)}
                  >
                    <span>{form.type || "All Types"}</span>
                    <span
                      className={`mob-chevron ${isMobTypeOpen ? "rotate" : ""}`}
                    >
                      ▾
                    </span>
                  </div>
                  <AnimatePresence>
                    {isMobTypeOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mobile-dropdown-menu"
                      >
                        {[
                          "Luxury",
                          "Sports",
                          "SUV",
                          "Electric",
                          "Sedan",
                          "Hatchback",
                          "Van",
                        ].map((type) => (
                          <div
                            key={type}
                            className={`mob-dropdown-item ${form.type === type ? "selected" : ""}`}
                            onClick={() => {
                              setForm({ ...form, type });
                              setIsMobTypeOpen(false);
                            }}
                          >
                            {type}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="sheet-field">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="City or Airport"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="sheet-btn">
                  Search Now
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .banner-root {
          position: relative;
          min-height: 100vh;
          width: 100%;
          color: white;
          display: flex;
          align-items: center;
          background: #05080f;
          /* FIX: Changed to overflow: hidden to remove double scrollbars */
          overflow: hidden;
          z-index: 1;
        }
        .bg-container {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: slowZoom 30s infinite alternate ease-in-out;
        }
        .bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(5, 8, 15, 0.9) 0%,
            rgba(5, 8, 15, 0.4) 50%,
            rgba(5, 8, 15, 0.2) 100%
          );
        }
        .light-leak {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 20% 30%,
            rgba(58, 160, 255, 0.15) 0%,
            transparent 50%
          );
          animation: lightMove 10s infinite alternate ease-in-out;
          pointer-events: none;
        }

        /* --- MOBILE CAR ANIMATION --- */
        .mobile-car-track {
          display: none;
          position: absolute;
          bottom: 15%;
          left: 0;
          width: 100%;
          z-index: 5;
          pointer-events: none;
        }
        .mobile-car-wrapper {
          position: relative;
          width: 80px;
          animation: carDrive 8s linear infinite;
        }
        .mobile-car-emoji {
          font-size: 3.5rem;
          filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.5));
          transform: skewX(-15deg);
          display: block;
        }
        .car-smoke {
          position: absolute;
          bottom: 10px;
          left: -10px;
          width: 30px;
          height: 10px;
          background: rgba(255, 255, 255, 0.2);
          filter: blur(8px);
          border-radius: 50%;
          animation: smoke 0.5s infinite alternate;
        }

        /* Content */
        .content-layer {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 0 5%;
        }
        .inner-wrap {
          max-width: 1100px;
          margin: 0 auto;
        }
        .hero-in {
          animation: heroIn 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .eyebrow {
          font-size: 0.8rem;
          letter-spacing: 4px;
          color: #3aa0ff;
          font-weight: 700;
          margin-bottom: 1rem;
          text-transform: uppercase;
        }
        .title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }
        .gradient-text {
          background: linear-gradient(90deg, #3aa0ff, #a0d2ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtext {
          max-width: 600px;
          font-size: 1.1rem;
          color: #c4cee0;
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .cta-group {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .btn-main {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #3a98ff, #1f6fe0);
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          color: white;
          transition: 0.3s;
          box-shadow: 0 10px 20px rgba(47, 139, 255, 0.3);
        }
        .btn-main:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(47, 139, 255, 0.5);
        }
        .btn-mobile-trigger {
          display: none;
        }

        /* DESKTOP SEARCH */
        .desktop-search-wrap {
          margin-top: 4rem;
          position: relative;
          z-index: 100;
        }
        .search-bar {
          max-width: 950px;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 12px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
          display: grid;
          grid-template-columns: 2fr 1fr 2fr auto;
          gap: 12px;
          position: relative;
        }
        .field {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.5);
          padding: 0 15px;
          height: 58px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: 0.3s;
        }
        .field.active {
          border-color: #3aa0ff;
          background: rgba(0, 0, 0, 0.7);
        }
        .field input {
          background: transparent;
          border: none;
          color: white;
          outline: none;
          width: 100%;
          font-size: 0.95rem;
          font-family: inherit;
        }
        .btn-search {
          background: #3aa0ff;
          color: white;
          border: none;
          padding: 0 35px;
          border-radius: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-search:hover {
          background: #1f6fe0;
        }

        /* Custom Drop-UP Styles */
        .custom-dropdown {
          position: relative;
          width: 100%;
        }
        .dropdown-trigger {
          cursor: pointer;
          justify-content: space-between;
        }
        .selected-type {
          flex: 1;
          font-size: 0.95rem;
          color: white;
        }
        .chevron {
          font-size: 0.8rem;
          transition: 0.3s;
          color: #9fb0c8;
        }
        .chevron.rotate {
          transform: rotate(180deg);
        }
        .dropdown-menu {
          position: absolute;
          bottom: 72px; /* FIX: Changed from top to bottom to open UPWARDS */
          left: 0;
          right: 0;
          background: #0b1224;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          overflow: hidden;
          z-index: 999999;
          box-shadow: 0 -20px 40px rgba(0, 0, 0, 0.8);
        }
        .dropdown-item {
          padding: 14px 15px;
          font-size: 0.9rem;
          color: #c4cee0;
          cursor: pointer;
          transition: 0.2s;
        }
        .dropdown-item:hover,
        .dropdown-item.selected {
          background: #3aa0ff;
          color: white;
        }

        /* Features */
        .features-section {
          margin-top: 4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, auto);
          gap: 40px;
        }
        .feature-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 10px;
          border-radius: 15px;
          transition: 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          background-color: rgba(255, 255, 255, 0.1);
        }
        .f-icon {
          font-size: 1.3rem;
          background: rgba(58, 160, 255, 0.1);
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          border: 1px solid rgba(58, 160, 255, 0.2);
        }
        .f-info strong {
          display: block;
          font-size: 0.9rem;
        }
        .f-info span {
          font-size: 0.75rem;
          color: #9fb0c8;
        }
        .signature {
          font-size: 2.2rem;
          color: #3aa0ff;
          text-align: right;
          line-height: 1.1;
        }

        /* Mobile Overlay */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(5, 8, 15, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .mobile-sheet {
          width: 100%;
          background: #0b1224;
          border-top-left-radius: 30px;
          border-top-right-radius: 30px;
          padding: 20px 24px 40px;
          box-shadow: 0 -20px 50px rgba(0, 0, 0, 0.5);
        }
        .sheet-handle {
          width: 40px;
          height: 5px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          margin: 0 auto 20px;
          cursor: pointer;
        }
        .sheet-title {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 800;
        }
        .sheet-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sheet-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sheet-field label {
          font-size: 0.8rem;
          color: #3aa0ff;
          font-weight: 600;
        }
        .sheet-field input,
        .sheet-field select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          outline: none;
        }

        /* Mobile Custom Dropdown */
        .mobile-dropdown-trigger {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 12px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .mobile-dropdown-trigger.active {
          border-color: #3aa0ff;
        }
        .mob-chevron {
          transition: 0.3s;
        }
        .mob-chevron.rotate {
          transform: rotate(180deg);
        }
        .mobile-dropdown-menu {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          margin-top: 5px;
          overflow: hidden;
        }
        .mob-dropdown-item {
          padding: 12px 15px;
          color: #c4cee0;
          cursor: pointer;
          transition: 0.2s;
        }
        .mob-dropdown-item.selected {
          background: #3aa0ff;
          color: white;
        }

        .sheet-btn {
          background: #3aa0ff;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 10px;
        }

        @keyframes slowZoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
        @keyframes lightMove {
          from {
            transform: translate(-10%, -10%);
          }
          to {
            transform: translate(10%, 10%);
          }
        }
        @keyframes smoke {
          from {
            opacity: 0.2;
            transform: scale(1);
          }
          to {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
        @keyframes heroIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        /* drives right to left in 6s, then waits 2s off screen */
        @keyframes carDrive {
          0% {
            transform: translateX(110vw);
          }
          75%,
          100% {
            transform: translateX(-20vw);
          }
        }

        @media (max-width: 1024px) {
          .search-grid {
            grid-template-columns: 1fr 1fr;
          }
          .btn-search {
            grid-column: span 2;
            height: 58px;
          }
        }
        @media (max-width: 768px) {
          .desktop-search-wrap {
            display: none;
          }
          .btn-mobile-trigger {
            display: block;
            background: transparent;
            border: 2px solid #3aa0ff;
            color: white;
            padding: 16px 32px;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
          }
          .btn-mobile-trigger:hover {
            background: #3aa0ff;
          }
          .mobile-car-track {
            display: block;
          }
          .content-inner {
            text-align: center;
          }
          .hero-subtext {
            margin: 0 auto 3rem;
          }
          .cta-group {
            justify-content: center;
            flex-direction: column;
          }
          .btn-main {
            width: 100%;
            justify-content: center;
          }
          .features-section {
            flex-direction: column;
            gap: 40px;
            align-items: center;
          }
          .features-grid {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .signature {
            text-align: center;
          }
          .hide-mob {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
