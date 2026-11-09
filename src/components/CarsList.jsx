"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { todayKey } from "@/lib/date";
import CarCard from "./CarCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CarsList({ cars }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  // "today" is read after mount, so server and browser HTML always match
  const [today, setToday] = useState("");
  const [mine, setMine] = useState({ userId: null, carIds: [] });

  useEffect(() => {
    setToday(todayKey());
  }, []);

  // cars this user has booked (not finished yet)
  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    fetch(`${API_URL}/bookings?userId=${encodeURIComponent(userId)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Bad response");
        return res.json();
      })
      .then((list) => {
        const now = todayKey();
        setMine({
          userId,
          carIds: list.filter((b) => b.endDate >= now).map((b) => b.carId),
        });
      })
      .catch(() => {
        // no tick if this fails. The cars still show.
      });

    return () => controller.abort();
  }, [userId]);

  // tagged with the user id, so another account never sees the previous user's ticks
  const mySet = new Set(mine.userId === userId ? mine.carIds : []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car, i) => {
        const bookedByMe = mySet.has(String(car._id));
        const bookedNow =
          Boolean(today) &&
          (car.bookedRanges || []).some(
            (r) => r.startDate <= today && today <= r.endDate,
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
