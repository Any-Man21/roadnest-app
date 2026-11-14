import { barlow, caveat } from "./fonts";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

// Placeholder founder. Change the name, story and photo.
// Set `image` to a photo URL to replace the initials.
const FOUNDER = {
  name: "Any man",
  role: "Founder & CEO",
  initials: "AM",
  image: "",
  signature: "Any Man",
  quote:
    "A car should never sit idle while someone is searching for a ride they can trust.",
  story: [
    "RoadNest started with a simple observation: most cars are parked more than they are driven, while people keep looking for a rental that is fair, clear and safe.",
    "So we built a place where owners earn from their cars, renters know exactly what they pay, and every handover is confirmed by both sides. No hidden fees, no guesswork.",
  ],
  facts: [
    "📍 Built in Dhaka",
    "🤝 Owners and renters first",
    "🔒 Secure bookings",
  ],
};

export default function Founder() {
  return (
    <section
      className={`${barlow.className} relative isolate overflow-hidden bg-[#05080f] px-4 py-16 text-white sm:px-6 sm:py-24`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-0 -z-10 h-80 w-80 rounded-full bg-blue-600/10 blur-[110px]"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <div className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden="true"
              className="absolute -inset-3 -z-10 rounded-[2.4rem] bg-gradient-to-br from-blue-500/30 to-transparent blur-2xl"
            />

            <div className="rounded-[2rem] bg-gradient-to-br from-blue-400/50 via-white/10 to-transparent p-px">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#0b1626]">
                {FOUNDER.image ? (
                  <img
                    src={FOUNDER.image}
                    alt={FOUNDER.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#122a52] via-[#0b1626] to-[#060b14]">
                    <span className="bg-gradient-to-br from-sky-300 to-blue-600 bg-clip-text text-8xl font-extrabold text-transparent">
                      {FOUNDER.initials}
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-lg font-bold">{FOUNDER.name}</p>
                  <p className="text-sm text-blue-300">{FOUNDER.role}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            eyebrow="ABOUT THE FOUNDER"
            title="The idea behind"
            accent="RoadNest"
          />

          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300 sm:text-base">
            {FOUNDER.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <blockquote className="mt-7 border-l-2 border-blue-400/60 pl-5">
            <p className="text-lg font-medium leading-8 text-white">
              “{FOUNDER.quote}”
            </p>
            <p className={`${caveat.className} mt-2 text-3xl text-blue-400`}>
              {FOUNDER.signature}
            </p>
          </blockquote>

          <ul className="mt-7 flex flex-wrap gap-2.5">
            {FOUNDER.facts.map((fact) => (
              <li
                key={fact}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-200"
              >
                {fact}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
