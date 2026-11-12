import Link from "next/link";
import { Barlow } from "next/font/google";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Page not found | RoadNest",
};

const gradientText =
  "bg-gradient-to-b from-sky-300 to-blue-600 bg-clip-text text-transparent";

export default function NotFound() {
  return (
    <main
      className={`${barlow.className} relative isolate flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden bg-[#060b14] px-4 pb-28 pt-10 text-center text-white sm:pb-32`}
    >
      {/* soft background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[720px] max-w-[140vw] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]"
      />

      {/* 4 [wheel] 4 */}
      <p
        role="img"
        aria-label="404"
        className="nf-rise flex items-center justify-center gap-1 text-[6.5rem] font-extrabold leading-none sm:gap-2 sm:text-[10rem]"
        style={{ "--d": "0.05s" }}
      >
        <span className={gradientText} aria-hidden="true">
          4
        </span>
        <svg
          viewBox="-50 -50 100 100"
          className="h-[0.78em] w-[0.78em]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="nf-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7cc4ff" />
              <stop offset="1" stopColor="#1f5fd6" />
            </linearGradient>
          </defs>
          <circle
            r="45"
            fill="#0b1626"
            stroke="url(#nf-ring)"
            strokeWidth="6"
          />
          <g className="nf-big">
            {[0, 72, 144, 216, 288].map((a) => (
              <rect
                key={a}
                x="-3"
                y="-34"
                width="6"
                height="24"
                rx="3"
                fill="#9fb0c8"
                transform={`rotate(${a})`}
              />
            ))}
            <circle r="9" fill="#cfe6ff" />
            <circle r="3.5" fill="#0b1626" />
          </g>
        </svg>
        <span className={gradientText} aria-hidden="true">
          4
        </span>
      </p>

      <h1
        className="nf-rise mt-4 text-2xl font-bold tracking-tight sm:text-4xl"
        style={{ "--d": "0.2s" }}
      >
        Wrong turn. Page not found.
      </h1>

      <p
        className="nf-rise mx-auto mt-3 max-w-md text-sm text-slate-400 sm:text-base"
        style={{ "--d": "0.3s" }}
      >
        The road you’re looking for doesn’t exist, or it moved somewhere else.
        Let’s get you back on track.
      </p>

      <div
        className="nf-rise mt-8 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row"
        style={{ "--d": "0.4s" }}
      >
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50"
        >
          Back to Home
        </Link>
        <Link
          href="/cars"
          className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
        >
          Explore Cars
        </Link>
      </div>

      {/* road + driving car */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-16 overflow-hidden bg-[#070b14] sm:h-20"
      >
        <div className="nf-dashes absolute inset-x-0 top-1/2 h-[3px]" />
        <div className="nf-drive absolute bottom-3 left-0 w-28 sm:bottom-4 sm:w-36">
          <svg viewBox="0 0 120 40" className="block h-auto w-full">
            <path
              d="M6 28 L6 22 Q6 19 10 18 L28 15 L38 7 Q40 5 44 5 L78 5 Q82 5 85 8 L92 15 L108 18 Q114 19 114 24 L114 28 Z"
              fill="#1f6fe0"
            />
            <path d="M42 7 L56 7 L56 15 L33 15 Z" fill="#cfe6ff" />
            <path d="M60 7 L78 7 L88 15 L60 15 Z" fill="#cfe6ff" />
            <rect x="108" y="20" width="6" height="3" rx="1.5" fill="#ffe08a" />
            <g transform="translate(30 29)">
              <g className="nf-wheel">
                <circle r="8" fill="#05070d" />
                <circle r="3.5" fill="#9fb0c8" />
                <path d="M-8 0 H8" stroke="#05070d" strokeWidth="1.5" />
              </g>
            </g>
            <g transform="translate(92 29)">
              <g className="nf-wheel">
                <circle r="8" fill="#05070d" />
                <circle r="3.5" fill="#9fb0c8" />
                <path d="M-8 0 H8" stroke="#05070d" strokeWidth="1.5" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      <style>{`
        .nf-rise {
          animation: nf-rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) var(--d, 0s) both;
        }
        .nf-big {
          transform-box: fill-box;
          transform-origin: center;
          animation: nf-spin 8s linear infinite;
        }
        .nf-wheel {
          transform-box: fill-box;
          transform-origin: center;
          animation: nf-spin 0.5s linear infinite;
        }
        .nf-drive {
          animation: nf-drive 9s linear infinite;
        }
        .nf-dashes {
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.6) 0 40px,
            transparent 40px
          );
          background-size: 80px 100%;
          animation: nf-road 1s linear infinite;
        }
        @keyframes nf-rise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes nf-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes nf-drive {
          from { transform: translateX(-30vw); }
          to { transform: translateX(110vw); }
        }
        @keyframes nf-road {
          to { background-position-x: -80px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-rise, .nf-big, .nf-wheel, .nf-drive, .nf-dashes { animation: none; }
        }
      `}</style>
    </main>
  );
}
