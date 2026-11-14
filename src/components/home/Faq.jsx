"use client";

import { useState } from "react";
import Link from "next/link";
import { barlow } from "./fonts";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const FAQS = [
  {
    q: "How do I book a car?",
    a: "Open any car, pick up to 7 days on the calendar (the earliest pick-up is tomorrow), add an optional note and confirm. Booked days are blocked for everyone else.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes. You can cancel for free within 24 hours of booking, as long as the car has not been delivered yet. The dates open up again for others.",
  },
  {
    q: "What if the owner cancels my ride?",
    a: "Owners can cancel only within 5 hours of a booking. Your ticket will say “Ride canceled by owner”, the dates are freed, and you can book another car right away.",
  },
  {
    q: "How does delivery work?",
    a: "On pick-up day (or the day after) the owner taps Car Delivered, then you confirm Received? on your ticket. After the trip you can rate your ride from 1 to 5.",
  },
  {
    q: "How do I list my car and earn?",
    a: "Log in, open Add Car and fill in the details. RoadNest keeps a flat 10% of each completed order and the rest is yours. Track everything on the Orders page.",
  },
  {
    q: "What if a car is removed after I booked it?",
    a: "Your ticket will show “Car removed from service”. You can clear it from My Bookings and pick another car from the fleet.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section
      className={`${barlow.className} relative isolate overflow-hidden bg-[#060b14] px-4 py-16 text-white sm:px-6 sm:py-24`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-1/4 -z-10 h-80 w-80 rounded-full bg-blue-500/10 blur-[110px]"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Questions,"
            accent="answered"
            text="Everything you need to know before your first booking or your first listing."
          />

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-lg font-semibold">Still have questions?</p>
            <p className="mt-1 text-sm text-slate-400">
              Our team replies around the clock.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex h-11 items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50"
            >
              Contact us
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = open === i;

              return (
                <div
                  key={item.q}
                  className={`rounded-2xl border transition-colors duration-300 ${
                    isOpen
                      ? "border-blue-400/40 bg-blue-500/[0.06]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold sm:text-lg"
                    >
                      {item.q}
                      <span
                        aria-hidden="true"
                        className={`grid size-8 shrink-0 place-items-center rounded-full border text-lg transition-all duration-300 ${
                          isOpen
                            ? "rotate-45 border-blue-400/40 bg-blue-500/20 text-blue-300"
                            : "border-white/15"
                        }`}
                      >
                        +
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-7 text-slate-400 sm:text-base">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
