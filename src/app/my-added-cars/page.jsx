"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Barlow } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { EditCarDetails } from "@/components/EditCarDetails";
import { DeleteCar } from "@/components/DeleteCar";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50";

const STATUS = {
  available: {
    label: "Available",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    bar: "border-l-emerald-400",
    pulse: true,
  },
  unavailable: {
    label: "Unavailable",
    dot: "bg-red-400",
    text: "text-red-300",
    bar: "border-l-red-400",
    pulse: false,
  },
  maintenance: {
    label: "Maintenance",
    dot: "bg-amber-400",
    text: "text-amber-300",
    bar: "border-l-amber-400",
    pulse: false,
  },
};

export default function MyAddedCarsPage() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  // Result is tagged with the user it belongs to, so one user's cars
  // can never flash on screen for another user.
  const [result, setResult] = useState({
    ownerId: null,
    cars: [],
    error: false,
  });

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    async function fetchMyCars() {
      try {
        // JWT from Better Auth. The backend checks it with your JWKS.
        const { data, error } = await authClient.token();
        if (error || !data?.token) {
          throw new Error("Failed to obtain authentication token");
        }

        const res = await fetch(`${API_URL}/my-cars`, {
          method: "GET",
          headers: { Authorization: `Bearer ${data.token}` },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch your cars");

        const cars = await res.json();
        setResult({ ownerId: userId, cars, error: false });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("My Added Cars error:", err);
          setResult({ ownerId: userId, cars: [], error: true });
        }
      }
    }

    fetchMyCars();

    return () => controller.abort();
  }, [userId]);

  // car edited: show the new values on its row
  const handleUpdated = (id, changes) =>
    setResult((r) => ({
      ...r,
      cars: r.cars.map((c) => (c._id === id ? { ...c, ...changes } : c)),
    }));

  // car deleted: remove its row
  const handleDeleted = (id) =>
    setResult((r) => ({
      ...r,
      cars: r.cars.filter((c) => c._id !== id),
    }));

  const waiting = isPending || (userId && result.ownerId !== userId);
  const showList =
    !waiting && userId && !result.error && result.cars.length > 0;

  let content;
  if (waiting) {
    content = <ListSkeleton />;
  } else if (!userId) {
    content = (
      <MessageCard
        title="Log in to see your cars"
        text="Your added cars are private. Log in to view and manage them."
      >
        <Link href="/login" className={`${buttonClass} mt-6`}>
          Login
        </Link>
      </MessageCard>
    );
  } else if (result.error) {
    content = (
      <MessageCard
        title="Couldn’t load your cars"
        text="We can’t reach the server right now. Check that your backend is running, then refresh the page."
      />
    );
  } else if (result.cars.length === 0) {
    content = <EmptyGarage />;
  } else {
    content = (
      <div className="grid grid-cols-1 gap-5">
        {result.cars.map((car, i) => (
          <ListingRow
            key={car._id}
            car={car}
            index={i}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Outside <main> so the navbar can't cover it. Centered pop-up. */}
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

      <main
        className={`${barlow.className} relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-[#060b14] px-4 py-10 text-white sm:px-6 sm:py-14`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[720px] max-w-[140vw] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]"
        />

        <div className="mx-auto w-full max-w-5xl">
          <header className="flex flex-col gap-4 transition-all duration-700 ease-out starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                My Added{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  Cars
                </span>
              </h1>
              {showList && (
                <p className="mt-3 text-sm text-slate-400 sm:text-base">
                  {result.cars.length}{" "}
                  {result.cars.length === 1 ? "car" : "cars"} listed under your
                  account.
                </p>
              )}
            </div>

            {showList && (
              <Link
                href="/add-car"
                className={`${buttonClass} w-full sm:w-auto`}
              >
                + Add Car
              </Link>
            )}
          </header>

          <section className="mt-8 sm:mt-10">{content}</section>
        </div>

        <style jsx global>{`
          .ma-car {
            left: -30%;
            animation: ma-drive 9s linear infinite;
          }
          .ma-wheel {
            transform-box: fill-box;
            transform-origin: center;
            animation: ma-spin 0.5s linear infinite;
          }
          .ma-dashes {
            background-image: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.6) 0 36px,
              transparent 36px
            );
            background-size: 72px 100%;
            animation: ma-road 1s linear infinite;
          }
          @keyframes ma-drive {
            to {
              left: 110%;
            }
          }
          @keyframes ma-spin {
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes ma-road {
            to {
              background-position-x: -72px;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .ma-car {
              animation: none;
              left: 40%;
            }
            .ma-wheel,
            .ma-dashes {
              animation: none;
            }
          }
        `}</style>
      </main>
    </>
  );
}

function ListingRow({ car, index, onUpdated, onDeleted }) {
  const {
    _id,
    name,
    pricePerDay,
    type,
    imageUrl,
    seats,
    location,
    description,
    status,
  } = car;

  const [imgFailed, setImgFailed] = useState(false);
  const st = STATUS[status] || STATUS.available;

  return (
    <div
      style={{ transitionDelay: `${Math.min(index, 8) * 70}ms` }}
      className="transition-all duration-500 ease-out starting:translate-x-4 starting:opacity-0 motion-reduce:transition-none"
    >
      <article
        className={`flex flex-col overflow-hidden rounded-2xl border border-l-4 border-white/10 ${st.bar} bg-white/[0.04] shadow-lg shadow-black/30 transition-colors duration-300 hover:bg-white/[0.07] sm:flex-row`}
      >
        <Link
          href={`/cars/${_id}`}
          aria-label={`View ${name}`}
          className="group relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#122036] to-[#0a1424] sm:aspect-auto sm:min-h-44 sm:w-60 lg:w-72"
        >
          {imageUrl && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
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
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/cars/${_id}`}
              className="block min-w-0 line-clamp-1 text-lg font-semibold transition-colors hover:text-blue-300 sm:text-xl"
            >
              {name}
            </Link>
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-medium ${st.text}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${st.dot} ${st.pulse ? "animate-pulse" : ""}`}
              />
              {st.label}
            </span>
          </div>

          <p className="line-clamp-2 text-sm leading-5 text-slate-400">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            {type && (
              <span className="rounded-lg bg-white/5 px-2.5 py-1">{type}</span>
            )}
            <span className="rounded-lg bg-white/5 px-2.5 py-1">
              {seats} seats
            </span>
            <span className="max-w-full truncate rounded-lg bg-white/5 px-2.5 py-1">
              {location}
            </span>
          </div>

          <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="leading-tight">
              <span className="text-xl font-bold text-blue-400">
                ${Number(pricePerDay || 0).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400"> /day</span>
            </p>

            <div className="flex gap-2">
              <EditCarDetails
                car={car}
                onUpdated={(changes) => onUpdated(_id, changes)}
              />
              <DeleteCar car={car} onDeleted={() => onDeleted(_id)} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:flex-row"
        >
          <div className="aspect-[16/10] w-full bg-white/5 sm:aspect-auto sm:min-h-44 sm:w-60 lg:w-72" />
          <div className="flex-1 space-y-3 p-5">
            <div className="h-5 w-1/2 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-2/3 rounded bg-white/5" />
            <div className="h-10 w-full rounded bg-white/5 sm:w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MessageCard({ title, text, children }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center transition-all duration-500 ease-out starting:translate-y-3 starting:opacity-0">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
      {children}
    </div>
  );
}

function EmptyGarage() {
  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] text-center shadow-2xl shadow-black/40 transition-all duration-500 ease-out starting:translate-y-3 starting:opacity-0">
      <div
        aria-hidden="true"
        className="relative h-40 overflow-hidden bg-gradient-to-b from-[#0a1230] via-[#2b2552] to-[#e0804a]/80 sm:h-48"
      >
        <svg
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-10 h-28 w-full sm:h-32"
        >
          <path
            fill="#1a1f45"
            d="M0 140 L100 60 L190 120 L300 30 L420 130 L540 70 L660 125 L800 50 L800 200 L0 200 Z"
          />
          <path
            fill="#0b1226"
            d="M0 170 L120 110 L230 160 L360 100 L500 165 L640 120 L800 170 L800 200 L0 200 Z"
          />
        </svg>

        <div className="absolute inset-x-0 bottom-0 h-10 bg-[#070b14]">
          <div className="ma-dashes absolute inset-x-0 top-1/2 h-[3px]" />
          <div className="ma-car absolute bottom-4 w-24 sm:w-28">
            <svg viewBox="0 0 120 40" className="h-auto w-full">
              <path
                d="M6 28 L6 22 Q6 19 10 18 L28 15 L38 7 Q40 5 44 5 L78 5 Q82 5 85 8 L92 15 L108 18 Q114 19 114 24 L114 28 Z"
                fill="#1f6fe0"
              />
              <path d="M42 7 L56 7 L56 15 L33 15 Z" fill="#cfe6ff" />
              <path d="M60 7 L78 7 L88 15 L60 15 Z" fill="#cfe6ff" />
              <rect
                x="108"
                y="20"
                width="6"
                height="3"
                rx="1.5"
                fill="#ffe08a"
              />
              <g transform="translate(30 29)">
                <g className="ma-wheel">
                  <circle r="8" fill="#05070d" />
                  <circle r="3.5" fill="#9fb0c8" />
                  <path d="M-8 0 H8" stroke="#05070d" strokeWidth="1.5" />
                </g>
              </g>
              <g transform="translate(92 29)">
                <g className="ma-wheel">
                  <circle r="8" fill="#05070d" />
                  <circle r="3.5" fill="#9fb0c8" />
                  <path d="M-8 0 H8" stroke="#05070d" strokeWidth="1.5" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="px-6 pb-10 pt-8">
        <h2 className="text-2xl font-bold">Your garage is empty</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400 sm:text-base">
          You haven’t added any cars yet. List your first car and start reaching
          renters.
        </p>
        <Link href="/add-car" className={`${buttonClass} mt-6`}>
          Add Your First Car
        </Link>
      </div>
    </div>
  );
}
