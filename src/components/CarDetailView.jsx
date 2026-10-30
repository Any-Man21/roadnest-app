"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Barlow } from "next/font/google";
import BookingCard from "./BookingCard";
import { Button } from "@heroui/react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { EditCarDetails } from "./EditCarDetails";
import { DeleteCar } from "./DeleteCar";

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
            <div className="flex justify-between">
              <div>
                <EditCarDetails car={car} key={car._id} />
              </div>
              <div>
                <DeleteCar car={car} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
