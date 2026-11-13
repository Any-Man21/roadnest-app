// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Barlow } from "next/font/google";
// import { Toaster } from "react-hot-toast";
// import { authClient } from "@/lib/auth-client";
// import { todayKey } from "@/lib/date";
// import Order from "@/components/Order";

// const barlow = Barlow({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// const buttonClass =
//   "inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50";

// const usd = (n) =>
//   `$${Number(n || 0).toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const isCompleted = (order, today) =>
//   order.status === "completed" || order.endDate < today;

// export default function OrdersPage() {
//   const { data: session, isPending } = authClient.useSession();
//   const userId = session?.user?.id;

//   // Result is tagged with the user it belongs to, so one user's orders
//   // can never flash on screen for another user.
//   const [result, setResult] = useState({
//     ownerId: null,
//     orders: [],
//     error: false,
//   });

//   useEffect(() => {
//     if (!userId) return;

//     const controller = new AbortController();

//     async function fetchOrders() {
//       try {
//         // Get JWT from Better Auth
//         const { data, error } = await authClient.token();

//         if (error || !data?.token) {
//           throw new Error("Failed to obtain authentication token");
//         }

//         // Send JWT to Express backend
//         const res = await fetch(`${API_URL}/orders`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${data.token}`,
//           },
//           cache: "no-store",
//           signal: controller.signal,
//         });

//         if (!res.ok) {
//           throw new Error("Failed to fetch your orders");
//         }

//         const orders = await res.json();

//         setResult({
//           ownerId: userId,
//           orders,
//           error: false,
//         });
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           console.error("Orders fetch error:", err);

//           setResult({
//             ownerId: userId,
//             orders: [],
//             error: true,
//           });
//         }
//       }
//     }

//     fetchOrders();

//     return () => controller.abort();
//   }, [userId]);

//   // "Car Delivered" pressed: show it on the card right away
//   const handleDelivered = (id, deliveredAt) =>
//     setResult((r) => ({
//       ...r,
//       orders: r.orders.map((o) =>
//         o._id === id
//           ? { ...o, deliveredAt: deliveredAt || new Date().toISOString() }
//           : o,
//       ),
//     }));

//   const waiting = isPending || (userId && result.ownerId !== userId);
//   const hasList =
//     !waiting && userId && !result.error && result.orders.length > 0;

//   let content;
//   let stats = null;

//   if (waiting) {
//     content = <OrderSkeleton />;
//   } else if (!userId) {
//     content = (
//       <MessageCard
//         title="Log in to see your orders"
//         text="Orders from people renting your cars are private. Log in to view them."
//       >
//         <Link href="/login" className={`${buttonClass} mt-6`}>
//           Login
//         </Link>
//       </MessageCard>
//     );
//   } else if (result.error) {
//     content = (
//       <MessageCard
//         title="Couldn’t load your orders"
//         text="We can’t reach the server right now. Check that your backend is running, then refresh the page."
//       />
//     );
//   } else if (result.orders.length === 0) {
//     content = <EmptyOrders />;
//   } else {
//     const today = todayKey();

//     // new and running orders first, finished orders last
//     const sorted = [...result.orders].sort((a, b) => {
//       const aDone = isCompleted(a, today);
//       const bDone = isCompleted(b, today);
//       if (aDone !== bDone) return aDone ? 1 : -1;
//       return aDone
//         ? b.startDate.localeCompare(a.startDate)
//         : a.startDate.localeCompare(b.startDate);
//     });

//     let earned = 0;
//     let pending = 0;
//     for (const o of sorted) {
//       const amount = Number(o.ownerEarning) || 0;
//       if (isCompleted(o, today)) earned += amount;
//       else pending += amount;
//     }
//     stats = {
//       count: sorted.length,
//       earned: Math.round(earned * 100) / 100,
//       pending: Math.round(pending * 100) / 100,
//     };

//     content = (
//       <div className="grid grid-cols-1 gap-6">
//         {sorted.map((order, i) => (
//           <Order
//             key={order._id}
//             order={order}
//             index={i}
//             onDelivered={handleDelivered}
//           />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Outside <main> so the navbar can't cover it. Centered pop-up. */}
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
//         {/* soft background glow */}
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
//                   Orders
//                 </span>
//               </h1>
//               <p className="mt-3 text-sm text-slate-400 sm:text-base">
//                 People renting your cars. The platform keeps 10% of each order.
//               </p>
//             </div>

//             {hasList && (
//               <Link
//                 href="/add-car"
//                 className={`${buttonClass} w-full sm:w-auto`}
//               >
//                 + Add Car
//               </Link>
//             )}
//           </header>

//           {stats && (
//             <div className="mt-6 grid grid-cols-3 gap-3 transition-all duration-500 ease-out starting:translate-y-3 starting:opacity-0">
//               <StatTile label="Orders" value={String(stats.count)} />
//               <StatTile label="Pending" value={usd(stats.pending)} />
//               <StatTile label="Total earned" value={usd(stats.earned)} accent />
//             </div>
//           )}

//           <section className="mt-8 sm:mt-10">{content}</section>
//         </div>
//       </main>
//     </>
//   );
// }

// function StatTile({ label, value, accent = false }) {
//   return (
//     <div
//       className={`min-w-0 rounded-2xl border px-3 py-3 sm:px-5 sm:py-4 ${
//         accent
//           ? "border-emerald-400/30 bg-emerald-500/10"
//           : "border-white/10 bg-white/[0.04]"
//       }`}
//     >
//       <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
//         {label}
//       </p>
//       <p
//         className={`mt-1 truncate text-lg font-bold sm:text-2xl ${
//           accent ? "text-emerald-400" : "text-white"
//         }`}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// function OrderSkeleton() {
//   return (
//     <div className="grid grid-cols-1 gap-6">
//       {Array.from({ length: 2 }).map((_, i) => (
//         <div
//           key={i}
//           className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
//         >
//           <div className="flex items-center gap-4 p-5">
//             <div className="h-20 w-32 rounded-xl bg-white/5" />
//             <div className="flex-1 space-y-3">
//               <div className="h-5 w-1/2 rounded bg-white/10" />
//               <div className="h-4 w-1/3 rounded bg-white/5" />
//             </div>
//           </div>
//           <div className="mx-5 mb-5 h-24 rounded-xl bg-white/5" />
//           <div className="h-20 bg-white/[0.03]" />
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

// function EmptyOrders() {
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
//             <path d="M6 7h12l1 13H5L6 7z" />
//             <path d="M9 7a3 3 0 0 1 6 0" />
//           </svg>
//         </span>
//       </div>

//       <h2 className="text-2xl font-bold">No orders yet</h2>
//       <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400 sm:text-base">
//         When someone books one of your cars, the order shows up here.
//       </p>
//       <Link href="/add-car" className={`${buttonClass} mt-6`}>
//         Add a Car
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
import Order from "@/components/Order";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50";

const usd = (n) =>
  `$${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const isCompleted = (order, today) =>
  order.status === "completed" || order.endDate < today;

export default function OrdersPage() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  // Result is tagged with the user it belongs to, so one user's orders
  // can never flash on screen for another user.
  const [result, setResult] = useState({
    ownerId: null,
    orders: [],
    error: false,
  });

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    async function fetchOrders() {
      try {
        // Get JWT from Better Auth
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          throw new Error("Failed to obtain authentication token");
        }

        // Send JWT to Express backend
        const res = await fetch(`${API_URL}/orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to fetch your orders");
        }

        const orders = await res.json();

        setResult({
          ownerId: userId,
          orders,
          error: false,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Orders fetch error:", err);

          setResult({
            ownerId: userId,
            orders: [],
            error: true,
          });
        }
      }
    }

    fetchOrders();

    return () => controller.abort();
  }, [userId]);

  // "Car Delivered" pressed: show it on the card right away
  const handleDelivered = (id, deliveredAt) =>
    setResult((r) => ({
      ...r,
      orders: r.orders.map((o) =>
        o._id === id
          ? { ...o, deliveredAt: deliveredAt || new Date().toISOString() }
          : o,
      ),
    }));

  // ride cancelled by the owner: the order disappears
  const handleCancelled = (id) =>
    setResult((r) => ({
      ...r,
      orders: r.orders.filter((o) => o._id !== id),
    }));

  const waiting = isPending || (userId && result.ownerId !== userId);
  const hasList =
    !waiting && userId && !result.error && result.orders.length > 0;

  let content;
  let stats = null;

  if (waiting) {
    content = <OrderSkeleton />;
  } else if (!userId) {
    content = (
      <MessageCard
        title="Log in to see your orders"
        text="Orders from people renting your cars are private. Log in to view them."
      >
        <Link href="/login" className={`${buttonClass} mt-6`}>
          Login
        </Link>
      </MessageCard>
    );
  } else if (result.error) {
    content = (
      <MessageCard
        title="Couldn’t load your orders"
        text="We can’t reach the server right now. Check that your backend is running, then refresh the page."
      />
    );
  } else if (result.orders.length === 0) {
    content = <EmptyOrders />;
  } else {
    const today = todayKey();

    // new and running orders first, finished orders last
    const sorted = [...result.orders].sort((a, b) => {
      const aDone = isCompleted(a, today);
      const bDone = isCompleted(b, today);
      if (aDone !== bDone) return aDone ? 1 : -1;
      return aDone
        ? b.startDate.localeCompare(a.startDate)
        : a.startDate.localeCompare(b.startDate);
    });

    let earned = 0;
    let pending = 0;
    for (const o of sorted) {
      const amount = Number(o.ownerEarning) || 0;
      if (isCompleted(o, today)) earned += amount;
      else pending += amount;
    }
    stats = {
      count: sorted.length,
      earned: Math.round(earned * 100) / 100,
      pending: Math.round(pending * 100) / 100,
    };

    content = (
      <div className="grid grid-cols-1 gap-6">
        {sorted.map((order, i) => (
          <Order
            key={order._id}
            order={order}
            index={i}
            onDelivered={handleDelivered}
            onCancelled={handleCancelled}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Outside <main> so the navbar can't cover it. Centered pop-up. */}
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
        {/* soft background glow */}
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
                  Orders
                </span>
              </h1>
              <p className="mt-3 text-sm text-slate-400 sm:text-base">
                People renting your cars. The platform keeps 10% of each order.
              </p>
            </div>

            {hasList && (
              <Link
                href="/add-car"
                className={`${buttonClass} w-full sm:w-auto`}
              >
                + Add Car
              </Link>
            )}
          </header>

          {stats && (
            <div className="mt-6 grid grid-cols-3 gap-3 transition-all duration-500 ease-out starting:translate-y-3 starting:opacity-0">
              <StatTile label="Orders" value={String(stats.count)} />
              <StatTile label="Pending" value={usd(stats.pending)} />
              <StatTile label="Total earned" value={usd(stats.earned)} accent />
            </div>
          )}

          <section className="mt-8 sm:mt-10">{content}</section>
        </div>
      </main>
    </>
  );
}

function StatTile({ label, value, accent = false }) {
  return (
    <div
      className={`min-w-0 rounded-2xl border px-3 py-3 sm:px-5 sm:py-4 ${
        accent
          ? "border-emerald-400/30 bg-emerald-500/10"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
        {label}
      </p>
      <p
        className={`mt-1 truncate text-lg font-bold sm:text-2xl ${
          accent ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
        >
          <div className="flex items-center gap-4 p-5">
            <div className="h-20 w-32 rounded-xl bg-white/5" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-1/2 rounded bg-white/10" />
              <div className="h-4 w-1/3 rounded bg-white/5" />
            </div>
          </div>
          <div className="mx-5 mb-5 h-24 rounded-xl bg-white/5" />
          <div className="h-20 bg-white/[0.03]" />
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

function EmptyOrders() {
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
            <path d="M6 7h12l1 13H5L6 7z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
        </span>
      </div>

      <h2 className="text-2xl font-bold">No orders yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400 sm:text-base">
        When someone books one of your cars, the order shows up here.
      </p>
      <Link href="/add-car" className={`${buttonClass} mt-6`}>
        Add a Car
      </Link>
    </div>
  );
}
