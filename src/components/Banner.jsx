"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Barlow, Caveat } from "next/font/google";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Luxury",
  "Sports",
  "SUV",
  "Electric",
  "Sedan",
  "Hatchback",
  "Van",
];

const FEATURES = [
  { icon: "✨", title: "Premium Fleet", text: "Latest luxury models" },
  { icon: "💳", title: "Transparent", text: "No hidden fees" },
  { icon: "🛡️", title: "Insured", text: "Drive with peace of mind" },
  { icon: "🕒", title: "Instant", text: "Ready in minutes" },
];

export default function UltraLuxuryBanner() {
  const router = useRouter();

  const [form, setForm] = useState({
    q: "",
    type: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobTypeOpen, setIsMobTypeOpen] = useState(false);

  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  // Build the Explore Cars URL
  const searchURL = () => {
    const params = new URLSearchParams();

    if (form.q.trim()) {
      params.set("search", form.q.trim());
    }

    if (form.type) {
      params.set("type", form.type);
    }

    return `/cars${params.toString() ? `?${params.toString()}` : ""}`;
  };

  // Search suggestions with debounce
  useEffect(() => {
    if (!isFocused && !isSearchOpen) return;

    if (!form.q.trim() && !form.type) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (form.q.trim()) {
          params.set("search", form.q.trim());
        }

        if (form.type) {
          params.set("type", form.type);
        }

        params.set("limit", "6");

        const response = await fetch(`${API_URL}/cars?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to search cars");
        }

        const data = await response.json();

        setSuggestions(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Search error:", error);
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [form.q, form.type, isFocused, isSearchOpen]);

  // Search submission
  const onSubmit = (e) => {
    e.preventDefault();

    setIsFocused(false);
    setIsSearchOpen(false);
    setIsTypeOpen(false);
    setIsMobTypeOpen(false);

    router.push(searchURL());
  };

  // Select category
  const selectCategory = (type) => {
    setForm((prev) => ({
      ...prev,
      type: prev.type === type ? "" : type,
    }));

    setIsTypeOpen(false);
    setIsMobTypeOpen(false);
  };

  // Close search overlays
  const closeMobileSearch = () => {
    setIsSearchOpen(false);
    setIsMobTypeOpen(false);
  };

  // Suggestion component
  const SuggestionList = ({ onSelect }) => (
    <div className="suggestion-panel">
      {loading ? (
        <div className="suggestion-message">
          <span className="loader" />
          Searching the fleet...
        </div>
      ) : suggestions.length > 0 ? (
        <>
          <div className="suggestion-heading">
            MATCHING VEHICLES
            <span>{suggestions.length} found</span>
          </div>

          {suggestions.map((car) => (
            <button
              key={car._id}
              type="button"
              className="suggestion-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(car)}
            >
              <div className="suggestion-image">
                <img
                  src={car.imageUrl || "/placeholder-car.png"}
                  alt={car.name}
                />
              </div>

              <div className="suggestion-info">
                <strong>{car.name}</strong>

                <span>
                  {car.type || "Vehicle"}
                  {car.location ? ` • ${car.location}` : ""}
                </span>
              </div>

              <div className="suggestion-price">
                <strong>
                  ${Number(car.pricePerDay || 0).toLocaleString()}
                </strong>
                <span>/ day</span>
              </div>

              <span className="suggestion-arrow">↗</span>
            </button>
          ))}

          <button
            type="button"
            className="view-all"
            onClick={onSubmitFromSuggestion}
          >
            View all matching vehicles →
          </button>
        </>
      ) : (
        <div className="suggestion-message empty-message">
          <span>🔎</span>
          <strong>No matching vehicles</strong>
          <small>Try another name or category.</small>
        </div>
      )}
    </div>
  );

  // Called by the View All button inside suggestions
  const onSubmitFromSuggestion = () => {
    setIsFocused(false);
    setIsSearchOpen(false);
    router.push(searchURL());
  };

  return (
    <section className={`banner-root ${barlow.className}`}>
      {/* Background */}
      <div className="bg-container">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury sports car"
          className="bg-img"
        />

        <div className="bg-overlay" />
        <div className="light-leak" />
      </div>

      {/* Mobile car animation */}
      <div className="mobile-car-track">
        <div className="mobile-car-wrapper">
          <div className="mobile-car-emoji">🏎️</div>
          <div className="car-smoke" />
        </div>
      </div>

      {/* Main content */}
      <div className="content-layer">
        <div className="inner-wrap">
          <div className="hero-in">
            <p className="eyebrow">THE GOLD STANDARD OF RENTALS</p>

            <h1 className="title">
              Your Next Ride
              <br />
              <span className="gradient-text">Is Just a Click Away</span>
            </h1>

            <p className="subtext">
              Curated performance. Unmatched luxury.
              <br className="hide-mob" />
              Experience the road like never before.
            </p>
          </div>

          {/* Buttons */}
          <div className="cta-group">
            <Link href="/cars" className="btn-main">
              Explore Your Rides
              <span className="arrow">→</span>
            </Link>

            <button
              type="button"
              className="btn-mobile-trigger"
              onClick={() => setIsSearchOpen(true)}
            >
              Find Your Ride
            </button>
          </div>

          {/* Desktop search */}
          <div className="desktop-search-wrap" ref={desktopRef}>
            <form className="search-bar" onSubmit={onSubmit}>
              {/* Car name */}
              <div className="field">
                <span className="field-icon">🔍</span>

                <input
                  type="text"
                  placeholder="Search car name... e.g. Porsche"
                  value={form.q}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      q: e.target.value,
                    }))
                  }
                />

                {form.q && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        q: "",
                      }))
                    }
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category dropdown */}
              <div className="custom-dropdown">
                <button
                  type="button"
                  className={`field dropdown-trigger ${
                    isTypeOpen ? "active" : ""
                  }`}
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                >
                  <span>🚘</span>

                  <span className="selected-type">
                    {form.type || "All Types"}
                  </span>

                  <span className="chevron">{isTypeOpen ? "▴" : "▾"}</span>
                </button>

                <AnimatePresence>
                  {isTypeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="dropdown-menu"
                    >
                      <button
                        type="button"
                        className={`dropdown-item ${
                          !form.type ? "selected" : ""
                        }`}
                        onClick={() => selectCategory("")}
                      >
                        All Types
                      </button>

                      {CATEGORIES.map((type) => (
                        <button
                          type="button"
                          key={type}
                          className={`dropdown-item ${
                            form.type === type ? "selected" : ""
                          }`}
                          onClick={() => selectCategory(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button type="submit" className="btn-search">
                Search <span>→</span>
              </button>
            </form>

            {/* Desktop suggestions */}
            <AnimatePresence>
              {isFocused && (form.q.trim() || form.type) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="desktop-suggestions"
                >
                  <SuggestionList
                    onSelect={(car) => {
                      setIsFocused(false);
                      router.push(`/cars/${car._id}`);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Features */}
          <div className="features-section">
            <div className="features-grid">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="feature-card">
                  <span className="f-icon">{feature.icon}</span>

                  <div className="f-info">
                    <strong>{feature.title}</strong>
                    <span>{feature.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={`signature ${caveat.className}`}>
              Drive More
              <br />
              Worry Less
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeMobileSearch();
              }
            }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="mobile-sheet"
            >
              <div className="sheet-handle" onClick={closeMobileSearch} />

              <div className="mobile-sheet-heading">
                <p>DISCOVER YOUR NEXT RIDE</p>
                <h2>Find Your Ride.</h2>
              </div>

              <form className="sheet-form" onSubmit={onSubmit}>
                <div className="sheet-field">
                  <label>CAR MODEL</label>

                  <input
                    type="text"
                    placeholder="e.g. Porsche 911"
                    value={form.q}
                    onFocus={() => setIsFocused(true)}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        q: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="sheet-field">
                  <label>VEHICLE CATEGORY</label>

                  <button
                    type="button"
                    className={`mobile-dropdown-trigger ${
                      isMobTypeOpen ? "active" : ""
                    }`}
                    onClick={() => setIsMobTypeOpen(!isMobTypeOpen)}
                  >
                    <span>{form.type || "All Types"}</span>
                    <span>{isMobTypeOpen ? "▴" : "▾"}</span>
                  </button>

                  <AnimatePresence>
                    {isMobTypeOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mobile-dropdown-menu"
                      >
                        <button
                          type="button"
                          className="mob-dropdown-item"
                          onClick={() => selectCategory("")}
                        >
                          All Types
                        </button>

                        {CATEGORIES.map((type) => (
                          <button
                            type="button"
                            key={type}
                            className={`mob-dropdown-item ${
                              form.type === type ? "selected" : ""
                            }`}
                            onClick={() => selectCategory(type)}
                          >
                            {type}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button type="submit" className="sheet-btn">
                  Search Vehicles →
                </button>
              </form>

              {/* Mobile suggestions */}
              {(form.q.trim() || form.type) && (
                <div className="mobile-suggestions">
                  <SuggestionList
                    onSelect={(car) => {
                      closeMobileSearch();
                      router.push(`/cars/${car._id}`);
                    }}
                  />
                </div>
              )}
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
            rgba(5, 8, 15, 0.95) 0%,
            rgba(5, 8, 15, 0.65) 55%,
            rgba(5, 8, 15, 0.35) 100%
          );
        }

        .light-leak {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 20% 30%,
            rgba(58, 160, 255, 0.15),
            transparent 50%
          );
          animation: lightMove 10s infinite alternate ease-in-out;
          pointer-events: none;
        }

        .content-layer {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 100px 5% 60px;
        }

        .inner-wrap {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-in {
          animation: heroIn 0.8s ease both;
        }

        .eyebrow {
          font-size: 0.8rem;
          letter-spacing: 4px;
          color: #3aa0ff;
          font-weight: 700;
          margin-bottom: 1rem;
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
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }

        .cta-group {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .btn-main {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #3a98ff, #1f6fe0);
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 700;
          text-decoration: none;
          color: white;
          transition: 0.3s;
          box-shadow: 0 10px 25px rgba(47, 139, 255, 0.3);
        }

        .btn-main:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(47, 139, 255, 0.5);
        }

        .arrow {
          transition: transform 0.3s;
        }

        .btn-main:hover .arrow {
          transform: translateX(5px);
        }

        .btn-mobile-trigger {
          display: none;
        }

        /* Desktop search */

        .desktop-search-wrap {
          margin-top: 3rem;
          position: relative;
          z-index: 100;
          max-width: 950px;
        }

        .search-bar {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          padding: 12px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
          display: grid;
          grid-template-columns: 2fr 1fr auto;
          gap: 12px;
          position: relative;
        }

        .field {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.5);
          padding: 0 16px;
          height: 58px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: 0.3s;
          min-width: 0;
        }

        .field:focus-within,
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
          min-width: 0;
          font-size: 0.95rem;
          font-family: inherit;
        }

        .field input::placeholder {
          color: #9ba9be;
        }

        .field-icon {
          flex-shrink: 0;
        }

        .clear-btn {
          background: transparent;
          border: none;
          color: #9ba9be;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .btn-search {
          background: #3aa0ff;
          color: white;
          border: none;
          padding: 0 28px;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.3s;
          white-space: nowrap;
        }

        .btn-search:hover {
          background: #1f6fe0;
          transform: translateY(-1px);
        }

        .custom-dropdown {
          position: relative;
          min-width: 0;
        }

        .dropdown-trigger {
          width: 100%;
          justify-content: space-between;
          cursor: pointer;
          color: white;
          font-family: inherit;
          font-size: 0.95rem;
        }

        .selected-type {
          flex: 1;
          text-align: left;
        }

        .chevron {
          color: #9fb0c8;
        }

        .dropdown-menu {
          position: absolute;
          bottom: 70px;
          left: 0;
          right: 0;
          background: #0b1224;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 15px;
          overflow: hidden;
          z-index: 999;
          box-shadow: 0 -15px 40px rgba(0, 0, 0, 0.6);
          max-height: 300px;
          overflow-y: auto;
        }

        .dropdown-item {
          width: 100%;
          text-align: left;
          border: none;
          padding: 13px 16px;
          font-size: 0.9rem;
          color: #c4cee0;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          transition: 0.2s;
        }

        .dropdown-item:hover,
        .dropdown-item.selected {
          background: #3aa0ff;
          color: white;
        }

        /* Autocomplete */

        .desktop-suggestions {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          width: 100%;
          z-index: 1000;
        }

        .suggestion-panel {
          background: #0b1224;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 12px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }

        .suggestion-heading {
          display: flex;
          justify-content: space-between;
          color: #7faee4;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 2px;
          padding: 8px 10px 14px;
        }

        .suggestion-heading span {
          color: #718198;
          letter-spacing: 0;
        }

        .suggestion-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 10px;
          border: none;
          border-radius: 12px;
          background: transparent;
          color: white;
          text-align: left;
          cursor: pointer;
          transition: 0.2s;
          font-family: inherit;
        }

        .suggestion-item:hover {
          background: rgba(58, 160, 255, 0.12);
        }

        .suggestion-image {
          width: 76px;
          height: 52px;
          flex-shrink: 0;
          border-radius: 9px;
          overflow: hidden;
          background: #18243a;
        }

        .suggestion-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .suggestion-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .suggestion-info strong {
          font-size: 0.92rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .suggestion-info span {
          color: #8796ae;
          font-size: 0.76rem;
        }

        .suggestion-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          white-space: nowrap;
        }

        .suggestion-price strong {
          color: #67b5ff;
          font-size: 0.95rem;
        }

        .suggestion-price span {
          color: #8796ae;
          font-size: 0.7rem;
        }

        .suggestion-arrow {
          color: #3aa0ff;
          font-size: 1.2rem;
        }

        .view-all {
          width: 100%;
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: transparent;
          color: #65b5ff;
          padding: 15px 10px 8px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }

        .view-all:hover {
          color: white;
        }

        .suggestion-message {
          min-height: 90px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          color: #aab7ca;
          font-size: 0.9rem;
        }

        .empty-message {
          flex-direction: column;
          gap: 7px;
          padding: 20px;
        }

        .empty-message strong {
          color: white;
        }

        .empty-message small {
          color: #8796ae;
        }

        .loader {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: #3aa0ff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Features */

        .features-section {
          margin-top: 3.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 2rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, auto);
          gap: 22px;
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 12px;
          transition: 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.08);
        }

        .f-icon {
          font-size: 1.2rem;
          background: rgba(58, 160, 255, 0.12);
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          border: 1px solid rgba(58, 160, 255, 0.2);
        }

        .f-info strong {
          display: block;
          font-size: 0.85rem;
        }

        .f-info span {
          font-size: 0.7rem;
          color: #9fb0c8;
        }

        .signature {
          font-size: 2.2rem;
          color: #3aa0ff;
          text-align: right;
          line-height: 1.1;
          flex-shrink: 0;
        }

        /* Mobile */

        .mobile-car-track {
          display: none;
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(5, 8, 15, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .mobile-sheet {
          width: 100%;
          max-height: 90dvh;
          overflow-y: auto;
          background: #0b1224;
          border-top-left-radius: 28px;
          border-top-right-radius: 28px;
          padding: 20px 22px 35px;
          box-shadow: 0 -20px 50px rgba(0, 0, 0, 0.6);
        }

        .sheet-handle {
          width: 42px;
          height: 5px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 10px;
          margin: 0 auto 24px;
          cursor: pointer;
        }

        .mobile-sheet-heading {
          margin-bottom: 24px;
        }

        .mobile-sheet-heading p {
          color: #3aa0ff;
          letter-spacing: 2px;
          font-size: 0.7rem;
          font-weight: 800;
        }

        .mobile-sheet-heading h2 {
          font-size: 1.9rem;
          font-weight: 800;
          margin-top: 5px;
        }

        .sheet-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .sheet-field {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .sheet-field label {
          font-size: 0.72rem;
          color: #3aa0ff;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .sheet-field input,
        .mobile-dropdown-trigger {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 16px;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          outline: none;
          width: 100%;
          font-family: inherit;
        }

        .sheet-field input:focus,
        .mobile-dropdown-trigger.active {
          border-color: #3aa0ff;
        }

        .sheet-field input::placeholder {
          color: #8492a8;
        }

        .mobile-dropdown-trigger {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: left;
        }

        .mobile-dropdown-menu {
          background: #111d32;
          border-radius: 12px;
          margin-top: 5px;
          overflow: hidden;
        }

        .mob-dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 13px 16px;
          color: #c4cee0;
          border: none;
          background: transparent;
          font-family: inherit;
        }

        .mob-dropdown-item.selected,
        .mob-dropdown-item:active {
          background: #3aa0ff;
          color: white;
        }

        .sheet-btn {
          background: linear-gradient(135deg, #3aa0ff, #1f6fe0);
          color: white;
          border: none;
          padding: 17px;
          border-radius: 13px;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 5px;
          font-family: inherit;
        }

        .mobile-suggestions {
          margin-top: 20px;
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

        @keyframes heroIn {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1100px) {
          .features-grid {
            grid-template-columns: repeat(2, auto);
          }

          .features-section {
            align-items: flex-start;
          }
        }

        @media (max-width: 768px) {
          .banner-root {
            min-height: 100svh;
          }

          .content-layer {
            padding: 110px 6% 45px;
          }

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
            font-weight: 700;
            cursor: pointer;
          }

          .cta-group {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-main {
            justify-content: center;
          }

          .features-section {
            flex-direction: column;
            align-items: center;
            gap: 25px;
            margin-top: 2.5rem;
          }

          .features-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .feature-card {
            gap: 9px;
          }

          .f-info strong {
            font-size: 0.76rem;
          }

          .f-info span {
            font-size: 0.65rem;
          }

          .f-icon {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }

          .signature {
            text-align: center;
          }

          .mobile-car-track {
            display: block;
            position: absolute;
            bottom: 12%;
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
            font-size: 3rem;
            filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.5));
          }

          .hide-mob {
            display: none;
          }
        }

        @keyframes carDrive {
          0% {
            transform: translateX(110vw);
          }
          75%,
          100% {
            transform: translateX(-20vw);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bg-img,
          .light-leak,
          .hero-in,
          .mobile-car-wrapper,
          .loader {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
