// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Barlow } from "next/font/google";
// import { Toaster } from "react-hot-toast";
// import { authClient } from "@/lib/auth-client";
// import { todayKey } from "@/lib/date";
// import Booked from "@/components/Booked";

// const barlow = Barlow({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// const buttonClass =
//   "inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50";

// export default function MyBookingsPage() {
//   const { data: session, isPending } = authClient.useSession();
//   const userId = session?.user?.id;

//   const [result, setResult] = useState({
//     userId: null,
//     bookings: [],
//     error: false,
//   });

//   useEffect(() => {
//     if (!userId) return;

//     const controller = new AbortController();

//     async function loadBookings() {
//       try {
//         const { data: tokenData, error: tokenError } = await authClient.token();

//         if (tokenError || !tokenData?.token) {
//           throw new Error("No token");
//         }

//         const res = await fetch(`${API_URL}/bookings`, {
//           cache: "no-store",
//           headers: {
//             Authorization: `Bearer ${tokenData.token}`,
//           },
//           signal: controller.signal,
//         });

//         if (!res.ok) throw new Error("Bad response");

//         const bookings = await res.json();

//         setResult({
//           userId,
//           bookings,
//           error: false,
//         });
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           setResult({
//             userId,
//             bookings: [],
//             error: true,
//           });
//         }
//       }
//     }

//     loadBookings();

//     return () => controller.abort();
//   }, [userId]);

//   // Booking cancelled: remove its ticket
//   const handleCancelled = (id) =>
//     setResult((r) => ({
//       ...r,
//       bookings: r.bookings.filter((b) => b._id !== id),
//     }));

//   // Ride rated: show the new rating on its ticket
//   const handleRated = (id, rating) =>
//     setResult((r) => ({
//       ...r,
//       bookings: r.bookings.map((b) => (b._id === id ? { ...b, rating } : b)),
//     }));

//   const waiting = isPending || (userId && result.userId !== userId);

//   const hasList =
//     !waiting && userId && !result.error && result.bookings.length > 0;

//   let content;
//   let summary = null;

//   if (waiting) {
//     content = <TicketSkeleton />;
//   } else if (!userId) {
//     content = (
//       <MessageCard
//         title="Log in to see your bookings"
//         text="Your bookings are private. Log in to view them."
//       >
//         <Link href="/login" className={`${buttonClass} mt-6`}>
//           Login
//         </Link>
//       </MessageCard>
//     );
//   } else if (result.error) {
//     content = (
//       <MessageCard
//         title="Couldn’t load your bookings"
//         text="We can’t reach the server right now. Check that your backend is running, then refresh the page."
//       />
//     );
//   } else if (result.bookings.length === 0) {
//     content = <EmptyBookings />;
//   } else {
//     const today = todayKey();

//     // NEWEST BOOKINGS ALWAYS APPEAR FIRST
//     const sorted = [...result.bookings].sort((a, b) => {
//       const dateA = Date.parse(a.createdAt || "");
//       const dateB = Date.parse(b.createdAt || "");

//       // Fallback to startDate if createdAt is unavailable
//       const timeA = Number.isFinite(dateA)
//         ? dateA
//         : Date.parse(`${a.startDate}T00:00:00`);

//       const timeB = Number.isFinite(dateB)
//         ? dateB
//         : Date.parse(`${b.startDate}T00:00:00`);

//       return timeB - timeA;
//     });

//     const done = sorted.filter((b) => b.endDate < today).length;

//     summary = `${sorted.length - done} active · ${done} completed`;

//     content = (
//       <div className="grid grid-cols-1 gap-6">
//         {sorted.map((booking, i) => (
//           <Booked
//             key={booking._id}
//             booking={booking}
//             index={i}
//             onCancelled={handleCancelled}
//             onRated={handleRated}
//           />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <>
//       <Toaster
//         position="top-center"
//         containerStyle={{ top: "42%" }}
//         toastOptions={{
//           style: {
//             background: "#0a1424",
//             color: "#fff",
//             border: "1px solid rgba(255,255,255,0.1)",
//             padding: "16px 24px",
//             fontSize: "1rem",
//             borderRadius: "14px",
//             boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
//           },
//         }}
//       />

//       <main
//         className={`${barlow.className} relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-[#060b14] px-4 py-10 text-white sm:px-6 sm:py-14`}
//       >
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[720px] max-w-[140vw] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]"
//         />

//         <div className="mx-auto w-full max-w-5xl">
//           <header className="flex flex-col gap-4 transition-all duration-700 ease-out starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//                 My{" "}
//                 <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
//                   Bookings
//                 </span>
//               </h1>

//               {summary && (
//                 <p className="mt-3 text-sm text-slate-400 sm:text-base">
//                   {summary}
//                 </p>
//               )}
//             </div>

//             {hasList && (
//               <Link href="/cars" className={`${buttonClass} w-full sm:w-auto`}>
//                 Book Another Car
//               </Link>
//             )}
//           </header>

//           <section className="mt-8 sm:mt-10">{content}</section>
//         </div>
//       </main>
//     </>
//   );
// }

// function TicketSkeleton() {
//   return (
//     <div className="grid grid-cols-1 gap-6">
//       {Array.from({ length: 2 }).map((_, i) => (
//         <div
//           key={i}
//           className="flex animate-pulse flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] md:flex-row"
//         >
//           <div className="aspect-[16/8] w-full bg-white/5 md:aspect-auto md:min-h-44 md:w-56 lg:w-64" />

//           <div className="flex-1 space-y-3 p-5">
//             <div className="h-5 w-1/2 rounded bg-white/10" />
//             <div className="h-4 w-1/3 rounded bg-white/5" />
//             <div className="h-12 w-full rounded bg-white/5" />
//           </div>

//           <div className="h-20 bg-white/[0.03] md:h-auto md:w-52" />
//         </div>
//       ))}
//     </div>
//   );
// }

// function MessageCard({ title, text, children }) {
//   return (
//     <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center transition-all duration-500 ease-out starting:translate-y-3 starting:opacity-0">
//       <h2 className="text-xl font-semibold">{title}</h2>
//       <p className="mt-2 text-sm text-slate-400">{text}</p>
//       {children}
//     </div>
//   );
// }

// function EmptyBookings() {
//   return (
//     <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center shadow-2xl shadow-black/40 transition-all duration-500 ease-out starting:translate-y-3 starting:opacity-0">
//       <div className="relative mx-auto mb-6 grid h-24 w-24 place-items-center">
//         <span className="absolute inset-0 animate-ping rounded-full bg-blue-500/10 motion-reduce:animate-none" />

//         <span className="relative grid h-20 w-20 place-items-center rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300">
//           <svg
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.6"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="h-9 w-9"
//             aria-hidden="true"
//           >
//             <path d="M5 16l1.6-5.2A2 2 0 0 1 8.5 9.4h7a2 2 0 0 1 1.9 1.4L19 16" />
//             <path d="M3 16h18v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
//           </svg>
//         </span>
//       </div>

//       <h2 className="text-2xl font-bold">No bookings yet</h2>

//       <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400 sm:text-base">
//         Your trips will show up here as tickets once you book a car.
//       </p>

//       <Link href="/cars" className={`${buttonClass} mt-6`}>
//         Explore Cars
//       </Link>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Barlow } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { todayKey } from "@/lib/date";
import Booked from "@/components/Booked";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50";

// a card that is no longer a live booking
const isDead = (b) => b.cancelledBy === "owner" || Boolean(b.carRemoved);

export default function MyBookingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  const [result, setResult] = useState({
    userId: null,
    bookings: [],
    error: false,
  });

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    async function loadBookings() {
      try {
        const { data: tokenData, error: tokenError } = await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("No token");
        }

        const headers = { Authorization: `Bearer ${tokenData.token}` };

        // live bookings + rides the owner cancelled (those cards stay on screen)
        const [bookingsRes, cancelledRes] = await Promise.all([
          fetch(`${API_URL}/bookings`, {
            cache: "no-store",
            headers,
            signal: controller.signal,
          }),
          fetch(`${API_URL}/cancelled-bookings`, {
            cache: "no-store",
            headers,
            signal: controller.signal,
          }),
        ]);

        if (!bookingsRes.ok) throw new Error("Bad response");

        const bookings = await bookingsRes.json();
        // if the notices fail to load, the real bookings still show
        const cancelled = cancelledRes.ok ? await cancelledRes.json() : [];

        setResult({
          userId,
          bookings: [...bookings, ...cancelled],
          error: false,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setResult({
            userId,
            bookings: [],
            error: true,
          });
        }
      }
    }

    loadBookings();

    return () => controller.abort();
  }, [userId]);

  // booking cancelled, or a "canceled by owner" / "car removed" card cleared: remove it
  const handleRemoved = (id) =>
    setResult((r) => ({
      ...r,
      bookings: r.bookings.filter((b) => b._id !== id),
    }));

  // Ride rated: show the new rating on its ticket
  const handleRated = (id, rating) =>
    setResult((r) => ({
      ...r,
      bookings: r.bookings.map((b) => (b._id === id ? { ...b, rating } : b)),
    }));

  const waiting = isPending || (userId && result.userId !== userId);

  const hasList =
    !waiting && userId && !result.error && result.bookings.length > 0;

  let content;
  let summary = null;

  if (waiting) {
    content = <TicketSkeleton />;
  } else if (!userId) {
    content = (
      <MessageCard
        title="Log in to see your bookings"
        text="Your bookings are private. Log in to view them."
      >
        <Link href="/login" className={`${buttonClass} mt-6`}>
          Login
        </Link>
      </MessageCard>
    );
  } else if (result.error) {
    content = (
      <MessageCard
        title="Couldn’t load your bookings"
        text="We can’t reach the server right now. Check that your backend is running, then refresh the page."
      />
    );
  } else if (result.bookings.length === 0) {
    content = <EmptyBookings />;
  } else {
    const today = todayKey();

    // NEWEST BOOKINGS ALWAYS APPEAR FIRST
    const sorted = [...result.bookings].sort((a, b) => {
      const dateA = Date.parse(a.createdAt || "");
      const dateB = Date.parse(b.createdAt || "");

      // Fallback to startDate if createdAt is unavailable
      const timeA = Number.isFinite(dateA)
        ? dateA
        : Date.parse(`${a.startDate}T00:00:00`);

      const timeB = Number.isFinite(dateB)
        ? dateB
        : Date.parse(`${b.startDate}T00:00:00`);

      return timeB - timeA;
    });

    const live = sorted.filter((b) => !isDead(b));
    const done = live.filter((b) => b.endDate < today).length;
    const stopped = sorted.length - live.length;

    summary = [
      `${live.length - done} active`,
      `${done} completed`,
      stopped > 0 ? `${stopped} cancelled` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    content = (
      <div className="grid grid-cols-1 gap-6">
        {sorted.map((booking, i) => (
          <Booked
            key={booking._id}
            booking={booking}
            index={i}
            onCancelled={handleRemoved}
            onRemoved={handleRemoved}
            onRated={handleRated}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ top: "42%" }}
        toastOptions={{
          style: {
            background: "#0a1424",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "16px 24px",
            fontSize: "1rem",
            borderRadius: "14px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          },
        }}
      />

      <main
        className={`${barlow.className} relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-[#060b14] px-4 py-10 text-white sm:px-6 sm:py-14`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[720px] max-w-[140vw] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]"
        />

        <div className="mx-auto w-full max-w-5xl">
          <header className="flex flex-col gap-4 transition-all duration-700 ease-out starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                My{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  Bookings
                </span>
              </h1>

              {summary && (
                <p className="mt-3 text-sm text-slate-400 sm:text-base">
                  {summary}
                </p>
              )}
            </div>

            {hasList && (
              <Link href="/cars" className={`${buttonClass} w-full sm:w-auto`}>
                Book Another Car
              </Link>
            )}
          </header>

          <section className="mt-8 sm:mt-10">{content}</section>
        </div>
      </main>
    </>
  );
}

function TicketSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] md:flex-row"
        >
          <div className="aspect-[16/8] w-full bg-white/5 md:aspect-auto md:min-h-44 md:w-56 lg:w-64" />

          <div className="flex-1 space-y-3 p-5">
            <div className="h-5 w-1/2 rounded bg-white/10" />
            <div className="h-4 w-1/3 rounded bg-white/5" />
            <div className="h-12 w-full rounded bg-white/5" />
          </div>

          <div className="h-20 bg-white/[0.03] md:h-auto md:w-52" />
        </div>
      ))}
    </div>
  );
}

function MessageCard({ title, text, children }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center transition-all duration-500 ease-out starting:translate-y-3 starting:opacity-0">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
      {children}
    </div>
  );
}

function EmptyBookings() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center shadow-2xl shadow-black/40 transition-all duration-500 ease-out starting:translate-y-3 starting:opacity-0">
      <div className="relative mx-auto mb-6 grid h-24 w-24 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-blue-500/10 motion-reduce:animate-none" />

        <span className="relative grid h-20 w-20 place-items-center rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-9 w-9"
            aria-hidden="true"
          >
            <path d="M5 16l1.6-5.2A2 2 0 0 1 8.5 9.4h7a2 2 0 0 1 1.9 1.4L19 16" />
            <path d="M3 16h18v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
          </svg>
        </span>
      </div>

      <h2 className="text-2xl font-bold">No bookings yet</h2>

      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400 sm:text-base">
        Your trips will show up here as tickets once you book a car.
      </p>

      <Link href="/cars" className={`${buttonClass} mt-6`}>
        Explore Cars
      </Link>
    </div>
  );
}
