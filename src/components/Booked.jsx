"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  addDays,
  deliveryWindow,
  diffDays,
  formatRange,
  parseKey,
  todayKey,
} from "@/lib/date";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const CANCEL_WINDOW_MS = 24 * 60 * 60 * 1000;

// JWT from Better Auth. The backend checks it with your JWKS.
async function authHeaders() {
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    throw new Error("Your session expired. Please log in again.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data.token}`,
  };
}

const STATE = {
  upcoming: {
    label: "Upcoming",
    dot: "bg-sky-400",
    text: "text-sky-300",
    border: "border-sky-400/25",
    pulse: false,
  },
  ongoing: {
    label: "Ongoing",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    border: "border-emerald-400/35",
    pulse: true,
  },
  completed: {
    label: "Ride completed",
    dot: "bg-violet-400",
    text: "text-violet-300",
    border: "border-violet-400/25",
    pulse: false,
  },
  cancelled: {
    label: "Ride canceled by owner",
    dot: "bg-red-400",
    text: "text-red-300",
    border: "border-red-400/30",
    pulse: false,
  },
  removed: {
    label: "Car removed from service",
    dot: "bg-amber-400",
    text: "text-amber-300",
    border: "border-amber-400/30",
    pulse: false,
  },
};

const TONE = {
  ok: "bg-emerald-500/[0.06] text-emerald-300",
  info: "bg-sky-500/[0.05] text-sky-200",
  muted: "text-slate-400",
};

function getState(booking, today) {
  if (booking.endDate < today) return "completed";
  if (booking.startDate <= today) return "ongoing";
  return "upcoming";
}

function timeLine(state, startDate, endDate, today) {
  if (state === "upcoming") {
    const n = diffDays(today, startDate);
    return n === 1 ? "Starts tomorrow" : `Starts in ${n} days`;
  }
  if (state === "ongoing") {
    const n = diffDays(today, endDate);
    if (n === 0) return "Ends today";
    return n === 1 ? "Ends tomorrow" : `Ends in ${n} days`;
  }
  return "Trip finished";
}

function formatLeft(ms) {
  const mins = Math.max(1, Math.ceil(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function AlertIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  );
}

function DateBlock({ label, dateKey, right = false }) {
  const d = parseKey(dateKey);
  return (
    <div className={`shrink-0 ${right ? "text-right" : ""}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1 flex items-baseline gap-1.5 ${right ? "justify-end" : ""}`}
      >
        <span className="text-3xl font-bold leading-none text-white sm:text-4xl">
          {d.getDate()}
        </span>
        <span className="text-sm font-semibold uppercase text-blue-300">
          {d.toLocaleDateString("en-US", { month: "short" })}
        </span>
      </p>
      <p className="mt-1 text-xs text-slate-400">
        {d.toLocaleDateString("en-US", { weekday: "short", year: "numeric" })}
      </p>
    </div>
  );
}

function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
    </svg>
  );
}

export default function Booked({
  booking,
  index = 0,
  onCancelled,
  onRated,
  onReceived,
  onRemoved,
}) {
  const {
    _id,
    carId,
    carName,
    carImage,
    carType,
    carLocation,
    pricePerDay,
    startDate,
    endDate,
    days,
    totalPrice,
    driverNeeded,
    specialNote,
    createdAt,
    deliveredAt,
    receivedAt,
    cancelledBy,
    carRemoved,
    rating = 0,
  } = booking;

  const [imgFailed, setImgFailed] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [confirming, setConfirming] = useState(false);
  const [askReceived, setAskReceived] = useState(false);
  const [gotIt, setGotIt] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hover, setHover] = useState(0);

  // owner cancelled the ride, or the owner removed the car from the website
  const cancelledByOwner = cancelledBy === "owner";
  const removed = Boolean(carRemoved) && !cancelledByOwner;
  const dead = cancelledByOwner || removed;

  const today = todayKey();
  const stateKey = cancelledByOwner
    ? "cancelled"
    : removed
      ? "removed"
      : getState(booking, today);
  const st = STATE[stateKey];
  const done = stateKey === "completed";

  const delivered = Boolean(deliveredAt);
  const received = Boolean(receivedAt) || gotIt;
  const win = deliveryWindow(startDate, today);

  // free cancellation: 24h after the booking was made, and only before delivery
  const deadline = createdAt
    ? new Date(createdAt).getTime() + CANCEL_WINDOW_MS
    : 0;
  const msLeft = deadline - now;
  const canCancel = !dead && !done && !delivered && msLeft > 0;

  // tick while the window is open, so the countdown stays fresh
  useEffect(() => {
    if (!canCancel) return;
    const id = setInterval(() => setNow(Date.now()), 20000);
    return () => clearInterval(id);
  }, [canCancel]);

  const count = days || diffDays(startDate, endDate) + 1;
  const bookedOn = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // the car page is gone when the car was removed, so no link there
  const CarLink = removed ? "div" : Link;
  const carLinkProps = removed
    ? {}
    : { href: `/cars/${carId}`, "aria-label": `View ${carName}` };

  // delivery row (shown until the ride is completed)
  let deliveryRow = null;
  if (!done && !dead) {
    if (received) {
      deliveryRow = {
        tone: "ok",
        text: "Safely delivered. You confirmed that you received the car.",
      };
    } else if (delivered && win === "open") {
      deliveryRow = { tone: "ask" };
    } else if (delivered) {
      deliveryRow = {
        tone: "info",
        text: "The owner marked your car as delivered.",
      };
    } else if (win === "open") {
      deliveryRow = {
        tone: "info",
        text: "Delivery day. Waiting for the owner to deliver your car.",
      };
    } else if (win === "before") {
      deliveryRow = {
        tone: "muted",
        text: `Delivery window: ${formatRange(startDate, addDays(startDate, 1))}`,
      };
    } else {
      deliveryRow = { tone: "muted", text: "The delivery window has ended." };
    }
  }

  async function handleCancel() {
    if (busy) return;
    setBusy(true);
    try {
      const headers = await authHeaders();
      // the server knows who you are from the token, so no userId is sent
      const res = await fetch(`${API_URL}/bookings/${_id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error("Your session expired. Please log in again.");
      }
      if (!res.ok)
        throw new Error(data.message || "Couldn’t cancel the booking.");

      toast.success("Booking cancelled. The dates are free again.");
      onCancelled?.(_id);
    } catch (err) {
      toast.error(
        err instanceof TypeError
          ? "Can’t reach the server. Check that your backend is running."
          : err.message,
      );
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  }

  // clears a "canceled by owner" or "car removed" card
  async function handleRemove() {
    if (busy) return;
    setBusy(true);
    try {
      const headers = await authHeaders();
      const url = cancelledByOwner
        ? `${API_URL}/cancelled-bookings/${_id}`
        : `${API_URL}/bookings/${_id}`;
      const res = await fetch(url, { method: "DELETE", headers });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error("Your session expired. Please log in again.");
      }
      if (!res.ok) throw new Error(data.message || "Couldn’t remove the card.");

      onRemoved?.(_id);
    } catch (err) {
      toast.error(
        err instanceof TypeError
          ? "Can’t reach the server. Check that your backend is running."
          : err.message,
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleReceived() {
    if (busy) return;
    setBusy(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/bookings/${_id}/received`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error("Your session expired. Please log in again.");
      }
      if (!res.ok)
        throw new Error(data.message || "Couldn’t confirm the delivery.");

      toast.success("Great! Marked as safely delivered.");
      setGotIt(true);
      setAskReceived(false);
      onReceived?.(_id, data.receivedAt);
    } catch (err) {
      toast.error(
        err instanceof TypeError
          ? "Can’t reach the server. Check that your backend is running."
          : err.message,
      );
      setAskReceived(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleRate(value) {
    if (busy) return;
    setBusy(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/bookings/${_id}/rating`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ rating: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error("Your session expired. Please log in again.");
      }
      if (!res.ok)
        throw new Error(data.message || "Couldn’t save your rating.");

      toast.success(`Thanks! You rated this ride ${value}/5.`);
      onRated?.(_id, value);
    } catch (err) {
      toast.error(
        err instanceof TypeError
          ? "Can’t reach the server. Check that your backend is running."
          : err.message,
      );
    } finally {
      setBusy(false);
    }
  }

  const shown = hover || rating;

  return (
    <div
      style={{ transitionDelay: `${Math.min(index, 8) * 70}ms` }}
      className="transition-all duration-500 ease-out starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none"
    >
      <article
        className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br from-[#0e1b30] to-[#08111f] shadow-xl shadow-black/30 ${st.border}`}
      >
        <div className="flex flex-col md:flex-row">
          {/* Photo */}
          <CarLink
            {...carLinkProps}
            className="group relative block aspect-[16/8] w-full shrink-0 overflow-hidden bg-[#0a1424] md:aspect-auto md:w-56 lg:w-64"
          >
            {carImage && !imgFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={carImage}
                alt={carName}
                loading="lazy"
                onError={() => setImgFailed(true)}
                className={`absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105 ${
                  done || dead ? "grayscale-[70%]" : ""
                }`}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-slate-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-12 w-12"
                  aria-hidden="true"
                >
                  <path d="M5 16l1.6-5.2A2 2 0 0 1 8.5 9.4h7a2 2 0 0 1 1.9 1.4L19 16" />
                  <path d="M3 16h18v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                </svg>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08111f]/90 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#08111f]/60" />

            <span
              className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-xs font-medium backdrop-blur ${st.text}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${st.dot} ${st.pulse ? "animate-pulse" : ""}`}
              />
              {st.label}
            </span>
          </CarLink>

          {/* Trip details */}
          <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
            <div className="min-w-0">
              <CarLink
                {...(removed ? {} : { href: `/cars/${carId}` })}
                className={`block truncate text-xl font-bold text-white ${
                  removed ? "" : "transition-colors hover:text-blue-300"
                }`}
              >
                {carName}
              </CarLink>
              <p className="mt-0.5 truncate text-sm text-slate-400">
                {[carType, carLocation].filter(Boolean).join(" · ")}
              </p>
              <p className={`mt-1 text-xs font-medium ${st.text}`}>
                {cancelledByOwner
                  ? "This ride will not happen"
                  : removed
                    ? "This car is no longer on RoadNest"
                    : timeLine(stateKey, startDate, endDate, today)}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <DateBlock label="Pick-up" dateKey={startDate} />

              <div
                className="flex min-w-0 flex-1 items-center gap-2"
                aria-hidden="true"
              >
                <span className="h-px flex-1 border-t border-dashed border-white/20" />
                <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                  {count} {count === 1 ? "day" : "days"}
                </span>
                <span className="h-px flex-1 border-t border-dashed border-white/20" />
              </div>

              <DateBlock label="Drop-off" dateKey={endDate} right />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="rounded-lg bg-white/5 px-2.5 py-1">
                {driverNeeded === "Yes" ? "Driver included" : "Self-drive"}
              </span>
              {!dead && received ? (
                <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-300">
                  Safely delivered
                </span>
              ) : !dead && delivered ? (
                <span className="rounded-lg bg-sky-500/10 px-2.5 py-1 font-medium text-sky-300">
                  Delivered
                </span>
              ) : null}
              {specialNote && (
                <span className="max-w-full truncate rounded-lg bg-white/5 px-2.5 py-1 italic text-slate-400">
                  “{specialNote}”
                </span>
              )}
            </div>
          </div>

          {/* Ticket stub */}
          <div className="relative flex shrink-0 flex-row items-center justify-between gap-4 border-t border-dashed border-white/20 bg-white/[0.03] px-5 py-4 md:w-52 md:flex-col md:items-stretch md:justify-center md:gap-5 md:border-l md:border-t-0">
            {/* ticket notches */}
            <span
              aria-hidden="true"
              className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-white/10 bg-[#060b14]"
            />
            <span
              aria-hidden="true"
              className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-white/10 bg-[#060b14] md:-bottom-3 md:-left-3 md:right-auto md:top-auto"
            />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Total
              </p>
              <p
                className={`text-3xl font-bold ${
                  dead ? "text-slate-500 line-through" : "text-blue-400"
                }`}
              >
                ${Number(totalPrice || 0).toLocaleString("en-US")}
              </p>
              <p className="text-xs text-slate-400">
                ${pricePerDay}/day × {count} {count === 1 ? "day" : "days"}
              </p>
            </div>

            <div className="text-right md:text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Booking ID
              </p>
              <p className="font-mono text-sm text-white">
                #{String(_id).slice(-6).toUpperCase()}
              </p>
              {bookedOn && (
                <p className="mt-1 text-xs text-slate-500">Booked {bookedOn}</p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery row: owner delivered -> renter confirms "Received?" */}
        {deliveryRow &&
          (deliveryRow.tone === "ask" ? (
            <div className="flex flex-col gap-3 border-t border-dashed border-white/20 bg-sky-500/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              {askReceived ? (
                <>
                  <p className="text-sm text-slate-200">
                    Did you receive the car?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setAskReceived(false)}
                      className="h-10 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                    >
                      Not yet
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={handleReceived}
                      className="h-10 flex-1 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                    >
                      {busy ? "Saving…" : "Yes, received"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-300">
                    The owner says your car was delivered.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAskReceived(true)}
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:brightness-110 active:scale-[0.97] sm:w-auto"
                  >
                    Received?
                  </button>
                </>
              )}
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 border-t border-dashed border-white/20 px-5 py-3 text-xs ${TONE[deliveryRow.tone]}`}
            >
              {deliveryRow.tone === "ok" && (
                <CheckIcon className="h-4 w-4 shrink-0" />
              )}
              <span>{deliveryRow.text}</span>
            </div>
          ))}

        {/* Footer: cancelled / removed notice, rating after the ride, or cancel during the first 24 hours */}
        {dead ? (
          <div
            className={`flex flex-col gap-3 border-t border-dashed border-white/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
              cancelledByOwner ? "bg-red-500/[0.06]" : "bg-amber-500/[0.06]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${
                  cancelledByOwner
                    ? "border-red-400/30 bg-red-500/10 text-red-300"
                    : "border-amber-400/30 bg-amber-500/10 text-amber-300"
                }`}
              >
                <AlertIcon />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  {cancelledByOwner
                    ? "Ride canceled by owner"
                    : "Car removed from service"}
                </p>
                <p className="text-xs text-slate-400">
                  {cancelledByOwner
                    ? "The owner cancelled this ride. You can book again from the cars page."
                    : "The owner removed this car from RoadNest, so this booking can’t go ahead."}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {cancelledByOwner && (
                <Link
                  href="/cars"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:brightness-110 active:scale-[0.97] sm:flex-none"
                >
                  Browse cars
                </Link>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={handleRemove}
                className="h-10 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
              >
                {busy ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        ) : done ? (
          <div className="flex flex-col gap-3 border-t border-dashed border-white/20 bg-violet-500/[0.05] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-400/30 bg-violet-500/10 text-violet-300">
                <CheckIcon />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Ride completed
                </p>
                <p className="text-xs text-slate-400">
                  {rating
                    ? `You rated this ride ${rating}/5`
                    : "How was your ride?"}
                </p>
              </div>
            </div>

            <div
              role="radiogroup"
              aria-label="Rate your ride"
              onMouseLeave={() => setHover(0)}
              className="flex items-center gap-0.5"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                  disabled={busy}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => handleRate(n)}
                  className={`rounded p-0.5 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60 ${
                    n <= shown ? "text-amber-400" : "text-slate-600"
                  }`}
                >
                  <Star filled={n <= shown} />
                </button>
              ))}
            </div>
          </div>
        ) : canCancel ? (
          <div className="flex flex-col gap-3 border-t border-dashed border-white/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            {confirming ? (
              <>
                <p className="text-sm text-slate-300">
                  Cancel this booking? The dates will be free for others.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setConfirming(false)}
                    className="h-10 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                  >
                    Keep booking
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleCancel}
                    className="h-10 flex-1 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                  >
                    {busy ? "Cancelling…" : "Yes, cancel"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="flex items-center gap-2 text-xs text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <span>
                    Free cancellation ends in{" "}
                    <span className="font-semibold text-white">
                      {formatLeft(msLeft)}
                    </span>
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-red-400/40 bg-red-500/10 px-4 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/20 active:scale-[0.97] sm:w-auto"
                >
                  Cancel booking
                </button>
              </>
            )}
          </div>
        ) : null}
      </article>
    </div>
  );
}
