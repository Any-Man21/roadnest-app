"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  MAX_DAYS,
  addDays,
  diffDays,
  formatShort,
  parseKey,
  toKey,
  todayKey,
} from "@/lib/date";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const triggerOn =
  "inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50 active:scale-95 hover:cursor-pointer";
const triggerOff =
  "inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-slate-500";

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-[#0e1b30] text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder:text-slate-500";

/* ---------- Range calendar: plain React, no library ---------- */
function RangeCalendar({ start, end, onChange, bookedRanges }) {
  const minStart = addDays(todayKey(), 1); // earliest pick-up = tomorrow
  const first = parseKey(minStart);
  const firstIndex = first.getFullYear() * 12 + first.getMonth();

  const [view, setView] = useState({
    y: first.getFullYear(),
    m: first.getMonth(),
  });
  const [hover, setHover] = useState(null);

  const viewIndex = view.y * 12 + view.m;
  const goTo = (delta) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  const isBooked = (key) =>
    bookedRanges.some((r) => key >= r.startDate && key <= r.endDate);
  const isBlocked = (key) => key < minStart || isBooked(key);

  // can `key` be the last day of a range that starts at `from`?
  const canEnd = (from, key) => {
    if (key < from || diffDays(from, key) + 1 > MAX_DAYS) return false;
    for (let k = from; k <= key; k = addDays(k, 1)) {
      if (isBooked(k)) return false;
    }
    return true;
  };

  const pick = (key) => {
    if (isBlocked(key)) return;
    if (start && !end && canEnd(start, key)) onChange({ start, end: key });
    else onChange({ start: key, end: null });
  };

  // while choosing the drop-off, preview the range under the mouse
  const last = end || (start && hover && canEnd(start, hover) ? hover : null);

  const firstDow = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      toKey(new Date(view.y, view.m, i + 1)),
    ),
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goTo(-1)}
          disabled={viewIndex <= firstIndex}
          aria-label="Previous month"
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <p className="text-sm font-semibold text-white">
          {MONTHS[view.m]} {view.y}
        </p>

        <button
          type="button"
          onClick={() => goTo(1)}
          disabled={viewIndex - firstIndex >= 11}
          aria-label="Next month"
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-slate-500">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((key, i) => {
          if (!key) return <span key={`blank-${i}`} />;

          const booked = isBooked(key);
          const blocked = isBlocked(key);
          const isEdge = key === start || key === last;
          const inRange = start && last && key >= start && key <= last;
          const tooFar = start && !end && !blocked && !canEnd(start, key);

          let cls = "text-slate-200 hover:bg-white/10";
          if (booked) {
            cls =
              "cursor-not-allowed bg-red-500/10 text-red-300/60 line-through";
          } else if (blocked) {
            cls = "cursor-not-allowed text-slate-600";
          } else if (isEdge) {
            cls =
              "bg-gradient-to-br from-blue-400 to-blue-600 font-semibold text-white shadow-md shadow-blue-500/30";
          } else if (inRange) {
            cls = "bg-blue-500/20 text-white";
          } else if (tooFar) {
            cls = "text-slate-500 hover:bg-white/10";
          }

          return (
            <button
              key={key}
              type="button"
              disabled={blocked}
              onClick={() => pick(key)}
              onMouseEnter={() => setHover(key)}
              onMouseLeave={() => setHover(null)}
              title={booked ? "Already booked" : undefined}
              aria-label={`${parseKey(key).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}${booked ? ", already booked" : ""}`}
              className={`h-9 rounded-lg text-sm transition ${cls}`}
            >
              {Number(key.slice(8))}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-blue-500" /> Selected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-red-500/50" /> Booked
        </span>
      </div>
    </div>
  );
}

/* ---------- Booking button + modal ---------- */
export default function BookingCardForm({
  carId,
  carName,
  price,
  imageURL,
  location,
  type,
  status,
  bookedRanges = [],
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [range, setRange] = useState({ start: null, end: null });
  const [formData, setFormData] = useState({
    driverNeeded: "No",
    specialNote: "",
  });

  const available = !status || status === "available";
  const days =
    range.start && range.end ? diffDays(range.start, range.end) + 1 : 0;
  const total = days * Number(price || 0);

  // lock page scroll + close on Escape while the modal is open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && !loading && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, loading]);

  const openModal = () => {
    setRange({ start: null, end: null });
    setIsOpen(true);
  };
  const closeModal = () => {
    if (!loading) setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleBooking(e) {
    e.preventDefault();
    if (loading) return;

    if (!user) {
      toast.error("Please log in to book a car.");
      return;
    }
    if (!range.start || !range.end) {
      toast.error("Please pick your pick-up and drop-off dates.");
      return;
    }

    setLoading(true);

    try {
      // JWT from Better Auth. The backend checks it with your JWKS.
      const { data: tokenData, error: tokenError } = await authClient.token();
      if (tokenError || !tokenData?.token) {
        throw new Error("Your session expired. Please log in again.");
      }

      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          carId,
          startDate: range.start,
          endDate: range.end,
          driverNeeded: formData.driverNeeded,
          specialNote: formData.specialNote,
          // userId is not sent. The server reads it from the token.
          userName: user.name || "",
          userEmail: user.email || "",
          userImage: user.image || "",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Your session expired. Please log in again.");
      }
      if (res.status === 409) {
        // someone booked those days first: reload the blocked dates
        toast.error(data.message || "Those dates are already booked.");
        setRange({ start: null, end: null });
        router.refresh();
        return;
      }
      if (!res.ok) {
        throw new Error(
          data.message || "Something went wrong. Please try again.",
        );
      }

      toast.success(
        `${carName} booked for ${days} ${days === 1 ? "day" : "days"}!`,
      );
      setIsOpen(false);
      setRange({ start: null, end: null });
      setFormData({ driverNeeded: "No", specialNote: "" });
      router.refresh(); // re-fetch the car so the new booked dates show
    } catch (err) {
      toast.error(
        err instanceof TypeError
          ? "Can’t reach the server. Check that your backend is running."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  }

  /* what the user sees on the car page */
  let trigger;
  if (isPending) {
    trigger = (
      <button type="button" disabled className={triggerOff}>
        Loading…
      </button>
    );
  } else if (!user) {
    trigger = (
      <Link href="/login" className={triggerOn}>
        Log in to book
      </Link>
    );
  } else if (!available) {
    trigger = (
      <button type="button" disabled className={triggerOff}>
        Not available
      </button>
    );
  } else {
    trigger = (
      <button type="button" onClick={openModal} className={triggerOn}>
        Book Now
      </button>
    );
  }

  const modal = (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0a1424] p-5 shadow-2xl transition-all duration-300 ease-out starting:translate-y-6 starting:opacity-0 sm:rounded-3xl sm:p-6"
      >
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close"
          className="absolute right-4 top-4 text-slate-400 transition hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 id="booking-title" className="pr-8 text-2xl font-bold text-white">
          Confirm Booking
        </h2>

        {/* car summary (props drilled from the car page) */}
        <div className="mb-5 mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          {imageURL && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageURL}
              alt={carName}
              onError={() => setImgFailed(true)}
              className="h-14 w-20 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="grid h-14 w-20 shrink-0 place-items-center rounded-lg bg-[#122036] text-slate-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path d="M5 16l1.6-5.2A2 2 0 0 1 8.5 9.4h7a2 2 0 0 1 1.9 1.4L19 16" />
                <path d="M3 16h18v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
              </svg>
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-white">{carName}</p>
            <p className="truncate text-xs text-slate-400">
              {[type, location].filter(Boolean).join(" · ")}
            </p>
            <p className="text-sm font-semibold text-blue-400">
              ${price}
              <span className="text-xs font-normal text-slate-400"> /day</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleBooking} className="space-y-5">
          {/* Dates */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">
              Rental dates
            </label>
            <p className="-mt-1 text-xs text-slate-400">
              Pick up to {MAX_DAYS} days. The earliest pick-up is tomorrow.
            </p>
            <RangeCalendar
              start={range.start}
              end={range.end}
              onChange={setRange}
              bookedRanges={bookedRanges}
            />
          </div>

          {/* Summary */}
          <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Pick-up</span>
              <span className="font-medium text-white">
                {range.start ? formatShort(range.start) : "Select a date"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Drop-off</span>
              <span className="font-medium text-white">
                {range.end ? formatShort(range.end) : "Select a date"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration</span>
              <span className="font-medium text-white">
                {days ? `${days} ${days === 1 ? "day" : "days"}` : "-"}
              </span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-slate-300">Total</span>
              <span className="text-lg font-bold text-blue-400">
                {days ? `$${total.toLocaleString("en-US")}` : "-"}
              </span>
            </div>
          </div>

          {/* Driver Needed */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">
              Driver Needed?
            </label>
            <select
              name="driverNeeded"
              value={formData.driverNeeded}
              onChange={handleChange}
              className={`${fieldClass} h-11 px-3`}
            >
              <option value="No">No, I will drive</option>
              <option value="Yes">Yes, I need a driver</option>
            </select>
          </div>

          {/* Special Note */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">
              Special Note
            </label>
            <textarea
              name="specialNote"
              value={formData.specialNote}
              onChange={handleChange}
              maxLength={500}
              placeholder="Any specific requests or pickup details..."
              rows="3"
              className={`${fieldClass} p-3`}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !days}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:cursor-pointer hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.918l3-2.627z"
                  />
                </svg>
                Processing...
              </span>
            ) : days ? (
              `Confirm Booking · $${total.toLocaleString("en-US")}`
            ) : (
              "Pick your dates"
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ top: "42%" }}
        toastOptions={{
          style: {
            background: "#0a1424",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "16px 24px",
            fontSize: "1rem",
            borderRadius: "14px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          },
        }}
      />

      {trigger}

      {/* portal: modal always sits on top of the page, never trapped by a parent */}
      {isOpen && createPortal(modal, document.body)}
    </>
  );
}
