"use client";

import { useEffect, useState } from "react";
import CarLoader from "@/components/CarLoader";

export default function SplashScreen() {
  const [phase, setPhase] = useState("show"); // show -> hide -> gone

  useEffect(() => {
    const a = setTimeout(() => setPhase("hide"), 450);
    const b = setTimeout(() => setPhase("gone"), 800);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden={phase !== "show"}
      className={`rn-splash fixed inset-0 z-[9999] bg-[#060b14] transition-opacity duration-300 ${
        phase === "hide" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <CarLoader className="min-h-screen" label="Loading RoadNest" />
      {/* safety net: hides itself after 4s even if JavaScript never runs */}
      <style>{`.rn-splash{animation:rn-splash-out 0s linear 4s forwards}@keyframes rn-splash-out{to{opacity:0;visibility:hidden;pointer-events:none}}`}</style>
    </div>
  );
}
