"use client";

import { useEffect, useRef, useState } from "react";
import { barlow } from "./fonts";
import Reveal from "./Reveal";

// The count is 2005 at this moment, then +2 for every full hour after it.
// Change START to your real launch time.
const START = Date.UTC(2026, 10, 14, 0, 0, 0);
const BASE = 2005;
const STEP = 2;
const HOUR = 3600000;

const countAt = (now) =>
  BASE + STEP * Math.max(0, Math.floor((now - START) / HOUR));

const minsToNext = (now) => {
  const into = (((now - START) % HOUR) + HOUR) % HOUR;
  return Math.max(1, Math.ceil((HOUR - into) / 60000));
};

const OTHERS = [
  {
    icon: "⭐",
    value: "4.9/5",
    label: "Average rating",
    note: "From verified renters",
  },
  {
    icon: "🛟",
    value: "24/7",
    label: "Customer support",
    note: "Always one message away",
  },
  {
    icon: "💸",
    value: "90%",
    label: "Goes to car owners",
    note: "Flat 10% platform fee",
  },
];

export default function Stats() {
  const ref = useRef(null);
  const animated = useRef(false);
  const shownRef = useRef(BASE);

  const [inView, setInView] = useState(false);
  const [target, setTarget] = useState(null);
  const [mins, setMins] = useState(null);
  const [shown, setShown] = useState(BASE); // server and first render both show 2,005

  // read the real count after mount, then refresh every 30 seconds
  useEffect(() => {
    const update = () => {
      const now = Date.now();
      setTarget(countAt(now));
      setMins(minsToNext(now));
    };

    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  // start counting when the section scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // count-up animation
  useEffect(() => {
    if (!inView || target == null) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      shownRef.current = target;
      setShown(target);
      return;
    }

    const from = animated.current ? shownRef.current : 0;
    const dur = animated.current ? 600 : 1600;
    animated.current = true;

    const t0 = performance.now();
    let raf;

    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(from + (target - from) * eased);

      shownRef.current = value;
      setShown(value);

      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <section
      ref={ref}
      className={`${barlow.className} relative isolate overflow-hidden bg-[#060b14] px-4 py-14 text-white sm:px-6 sm:py-20`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[640px] max-w-[140vw] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[110px]"
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Live orders counter */}
        <Reveal className="col-span-2 lg:col-span-1">
          <div className="relative h-full overflow-hidden rounded-3xl border border-blue-400/30 bg-gradient-to-br from-blue-500/15 to-white/[0.03] p-6 shadow-xl shadow-blue-500/10">
            <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-emerald-300">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              LIVE
            </span>

            <p className="text-3xl">🏁</p>

            <p className="mt-4 bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-4xl font-extrabold tabular-nums text-transparent sm:text-5xl">
              {shown.toLocaleString("en-US")}
            </p>

            <p className="mt-1 text-sm font-semibold">Orders completed</p>
            <p className="mt-1 text-xs text-slate-400">
              +2 every hour{mins ? ` · next in ${mins} min` : ""}
            </p>
          </div>
        </Reveal>

        {OTHERS.map((s, i) => (
          <Reveal key={s.label} delay={(i + 1) * 100}>
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition-colors duration-300 hover:border-blue-400/30 hover:bg-white/[0.07] sm:p-6">
              <p className="text-3xl">{s.icon}</p>
              <p className="mt-4 text-3xl font-extrabold sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm font-semibold">{s.label}</p>
              <p className="mt-1 text-xs text-slate-400">{s.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
