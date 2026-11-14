import { barlow } from "./fonts";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

// Placeholder reviews. Replace with real ones.
const REVIEWS = [
  {
    name: "Nabila Rahman",
    car: "Toyota Corolla",
    city: "Dhaka",
    rating: 5,
    text: "Booked in two minutes and the car arrived right on time. Clean, comfortable and exactly as described.",
  },
  {
    name: "Tanvir Ahmed",
    car: "BMW X5",
    city: "Chattogram",
    rating: 5,
    text: "The price I saw was the price I paid. No surprises, and the owner was super easy to deal with.",
  },
  {
    name: "Sadia Islam",
    car: "Honda Civic",
    city: "Dhaka",
    rating: 5,
    text: "Perfect for a weekend trip. The delivery confirmation made the handover feel safe and simple.",
  },
  {
    name: "Imran Hossain",
    car: "Mercedes C-Class",
    city: "Sylhet",
    rating: 4,
    text: "Great car and smooth booking. I would love even more pickup spots, but I will rent again.",
  },
  {
    name: "Farhana Akter",
    car: "Toyota Noah",
    city: "Dhaka",
    rating: 5,
    text: "Rented a van for a family event. Spacious, spotless and the support team answered in minutes.",
  },
  {
    name: "Rafiq Chowdhury",
    car: "Tesla Model 3",
    city: "Rajshahi",
    rating: 5,
    text: "Honestly the smoothest rental I have had. I now list my own car here too and it earns every week.",
  },
];

const BARS = [
  { stars: 5, pct: 88 },
  { stars: 4, pct: 9 },
  { stars: 3, pct: 2 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

const GRADIENTS = [
  "from-sky-400 to-blue-600",
  "from-violet-400 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-pink-400 to-rose-600",
  "from-cyan-400 to-blue-600",
];

const CSS = `
.rv-wrap{overflow:hidden}
.rv-track{display:flex;width:max-content;animation:rv-scroll 50s linear infinite}
.rv-wrap:hover .rv-track{animation-play-state:paused}
.rv-set{display:flex;gap:16px;padding-right:16px}
@keyframes rv-scroll{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.rv-wrap{overflow-x:auto}.rv-track{animation:none}}
`;

function Stars({ count, size = "size-4" }) {
  return (
    <span
      className="inline-flex gap-0.5 text-amber-400"
      aria-label={`${count} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 24 24"
          className={`${size} ${n <= count ? "" : "text-slate-600"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ review, index }) {
  const initials = review.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <figure className="flex w-[300px] shrink-0 flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:w-[340px]">
      <Stars count={review.rating} />

      <blockquote className="mt-4 flex-1 text-sm leading-7 text-slate-300">
        “{review.text}”
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} text-sm font-bold text-white`}
          aria-hidden="true"
        >
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">
            {review.name}
          </span>
          <span className="block truncate text-xs text-slate-400">
            {review.car} · {review.city}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  return (
    <section
      className={`${barlow.className} relative isolate overflow-hidden bg-[#060b14] py-16 text-white sm:py-24`}
    >
      <style>{CSS}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/4 -z-10 h-80 w-80 rounded-full bg-blue-500/10 blur-[110px]"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto]">
        <Reveal>
          <SectionHeading
            eyebrow="REVIEWS"
            title="Loved by renters,"
            accent="trusted by owners"
            text="Real trips, real people. Here is what our community says after the keys are back."
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 lg:w-[340px]">
            <div className="flex items-end gap-4">
              <p className="text-5xl font-extrabold leading-none">4.9</p>
              <div className="pb-1">
                <Stars count={5} size="size-5" />
                <p className="mt-1 text-xs text-slate-400">
                  out of 5 · renter rating
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {BARS.map((b) => (
                <li
                  key={b.stars}
                  className="flex items-center gap-3 text-xs text-slate-400"
                >
                  <span className="w-6 shrink-0">{b.stars}★</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                      style={{ width: `${b.pct}%` }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-right">{b.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* auto-scrolling reviews (pauses on hover) */}
      <div
        className="rv-wrap mt-12"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div className="rv-track">
          <div className="rv-set">
            {REVIEWS.map((r, i) => (
              <ReviewCard key={r.name} review={r} index={i} />
            ))}
          </div>
          <div className="rv-set" aria-hidden="true">
            {REVIEWS.map((r, i) => (
              <ReviewCard key={r.name} review={r} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
