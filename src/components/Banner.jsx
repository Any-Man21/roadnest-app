"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const BG =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop";

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

/* Defined outside Banner, so it is not rebuilt on every keystroke */
function SuggestionList({ loading, cars, onSelect, onViewAll }) {
  const empty = !loading && cars.length === 0;

  return (
    <div
      className="suggestion-panel"
      style={{ opacity: loading && cars.length ? 0.6 : 1 }}
    >
      {loading && cars.length === 0 ? (
        <div className="suggestion-message">
          <span className="loader" />
          Searching the fleet...
        </div>
      ) : empty ? (
        <div className="suggestion-message empty-message">
          <span>🔎</span>
          <strong>No matching vehicles</strong>
          <small>Try another name or category.</small>
        </div>
      ) : (
        <>
          <div className="suggestion-heading">
            MATCHING VEHICLES
            <span>{cars.length} found</span>
          </div>

          {cars.map((car) => (
            <button
              key={car._id}
              type="button"
              className="suggestion-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(car)}
            >
              <div className="suggestion-image">
                {car.imageUrl ? (
                  <img
                    src={car.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="suggestion-fallback">🚘</span>
                )}
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
                  ${Number(car.pricePerDay || 0).toLocaleString("en-US")}
                </strong>
                <span>/ day</span>
              </div>

              <span className="suggestion-arrow">↗</span>
            </button>
          ))}

          <button type="button" className="view-all" onClick={onViewAll}>
            View all matching vehicles →
          </button>
        </>
      )}
    </div>
  );
}

export default function UltraLuxuryBanner() {
  const router = useRouter();
  const desktopRef = useRef(null);

  const [form, setForm] = useState({ q: "", type: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobTypeOpen, setIsMobTypeOpen] = useState(false);

  const hasQuery = Boolean(form.q.trim() || form.type);

  // Build the Explore Cars URL
  const searchURL = () => {
    const params = new URLSearchParams();
    if (form.q.trim()) params.set("search", form.q.trim());
    if (form.type) params.set("type", form.type);
    const qs = params.toString();
    return `/cars${qs ? `?${qs}` : ""}`;
  };

  // Live suggestions: wait 300ms after the last keystroke
  useEffect(() => {
    if (!isFocused && !isSearchOpen) return;

    if (!hasQuery) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (form.q.trim()) params.set("search", form.q.trim());
        if (form.type) params.set("type", form.type);
        params.set("limit", "6");

        const res = await fetch(`${API_URL}/cars?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Unable to search cars");

        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [form.q, form.type, isFocused, isSearchOpen, hasQuery]);

  // Click outside the desktop search closes its pop-ups
  useEffect(() => {
    if (!isFocused && !isTypeOpen) return;

    const onDown = (e) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target)) {
        setIsFocused(false);
        setIsTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isFocused, isTypeOpen]);

  // Esc closes everything
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setIsFocused(false);
      setIsTypeOpen(false);
      setIsSearchOpen(false);
      setIsMobTypeOpen(false);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll while the mobile sheet is open
  useEffect(() => {
    if (!isSearchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isSearchOpen]);

  const closeAll = () => {
    setIsFocused(false);
    setIsSearchOpen(false);
    setIsTypeOpen(false);
    setIsMobTypeOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    closeAll();
    router.push(searchURL());
  };

  const goToCar = (car) => {
    closeAll();
    router.push(`/cars/${car._id}`);
  };

  const selectCategory = (type) => {
    setForm((prev) => ({ ...prev, type }));
    setIsTypeOpen(false);
    setIsMobTypeOpen(false);
  };

  return (
    <section className={`banner-root ${barlow.className}`}>
      {/* Background: responsive sizes, no heavy animation */}
      <div className="bg-container" aria-hidden="true">
        <img
          src={`${BG}&w=1600&q=70`}
          srcSet={`${BG}&w=640&q=65 640w, ${BG}&w=1080&q=70 1080w, ${BG}&w=1600&q=70 1600w, ${BG}&w=2070&q=70 2070w`}
          sizes="100vw"
          alt=""
          className="bg-img"
          fetchPriority="high"
          decoding="async"
        />
        <div className="bg-overlay" />
      </div>

      {/* Mobile car animation */}
      <div className="mobile-car-track" aria-hidden="true">
        <div className="mobile-car-wrapper">
          <div className="mobile-car-emoji">🏎️</div>
        </div>
      </div>

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
              <div className="field">
                <span className="field-icon">🔍</span>

                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Search car name... e.g. Porsche"
                  value={form.q}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => {
                    setIsTypeOpen(false);
                    setForm((prev) => ({ ...prev, q: e.target.value }));
                  }}
                />

                {form.q && (
                  <button
                    type="button"
                    className="clear-btn"
                    aria-label="Clear search"
                    onClick={() => setForm((prev) => ({ ...prev, q: "" }))}
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="custom-dropdown">
                <button
                  type="button"
                  className={`field dropdown-trigger ${isTypeOpen ? "active" : ""}`}
                  onClick={() => {
                    setIsTypeOpen(!isTypeOpen);
                    setIsFocused(false);
                  }}
                >
                  <span>🚘</span>
                  <span className="selected-type">
                    {form.type || "All Types"}
                  </span>
                  <span className="chevron">{isTypeOpen ? "▴" : "▾"}</span>
                </button>

                {isTypeOpen && (
                  <div className="dropdown-menu pop">
                    <button
                      type="button"
                      className={`dropdown-item ${!form.type ? "selected" : ""}`}
                      onClick={() => {
                        selectCategory("");
                        setIsFocused(true);
                      }}
                    >
                      All Types
                    </button>

                    {CATEGORIES.map((type) => (
                      <button
                        type="button"
                        key={type}
                        className={`dropdown-item ${form.type === type ? "selected" : ""}`}
                        onClick={() => {
                          selectCategory(type);
                          setIsFocused(true);
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="btn-search">
                Search <span>→</span>
              </button>
            </form>

            {isFocused && hasQuery && (
              <div className="desktop-suggestions pop">
                <SuggestionList
                  loading={loading}
                  cars={suggestions}
                  onSelect={goToCar}
                  onViewAll={() => {
                    closeAll();
                    router.push(searchURL());
                  }}
                />
              </div>
            )}
          </div>

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

      {/* Mobile search sheet */}
      {isSearchOpen && (
        <div
          className="mobile-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAll();
          }}
        >
          <div className="mobile-sheet">
            <div className="sheet-handle" onClick={closeAll} />

            <div className="mobile-sheet-heading">
              <p>DISCOVER YOUR NEXT RIDE</p>
              <h2>Find Your Ride.</h2>
            </div>

            <form className="sheet-form" onSubmit={onSubmit}>
              <div className="sheet-field">
                <label htmlFor="m-model">CAR MODEL</label>

                <input
                  id="m-model"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Porsche 911"
                  value={form.q}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, q: e.target.value }))
                  }
                />
              </div>

              <div className="sheet-field">
                <label>VEHICLE CATEGORY</label>

                <button
                  type="button"
                  className={`mobile-dropdown-trigger ${isMobTypeOpen ? "active" : ""}`}
                  onClick={() => setIsMobTypeOpen(!isMobTypeOpen)}
                >
                  <span>{form.type || "All Types"}</span>
                  <span>{isMobTypeOpen ? "▴" : "▾"}</span>
                </button>

                {isMobTypeOpen && (
                  <div className="mobile-dropdown-menu pop">
                    <button
                      type="button"
                      className={`mob-dropdown-item ${!form.type ? "selected" : ""}`}
                      onClick={() => selectCategory("")}
                    >
                      All Types
                    </button>

                    {CATEGORIES.map((type) => (
                      <button
                        type="button"
                        key={type}
                        className={`mob-dropdown-item ${form.type === type ? "selected" : ""}`}
                        onClick={() => selectCategory(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="sheet-btn">
                Search Vehicles →
              </button>
            </form>

            {hasQuery && (
              <div className="mobile-suggestions">
                <SuggestionList
                  loading={loading}
                  cars={suggestions}
                  onSelect={goToCar}
                  onViewAll={() => {
                    closeAll();
                    router.push(searchURL());
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .banner-root {
          position: relative;
          min-height: calc(100svh - 64px);
          width: 100%;
          color: white;
          display: flex;
          align-items: center;
          background: #05080f;
          z-index: 1;
        }

        .bg-container {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bg-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 20% 30%,
              rgba(58, 160, 255, 0.14),
              transparent 50%
            ),
            linear-gradient(
              to right,
              rgba(5, 8, 15, 0.95) 0%,
              rgba(5, 8, 15, 0.65) 55%,
              rgba(5, 8, 15, 0.35) 100%
            );
        }

        .content-layer {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 72px 5% 64px;
        }

        .inner-wrap {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-in {
          animation: heroIn 0.7s ease both;
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
          background-clip: text;
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
          transition:
            transform 0.3s,
            box-shadow 0.3s;
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
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
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
          transition:
            border-color 0.3s,
            background 0.3s;
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
          transition:
            background 0.3s,
            transform 0.3s;
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
          transition: background 0.2s;
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
          transition: opacity 0.2s;
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
          transition: background 0.2s;
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
          display: grid;
          place-items: center;
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
          transition:
            transform 0.3s,
            background 0.3s;
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
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeIn 0.2s ease both;
        }

        .mobile-sheet {
          width: 100%;
          max-height: 90dvh;
          overflow-y: auto;
          overscroll-behavior: contain;
          background: #0b1224;
          border-top-left-radius: 28px;
          border-top-right-radius: 28px;
          padding: 20px 22px 35px;
          box-shadow: 0 -20px 50px rgba(0, 0, 0, 0.6);
          animation: sheetUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both;
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

        .pop {
          animation: popUp 0.18s ease both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes sheetUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: none;
          }
        }

        @keyframes popUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: none;
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

        @keyframes carDrive {
          0% {
            transform: translateX(110vw);
          }
          75%,
          100% {
            transform: translateX(-20vw);
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
          .content-layer {
            padding: 56px 6% 45px;
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
            overflow: hidden;
            z-index: 5;
            pointer-events: none;
          }

          .mobile-car-wrapper {
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

        @media (prefers-reduced-motion: reduce) {
          .hero-in,
          .mobile-car-wrapper,
          .loader,
          .pop,
          .mobile-overlay,
          .mobile-sheet {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
