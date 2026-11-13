"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { todayKey } from "@/lib/date";
import CarCard from "./CarCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CarsList({ cars }) {
  const { data: session } = authClient.useSession();

  const userId = session?.user?.id;

  const [today, setToday] = useState("");

  const [mine, setMine] = useState({
    userId: null,
    carIds: [],
  });

  // Read today's date after mounting
  useEffect(() => {
    setToday(todayKey());
  }, []);

  // Find cars booked by the logged-in user
  useEffect(() => {
    if (!userId) {
      setMine({
        userId: null,
        carIds: [],
      });

      return;
    }

    const controller = new AbortController();

    fetch(`${API_URL}/bookings?userId=${encodeURIComponent(userId)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        return res.json();
      })
      .then((list) => {
        const now = todayKey();

        setMine({
          userId,
          carIds: list
            .filter((booking) => booking.endDate >= now)
            .map((booking) => booking.carId),
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Booking fetch error:", error);
        }
      });

    return () => controller.abort();
  }, [userId]);

  // Prevent previous account's data from appearing
  const mySet = new Set(mine.userId === userId ? mine.carIds : []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car, i) => {
        const bookedByMe = mySet.has(String(car._id));

        const bookedNow =
          Boolean(today) &&
          (car.bookedRanges || []).some(
            (range) => range.startDate <= today && today <= range.endDate,
          );

        return (
          <CarCard
            key={car._id}
            car={car}
            index={i}
            bookedByMe={bookedByMe}
            bookedNow={bookedNow}
          />
        );
      })}
    </div>
  );
}
