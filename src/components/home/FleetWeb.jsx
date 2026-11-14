import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { barlow } from "./fonts";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getFleet() {
  try {
    const res = await fetch(`${API_URL}/cars?limit=8`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error("Bad response");

    const cars = await res.json();
    return Array.isArray(cars) ? cars.slice(0, 8) : [];
  } catch {
    return [];
  }
}

/* ---------- web geometry (viewBox 0 0 100 100) ---------- */
const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
};
const f2 = (n) => n.toFixed(2);

const RINGS = [10, 18, 26, 34, 42].map((r) =>
  Array.from({ length: 8 }, (_, i) =>
    pt(r, i * 45 - 90)
      .map(f2)
      .join(","),
  ).join(" "),
);

const SPOKES = Array.from({ length: 8 }, (_, i) => pt(46, i * 45 - 90).map(f2));

const SPIRAL = (() => {
  let d = "";
  for (let i = 0; i <= 160; i++) {
    const t = i / 160;
    const [x, y] = pt(4 + t * 40, t * 1440 - 90);
    d += `${i ? "L" : "M"}${f2(x)} ${f2(y)} `;
  }
  return d;
})();

const CSS = `
.web-spin{animation:web-rot 80s linear infinite}
.web:hover .web-spin,.web:hover .web-node-inner,.web:focus-within .web-spin,.web:focus-within .web-node-inner{animation-play-state:paused}
.web-spiral{animation:web-dash 6s linear infinite}
.web-pulse{animation:web-pulse 2.8s ease-out infinite}
.web-node{position:absolute;display:block;width:14%;aspect-ratio:1;margin:-7% 0 0 -7%;z-index:2;outline:none}
.web-node:hover,.web-node:focus-visible{z-index:6}
.web-node-inner{position:absolute;inset:0;display:block;animation:web-rot-rev 80s linear infinite}
.web-img{display:grid;place-items:center;width:100%;height:100%;overflow:hidden;border-radius:9999px;border:2px solid rgba(90,176,255,.7);background:#122036;box-shadow:0 8px 24px rgba(0,0,0,.45);transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;font-size:1.3rem}
.web-img img{width:100%;height:100%;object-fit:cover}
.web-node:hover .web-img,.web-node:focus-visible .web-img{transform:scale(1.18);border-color:#9ad0ff;box-shadow:0 0 0 4px rgba(58,160,255,.25),0 12px 30px rgba(47,139,255,.45)}
.web-tip{position:absolute;left:50%;display:block;max-width:180px;padding:7px 11px;border-radius:12px;background:#0b1224;border:1px solid rgba(255,255,255,.14);box-shadow:0 14px 34px rgba(0,0,0,.55);white-space:nowrap;opacity:0;pointer-events:none;transform:translateX(-50%) translateY(4px);transition:opacity .2s ease,transform .2s ease}
.web-tip.down{top:calc(100% + 10px)}
.web-tip.up{bottom:calc(100% + 10px)}
.web-tip b{display:block;overflow:hidden;text-overflow:ellipsis;font-size:.78rem;font-weight:700;color:#fff}
.web-tip i{display:block;font-style:normal;font-size:.72rem;color:#67b5ff}
.web-node:hover .web-tip,.web-node:focus-visible .web-tip{opacity:1;transform:translateX(-50%) translateY(0)}
@keyframes web-rot{to{transform:rotate(360deg)}}
@keyframes web-rot-rev{to{transform:rotate(-360deg)}}
@keyframes web-dash{to{stroke-dashoffset:-30}}
@keyframes web-pulse{0%{transform:scale(.9);opacity:.6}100%{transform:scale(1.45);opacity:0}}
@media (prefers-reduced-motion:reduce){.web-spin,.web-node-inner,.web-spiral,.web-pulse{animation:none}}
`;

function Web({ cars }) {
  const n = cars.length;

  return (
    <div className="web relative mx-auto aspect-square w-[min(92vw,720px)]">
      <div className="web-spin absolute inset-0">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="web-glow">
              <stop offset="0" stopColor="#3aa0ff" stopOpacity="0.16" />
              <stop offset="1" stopColor="#3aa0ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="web-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5cb4ff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#5cb4ff" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="48" fill="url(#web-glow)" />

          {SPOKES.map(([x, y], i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke="url(#web-line)"
              strokeWidth="0.25"
            />
          ))}

          {RINGS.map((points, i) => (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="#3aa0ff"
              strokeOpacity={0.14 + i * 0.04}
              strokeWidth="0.25"
            />
          ))}

          <path
            d={SPIRAL}
            className="web-spiral"
            fill="none"
            stroke="#5cb4ff"
            strokeOpacity="0.55"
            strokeWidth="0.3"
            strokeDasharray="1.2 1.8"
          />
        </svg>

        {cars.map((car, i) => {
          const angle = (i * 360) / n - 90;
          const r = 20 + (n > 1 ? (i / (n - 1)) * 21 : 0);
          const [x, y] = pt(r, angle);
          const lowerHalf = y > 50;
          const price = Number(car.pricePerDay || 0).toLocaleString("en-US");

          return (
            <Link
              key={car._id}
              href={`/cars/${car._id}`}
              className="web-node"
              style={{ left: `${f2(x)}%`, top: `${f2(y)}%` }}
              aria-label={`${car.name}, $${price} per day`}
            >
              <span className="web-node-inner">
                <span className="web-img">
                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    "🚘"
                  )}
                </span>

                <span className={`web-tip ${lowerHalf ? "up" : "down"}`}>
                  <b>{car.name}</b>
                  <i>${price}/day</i>
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* hub (does not spin) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 grid size-[18%] -translate-x-1/2 -translate-y-1/2 place-items-center"
      >
        <span className="web-pulse absolute inset-0 rounded-full border border-blue-400/40" />
        <span className="relative grid size-full place-items-center rounded-full border border-blue-400/40 bg-[#0b1626] shadow-lg shadow-blue-500/20">
          <svg viewBox="0 0 40 32" className="h-[40%] w-[55%]">
            <defs>
              <linearGradient id="hub-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#5ab0ff" />
                <stop offset="1" stopColor="#1f5fd6" />
              </linearGradient>
            </defs>
            <path
              d="M1 30 L13 7 Q20 -3 27 7 L39 30 L30.5 30 L23 14.5 Q20 10.5 17 14.5 L9.5 30 Z"
              fill="url(#hub-grad)"
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
        </span>
      </div>
    </div>
  );
}

function WebSkeleton() {
  return (
    <div className="mx-auto aspect-square w-[min(92vw,720px)] animate-pulse rounded-full border border-white/10 bg-white/[0.03]" />
  );
}

function EmptyFleet() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
      <p className="text-4xl">🚘</p>
      <h3 className="mt-3 text-xl font-semibold">No cars to show yet</h3>
      <p className="mt-2 text-sm text-slate-400">
        The fleet is empty, or the server is not reachable right now.
      </p>
      <Link
        href="/add-car"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30"
      >
        List a car
      </Link>
    </div>
  );
}

async function WebData() {
  await connection(); // always fetch fresh, never at build time
  const cars = await getFleet();

  if (cars.length === 0) return <EmptyFleet />;
  return <Web cars={cars} />;
}

const primaryBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50";
const ghostBtn =
  "inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10";

export default function FleetSection() {
  return (
    <section
      className={`${barlow.className} relative isolate overflow-hidden bg-[#05080f] px-4 py-16 text-white sm:px-6 sm:py-24`}
    >
      <style>{CSS}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
        <Reveal>
          <SectionHeading
            eyebrow="THE FLEET"
            title="Spin the web,"
            accent="pick your ride"
            text="Eight cars from our latest listings, orbiting one spot. Hover to pause the web, then tap any car to see its details and book it."
          />

          <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
            <Link href="/cars" className={primaryBtn}>
              See more cars <span aria-hidden="true">→</span>
            </Link>
            <Link href="/add-car" className={ghostBtn}>
              List your car
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <Suspense fallback={<WebSkeleton />}>
            <WebData />
          </Suspense>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:hidden">
            <Link href="/cars" className={primaryBtn}>
              See more cars <span aria-hidden="true">→</span>
            </Link>
            <Link href="/add-car" className={ghostBtn}>
              List your car
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
