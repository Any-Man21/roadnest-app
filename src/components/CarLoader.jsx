import { Barlow } from "next/font/google";

const barlow = Barlow({ subsets: ["latin"], weight: ["500", "600"] });

/*
  Car drives in place, road scrolls under it.
  className sets the height. Default = full page under the navbar.
  Inline use: <CarLoader className="min-h-[40vh]" />
*/
export default function CarLoader({
  label = "Loading",
  className = "min-h-[calc(100vh-64px)]",
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`${barlow.className} relative isolate flex w-full flex-col items-center justify-center overflow-hidden bg-[#060b14] px-4 text-white ${className}`}
    >
      {/* soft background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-72 w-[28rem] max-w-[120vw] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[100px]"
      />

      {/* scene */}
      <div className="relative h-28 w-72 sm:w-96" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-[21px] flex justify-center">
          <div className="cl-bob relative w-28 sm:w-32">
            {/* speed lines */}
            <span className="absolute right-full top-[30%] mr-2 flex flex-col gap-1.5">
              <i className="cl-line block h-[2px] w-6 rounded bg-sky-300/60" />
              <i
                className="cl-line block h-[2px] w-4 rounded bg-sky-300/60"
                style={{ animationDelay: "0.15s" }}
              />
              <i
                className="cl-line block h-[2px] w-5 rounded bg-sky-300/60"
                style={{ animationDelay: "0.3s" }}
              />
            </span>

            <svg viewBox="0 0 120 40" className="block h-auto w-full">
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
                <g className="cl-wheel">
                  <circle r="8" fill="#05070d" />
                  <circle r="3.5" fill="#9fb0c8" />
                  <path d="M-8 0 H8" stroke="#05070d" strokeWidth="1.5" />
                </g>
              </g>
              <g transform="translate(92 29)">
                <g className="cl-wheel">
                  <circle r="8" fill="#05070d" />
                  <circle r="3.5" fill="#9fb0c8" />
                  <path d="M-8 0 H8" stroke="#05070d" strokeWidth="1.5" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* road */}
        <div className="absolute inset-x-0 bottom-0 h-6 overflow-hidden rounded-md bg-[#070b14] ring-1 ring-white/10">
          <div className="cl-dashes absolute inset-x-0 top-1/2 h-[3px]" />
        </div>
      </div>

      {/* label + dots */}
      <p className="mt-7 flex items-center gap-1.5 text-sm font-medium tracking-wide text-slate-300">
        {label}
        <span className="cl-dot" />
        <span className="cl-dot" style={{ animationDelay: "0.15s" }} />
        <span className="cl-dot" style={{ animationDelay: "0.3s" }} />
      </p>

      <style>{`
        .cl-bob {
          animation: cl-bob 0.45s ease-in-out infinite alternate;
        }
        .cl-wheel {
          transform-box: fill-box;
          transform-origin: center;
          animation: cl-spin 0.5s linear infinite;
        }
        .cl-dashes {
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.6) 0 28px,
            transparent 28px
          );
          background-size: 56px 100%;
          animation: cl-road 0.6s linear infinite;
        }
        .cl-line {
          animation: cl-line 0.7s linear infinite;
        }
        .cl-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: #38bdf8;
          animation: cl-jump 0.9s ease-in-out infinite;
        }
        @keyframes cl-bob {
          from { transform: translateY(0); }
          to { transform: translateY(-1.5px); }
        }
        @keyframes cl-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cl-road {
          to { background-position-x: -56px; }
        }
        @keyframes cl-line {
          from { opacity: 0.9; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-16px); }
        }
        @keyframes cl-jump {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-bob, .cl-wheel, .cl-dashes, .cl-line, .cl-dot { animation: none; }
        }
      `}</style>
    </div>
  );
}
