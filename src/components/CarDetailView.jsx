

"use client";

import { useState } from "react";
import Link from "next/link";

import { Barlow } from "next/font/google";
import BookingCard from "./BookingCard";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SpecItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-slate-300 text-sm">
    <span className="text-blue-400">{icon}</span>
    <span>{text}</span>
  </div>
);

/* Who added the car. No owner = RoadNest "Company". */
function ListedBy({ car }) {
  const [failed, setFailed] = useState(false);
  const hasOwner = Boolean(car.ownerName);
  const name = hasOwner ? car.ownerName : "Company";

  return (
    <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-4">
      {hasOwner ? (
        car.ownerImage && !failed ? (
          <img
            src={car.ownerImage}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-9 w-9 shrink-0 rounded-full border border-white/15 object-cover"
          />
        ) : (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-semibold">
            {name.charAt(0).toUpperCase()}
          </span>
        )
      ) : (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-[#0b1626]">
          <svg viewBox="0 0 40 32" className="h-5 w-6" aria-hidden="true">
            <defs>
              <linearGradient id="ld-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#5ab0ff" />
                <stop offset="1" stopColor="#1f5fd6" />
              </linearGradient>
            </defs>
            <path
              d="M1 30 L13 7 Q20 -3 27 7 L39 30 L30.5 30 L23 14.5 Q20 10.5 17 14.5 L9.5 30 Z"
              fill="url(#ld-grad)"
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
      )}
      <span className="min-w-0 leading-tight">
        <span className="block text-[11px] uppercase tracking-wider text-slate-400">
          Listed by
        </span>
        <span className="block truncate text-sm font-semibold text-white">
          {name}
        </span>
      </span>
    </div>
  );
}

export default function CarDetailView({ car }) {
  const [activeImg, setActiveImg] = useState(car.imageUrl);
  const images = car.images || [
    car.imageUrl,
    car.imageUrl,
    car.imageUrl,
    car.imageUrl,
  ];

  return (
    <main
      className={`min-h-screen bg-[#05080f] text-white p-4 sm:p-8 lg:p-12 ${barlow.className}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Back to Explore
        </Link>

        {/* 
            The Grid: 
            - Mobile: Simple vertical stack (Gallery -> Booking -> Details)
            - Desktop: 12-column grid. Booking card moves to the right.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 1. TOP SECTION: Gallery & Specs (Stays on left) */}

          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={activeImg}
                  alt={car.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImg(img)}
                    className={`aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      activeImg === img
                        ? "border-blue-500 scale-95"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumb"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/10">
              <SpecItem icon="🚘" text={car.type || "SUV"} />
              <SpecItem icon="👥" text={`${car.seats || 5} Seats`} />
              <SpecItem icon="⚙️" text={car.transmission || "Automatic"} />
              <SpecItem icon="⛽" text={car.fuelType || "Diesel"} />
              <SpecItem icon="📍" text={car.location || "Dhaka"} />
              <SpecItem icon="⭐" text="4.9 Rating" />
            </div>
          </div>

          {/* 2. BOOKING CARD (Middle on mobile, Right on desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <BookingCard car={car} />
          </div>

          {/* 3. BOTTOM SECTION: Details (Below Booking on mobile, Left on desktop) */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">About the Vehicle</h2>
              <ListedBy car={car} />
              <p className="text-slate-400 leading-relaxed text-lg">
                {car.description ||
                  "This luxury vehicle combines state-of-the-art performance with unmatched comfort. Perfect for those who appreciate the finer things in life, whether it's a city cruise or a long-distance journey."}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Premium Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Air Conditioning",
                  "Bluetooth",
                  "Rear Camera",
                  "GPS Navigation",
                  "Leather Seats",
                  "Sunroof",
                ].map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5"
                  >
                    <span className="text-blue-400 text-lg">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
