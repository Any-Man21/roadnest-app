// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { authClient } from "@/lib/auth-client";
// import toast from "react-hot-toast";
// import {
//   deliveryWindow,
//   diffDays,
//   formatRange,
//   formatShort,
//   todayKey,
// } from "@/lib/date";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// const STATE = {
//   new: {
//     label: "New order",
//     dot: "bg-sky-400",
//     text: "text-sky-300",
//     top: "border-t-sky-400",
//     pulse: false,
//   },
//   ongoing: {
//     label: "In progress",
//     dot: "bg-emerald-400",
//     text: "text-emerald-300",
//     top: "border-t-emerald-400",
//     pulse: true,
//   },
//   completed: {
//     label: "Completed",
//     dot: "bg-violet-400",
//     text: "text-violet-300",
//     top: "border-t-violet-400",
//     pulse: false,
//   },
// };

// const usd = (n) =>
//   `$${Number(n || 0).toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// function CheckIcon({ className = "h-3.5 w-3.5" }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="3"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//       aria-hidden="true"
//     >
//       <path d="M5 12.5l4.5 4.5L19 7.5" />
//     </svg>
//   );
// }

// function Avatar({ src, name }) {
//   const [failed, setFailed] = useState(false);

//   if (src && !failed) {
//     return (
//       // eslint-disable-next-line @next/next/no-img-element
//       <img
//         src={src}
//         alt=""
//         referrerPolicy="no-referrer"
//         onError={() => setFailed(true)}
//         className="h-10 w-10 shrink-0 rounded-full border border-white/15 object-cover"
//       />
//     );
//   }

//   return (
//     <span
//       className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-semibold text-white"
//       aria-hidden="true"
//     >
//       {(name || "?").charAt(0).toUpperCase()}
//     </span>
//   );
// }

// export default function Order({ order, ownerId, index = 0, onDelivered }) {
//   const {
//     _id,
//     carId,
//     carName,
//     carImage,
//     carType,
//     carLocation,
//     startDate,
//     endDate,
//     days,
//     totalPrice,
//     platformFee,
//     ownerEarning,
//     commissionRate,
//     driverNeeded,
//     specialNote,
//     userName,
//     userEmail,
//     userImage,
//     status,
//     deliveredAt,
//     receivedAt,
//     createdAt,
//     rating,
//   } = order;

//   const [imgFailed, setImgFailed] = useState(false);
//   const [busy, setBusy] = useState(false);

//   const today = todayKey();
//   const completed = status === "completed" || endDate < today;
//   const ongoing = !completed && startDate <= today;
//   const stateKey = completed ? "completed" : ongoing ? "ongoing" : "new";
//   const st = STATE[stateKey];

//   const delivered = Boolean(deliveredAt);
//   const received = Boolean(receivedAt);
//   const win = deliveryWindow(startDate, today);

//   const count = days || diffDays(startDate, endDate) + 1;
//   const orderNo = `#${String(_id).slice(-6).toUpperCase()}`;
//   const placedOn = createdAt
//     ? new Date(createdAt).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })
//     : "";
//   const percent = Math.round((Number(commissionRate) || 0.1) * 100);

//   const steps = [
//     { label: "Ordered", done: true },
//     { label: "Delivered", done: delivered },
//     { label: "Received", done: received },
//     { label: "Completed", done: completed },
//   ];

//   async function handleDeliver() {
//     if (busy) return;

//     setBusy(true);

//     try {
//       // Get JWT from Better Auth
//       const { data, error } = await authClient.token();

//       if (error || !data?.token) {
//         throw new Error("Authentication failed. Please log in again.");
//       }

//       // Send authenticated request
//       const res = await fetch(`${API_URL}/orders/${_id}/deliver`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${data.token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const dataResponse = await res.json().catch(() => ({}));

//       if (!res.ok) {
//         throw new Error(dataResponse.message || "Couldn't update the order.");
//       }

//       toast.success("Marked as delivered. The renter can now confirm.");

//       onDelivered?.(_id, dataResponse.deliveredAt);
//     } catch (err) {
//       toast.error(
//         err instanceof TypeError
//           ? "Can't reach the server. Check that your backend is running."
//           : err.message,
//       );
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <div
//       style={{ transitionDelay: `${Math.min(index, 8) * 70}ms` }}
//       className="transition-all duration-500 ease-out starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none"
//     >
//       <article
//         className={`overflow-hidden rounded-2xl border border-t-4 border-white/10 ${st.top} bg-[#0b1220]/80 shadow-xl shadow-black/30`}
//       >
//         {/* Header: car + status */}
//         <header className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
//           <Link
//             href={`/cars/${carId}`}
//             aria-label={`View ${carName}`}
//             className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-[#0a1424] sm:h-20 sm:w-32"
//           >
//             {carImage && !imgFailed ? (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img
//                 src={carImage}
//                 alt={carName}
//                 loading="lazy"
//                 onError={() => setImgFailed(true)}
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               <div className="grid h-full w-full place-items-center text-slate-600">
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="h-8 w-8"
//                   aria-hidden="true"
//                 >
//                   <path d="M5 16l1.6-5.2A2 2 0 0 1 8.5 9.4h7a2 2 0 0 1 1.9 1.4L19 16" />
//                   <path d="M3 16h18v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
//                 </svg>
//               </div>
//             )}
//           </Link>

//           <div className="min-w-0 flex-1">
//             <Link
//               href={`/cars/${carId}`}
//               className="block truncate text-lg font-bold text-white transition-colors hover:text-blue-300 sm:text-xl"
//             >
//               {carName}
//             </Link>
//             <p className="truncate text-xs text-slate-400 sm:text-sm">
//               {[carType, carLocation].filter(Boolean).join(" · ")}
//             </p>
//             <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
//               Order {orderNo}
//               {placedOn && ` · placed ${placedOn}`}
//             </p>
//           </div>

//           <span
//             className={`hidden shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium sm:inline-flex ${st.text}`}
//           >
//             <span
//               className={`h-1.5 w-1.5 rounded-full ${st.dot} ${st.pulse ? "animate-pulse" : ""}`}
//             />
//             {st.label}
//           </span>
//         </header>

//         {/* Status badge on phones */}
//         <div className="px-4 pb-3 sm:hidden">
//           <span
//             className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium ${st.text}`}
//           >
//             <span
//               className={`h-1.5 w-1.5 rounded-full ${st.dot} ${st.pulse ? "animate-pulse" : ""}`}
//             />
//             {st.label}
//           </span>
//         </div>

//         {/* Customer + dates */}
//         <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 sm:px-5">
//           <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-3">
//             <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
//               Customer
//             </p>
//             <div className="mt-2 flex items-center gap-3">
//               <Avatar src={userImage} name={userName} />
//               <div className="min-w-0">
//                 <p className="truncate text-sm font-semibold text-white">
//                   {userName || "Customer"}
//                 </p>
//                 {userEmail && (
//                   <p className="truncate text-xs text-slate-400">{userEmail}</p>
//                 )}
//               </div>
//             </div>
//             <div className="mt-3 flex flex-wrap gap-2 text-xs">
//               <span
//                 className={`rounded-lg px-2.5 py-1 ${
//                   driverNeeded === "Yes"
//                     ? "bg-amber-500/10 text-amber-300"
//                     : "bg-white/5 text-slate-300"
//                 }`}
//               >
//                 {driverNeeded === "Yes" ? "Driver needed" : "Self-drive"}
//               </span>
//             </div>
//             {specialNote && (
//               <p className="mt-2 line-clamp-3 text-xs italic text-slate-400">
//                 Note: “{specialNote}”
//               </p>
//             )}
//           </div>

//           <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
//             <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
//               Rental period
//             </p>
//             <p className="mt-2 text-lg font-bold text-white">
//               {formatRange(startDate, endDate)}
//             </p>
//             <p className="text-xs text-slate-400">
//               {count} {count === 1 ? "day" : "days"}
//             </p>
//             <p className="mt-3 text-xs text-slate-400">
//               Delivery window:{" "}
//               <span className="font-medium text-slate-200">
//                 {formatShort(startDate)}
//                 {" – "}
//                 {formatShort(
//                   new Date(
//                     new Date(startDate + "T00:00:00").getTime() + 86400000,
//                   )
//                     .toISOString()
//                     .slice(0, 10),
//                 )}
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Progress */}
//         <div className="px-4 pb-5 sm:px-5">
//           <ol className="grid grid-cols-4 gap-1">
//             {steps.map((s, i) => (
//               <li
//                 key={s.label}
//                 className="relative flex flex-col items-center text-center"
//               >
//                 {i > 0 && (
//                   <span
//                     aria-hidden="true"
//                     className={`absolute right-1/2 top-3 h-0.5 w-full -translate-y-1/2 ${
//                       s.done ? "bg-emerald-400/70" : "bg-white/10"
//                     }`}
//                   />
//                 )}
//                 <span
//                   className={`relative z-10 grid h-6 w-6 place-items-center rounded-full border text-[10px] font-semibold ${
//                     s.done
//                       ? "border-emerald-400 bg-emerald-500 text-white"
//                       : "border-white/20 bg-[#0b1626] text-slate-500"
//                   }`}
//                 >
//                   {s.done ? <CheckIcon /> : i + 1}
//                 </span>
//                 <span
//                   className={`mt-1.5 text-[11px] ${
//                     s.done ? "text-slate-200" : "text-slate-500"
//                   }`}
//                 >
//                   {s.label}
//                 </span>
//               </li>
//             ))}
//           </ol>
//         </div>

//         {/* Money + action */}
//         <div className="grid gap-4 border-t border-dashed border-white/20 bg-white/[0.03] p-4 sm:p-5 md:grid-cols-[1fr_auto] md:items-center">
//           <dl className="grid grid-cols-3 gap-3">
//             <div className="min-w-0">
//               <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
//                 Order total
//               </dt>
//               <dd className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
//                 {usd(totalPrice)}
//               </dd>
//             </div>
//             <div className="min-w-0">
//               <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
//                 Fee ({percent}%)
//               </dt>
//               <dd className="mt-1 truncate text-sm font-semibold text-red-300 sm:text-base">
//                 −{usd(platformFee)}
//               </dd>
//             </div>
//             <div className="min-w-0">
//               <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
//                 {completed ? "You earned" : "You will earn"}
//               </dt>
//               <dd
//                 className={`mt-1 truncate text-base font-bold sm:text-xl ${
//                   completed ? "text-emerald-400" : "text-white"
//                 }`}
//               >
//                 {usd(ownerEarning)}
//               </dd>
//             </div>
//           </dl>

//           <div className="md:w-56">
//             {completed ? (
//               <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-3 text-center text-sm">
//                 <p className="font-semibold text-violet-200">
//                   {received
//                     ? "Safely delivered"
//                     : delivered
//                       ? "Delivered"
//                       : "Ride completed"}
//                 </p>
//                 {rating ? (
//                   <p className="mt-0.5 text-xs text-amber-300">
//                     Renter rated {rating}/5
//                   </p>
//                 ) : (
//                   <p className="mt-0.5 text-xs text-slate-400">
//                     Earnings added to your total
//                   </p>
//                 )}
//               </div>
//             ) : received ? (
//               <p className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
//                 <CheckIcon className="h-4 w-4" />
//                 Safely delivered
//               </p>
//             ) : delivered ? (
//               <p className="rounded-xl border border-sky-400/25 bg-sky-500/10 px-4 py-3 text-center text-sm text-sky-200">
//                 Delivered. Waiting for the renter to confirm.
//               </p>
//             ) : win === "open" ? (
//               <button
//                 type="button"
//                 onClick={handleDeliver}
//                 disabled={busy}
//                 className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {busy ? "Saving…" : "Car Delivered"}
//               </button>
//             ) : win === "before" ? (
//               <div>
//                 <button
//                   type="button"
//                   disabled
//                   className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-slate-500"
//                 >
//                   Car Delivered
//                 </button>
//                 <p className="mt-1.5 text-center text-xs text-slate-500">
//                   Opens on {formatShort(startDate)}
//                 </p>
//               </div>
//             ) : (
//               <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-slate-400">
//                 The delivery window has ended.
//               </p>
//             )}
//           </div>
//         </div>
//       </article>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  deliveryWindow,
  diffDays,
  formatRange,
  formatShort,
  todayKey,
} from "@/lib/date";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const OWNER_CANCEL_WINDOW_MS = 5 * 60 * 60 * 1000; // 5 hours after booking

const STATE = {
  new: {
    label: "New order",
    dot: "bg-sky-400",
    text: "text-sky-300",
    top: "border-t-sky-400",
    pulse: false,
  },
  ongoing: {
    label: "In progress",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    top: "border-t-emerald-400",
    pulse: true,
  },
  completed: {
    label: "Completed",
    dot: "bg-violet-400",
    text: "text-violet-300",
    top: "border-t-violet-400",
    pulse: false,
  },
};

const usd = (n) =>
  `$${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function formatLeft(ms) {
  const mins = Math.max(1, Math.ceil(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function CheckIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function Avatar({ src, name }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-10 w-10 shrink-0 rounded-full border border-white/15 object-cover"
      />
    );
  }

  return (
    <span
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-semibold text-white"
      aria-hidden="true"
    >
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

export default function Order({ order, index = 0, onDelivered, onCancelled }) {
  const {
    _id,
    carId,
    carName,
    carImage,
    carType,
    carLocation,
    startDate,
    endDate,
    days,
    totalPrice,
    platformFee,
    ownerEarning,
    commissionRate,
    driverNeeded,
    specialNote,
    userName,
    userEmail,
    userImage,
    status,
    deliveredAt,
    receivedAt,
    createdAt,
    rating,
  } = order;

  const [imgFailed, setImgFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [confirming, setConfirming] = useState(false);

  const today = todayKey();
  const completed = status === "completed" || endDate < today;
  const ongoing = !completed && startDate <= today;
  const stateKey = completed ? "completed" : ongoing ? "ongoing" : "new";
  const st = STATE[stateKey];

  const delivered = Boolean(deliveredAt);
  const received = Boolean(receivedAt);
  const win = deliveryWindow(startDate, today);

  // owner can cancel the ride for 5 hours after it was booked, before delivery
  const deadline = createdAt
    ? new Date(createdAt).getTime() + OWNER_CANCEL_WINDOW_MS
    : 0;
  const msLeft = deadline - now;
  const canCancel = !completed && !delivered && msLeft > 0;

  // tick while the window is open, so the countdown stays fresh
  useEffect(() => {
    if (!canCancel) return;
    const id = setInterval(() => setNow(Date.now()), 20000);
    return () => clearInterval(id);
  }, [canCancel]);

  const count = days || diffDays(startDate, endDate) + 1;
  const orderNo = `#${String(_id).slice(-6).toUpperCase()}`;
  const placedOn = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const percent = Math.round((Number(commissionRate) || 0.1) * 100);

  const steps = [
    { label: "Ordered", done: true },
    { label: "Delivered", done: delivered },
    { label: "Received", done: received },
    { label: "Completed", done: completed },
  ];

  async function handleDeliver() {
    if (busy) return;

    setBusy(true);

    try {
      // Get JWT from Better Auth
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      // Send authenticated request
      const res = await fetch(`${API_URL}/orders/${_id}/deliver`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
      });

      const dataResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(dataResponse.message || "Couldn’t update the order.");
      }

      toast.success("Marked as delivered. The renter can now confirm.");

      onDelivered?.(_id, dataResponse.deliveredAt);
    } catch (err) {
      toast.error(
        err instanceof TypeError
          ? "Can’t reach the server. Check that your backend is running."
          : err.message,
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel() {
    if (busy) return;

    setBusy(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const res = await fetch(`${API_URL}/orders/${_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const body = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Your session expired. Please log in again.");
      }
      if (!res.ok) {
        throw new Error(body.message || "Couldn’t cancel the ride.");
      }

      toast.success("Ride cancelled. The renter has been notified.");

      onCancelled?.(_id);
    } catch (err) {
      toast.error(
        err instanceof TypeError
          ? "Can’t reach the server. Check that your backend is running."
          : err.message,
      );
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{ transitionDelay: `${Math.min(index, 8) * 70}ms` }}
      className="transition-all duration-500 ease-out starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none"
    >
      <article
        className={`overflow-hidden rounded-2xl border border-t-4 border-white/10 ${st.top} bg-[#0b1220]/80 shadow-xl shadow-black/30`}
      >
        {/* Header: car + status */}
        <header className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
          <Link
            href={`/cars/${carId}`}
            aria-label={`View ${carName}`}
            className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-[#0a1424] sm:h-20 sm:w-32"
          >
            {carImage && !imgFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={carImage}
                alt={carName}
                loading="lazy"
                onError={() => setImgFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-slate-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                  aria-hidden="true"
                >
                  <path d="M5 16l1.6-5.2A2 2 0 0 1 8.5 9.4h7a2 2 0 0 1 1.9 1.4L19 16" />
                  <path d="M3 16h18v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                </svg>
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              href={`/cars/${carId}`}
              className="block truncate text-lg font-bold text-white transition-colors hover:text-blue-300 sm:text-xl"
            >
              {carName}
            </Link>
            <p className="truncate text-xs text-slate-400 sm:text-sm">
              {[carType, carLocation].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
              Order {orderNo}
              {placedOn && ` · placed ${placedOn}`}
            </p>
          </div>

          <span
            className={`hidden shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium sm:inline-flex ${st.text}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${st.dot} ${st.pulse ? "animate-pulse" : ""}`}
            />
            {st.label}
          </span>
        </header>

        {/* Status badge on phones */}
        <div className="px-4 pb-3 sm:hidden">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium ${st.text}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${st.dot} ${st.pulse ? "animate-pulse" : ""}`}
            />
            {st.label}
          </span>
        </div>

        {/* Customer + dates */}
        <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 sm:px-5">
          <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Customer
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Avatar src={userImage} name={userName} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {userName || "Customer"}
                </p>
                {userEmail && (
                  <p className="truncate text-xs text-slate-400">{userEmail}</p>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span
                className={`rounded-lg px-2.5 py-1 ${
                  driverNeeded === "Yes"
                    ? "bg-amber-500/10 text-amber-300"
                    : "bg-white/5 text-slate-300"
                }`}
              >
                {driverNeeded === "Yes" ? "Driver needed" : "Self-drive"}
              </span>
            </div>
            {specialNote && (
              <p className="mt-2 line-clamp-3 text-xs italic text-slate-400">
                Note: “{specialNote}”
              </p>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Rental period
            </p>
            <p className="mt-2 text-lg font-bold text-white">
              {formatRange(startDate, endDate)}
            </p>
            <p className="text-xs text-slate-400">
              {count} {count === 1 ? "day" : "days"}
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Delivery window:{" "}
              <span className="font-medium text-slate-200">
                {formatShort(startDate)}
                {" – "}
                {formatShort(
                  new Date(
                    new Date(startDate + "T00:00:00").getTime() + 86400000,
                  )
                    .toISOString()
                    .slice(0, 10),
                )}
              </span>
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pb-5 sm:px-5">
          <ol className="grid grid-cols-4 gap-1">
            {steps.map((s, i) => (
              <li
                key={s.label}
                className="relative flex flex-col items-center text-center"
              >
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={`absolute right-1/2 top-3 h-0.5 w-full -translate-y-1/2 ${
                      s.done ? "bg-emerald-400/70" : "bg-white/10"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 grid h-6 w-6 place-items-center rounded-full border text-[10px] font-semibold ${
                    s.done
                      ? "border-emerald-400 bg-emerald-500 text-white"
                      : "border-white/20 bg-[#0b1626] text-slate-500"
                  }`}
                >
                  {s.done ? <CheckIcon /> : i + 1}
                </span>
                <span
                  className={`mt-1.5 text-[11px] ${
                    s.done ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Money + action */}
        <div className="grid gap-4 border-t border-dashed border-white/20 bg-white/[0.03] p-4 sm:p-5 md:grid-cols-[1fr_auto] md:items-center">
          <dl className="grid grid-cols-3 gap-3">
            <div className="min-w-0">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Order total
              </dt>
              <dd className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
                {usd(totalPrice)}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Fee ({percent}%)
              </dt>
              <dd className="mt-1 truncate text-sm font-semibold text-red-300 sm:text-base">
                −{usd(platformFee)}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {completed ? "You earned" : "You will earn"}
              </dt>
              <dd
                className={`mt-1 truncate text-base font-bold sm:text-xl ${
                  completed ? "text-emerald-400" : "text-white"
                }`}
              >
                {usd(ownerEarning)}
              </dd>
            </div>
          </dl>

          <div className="md:w-56">
            {completed ? (
              <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-3 text-center text-sm">
                <p className="font-semibold text-violet-200">
                  {received
                    ? "Safely delivered"
                    : delivered
                      ? "Delivered"
                      : "Ride completed"}
                </p>
                {rating ? (
                  <p className="mt-0.5 text-xs text-amber-300">
                    Renter rated {rating}/5
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs text-slate-400">
                    Earnings added to your total
                  </p>
                )}
              </div>
            ) : received ? (
              <p className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                <CheckIcon className="h-4 w-4" />
                Safely delivered
              </p>
            ) : delivered ? (
              <p className="rounded-xl border border-sky-400/25 bg-sky-500/10 px-4 py-3 text-center text-sm text-sky-200">
                Delivered. Waiting for the renter to confirm.
              </p>
            ) : win === "open" ? (
              <button
                type="button"
                onClick={handleDeliver}
                disabled={busy}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Saving…" : "Car Delivered"}
              </button>
            ) : win === "before" ? (
              <div>
                <button
                  type="button"
                  disabled
                  className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-slate-500"
                >
                  Car Delivered
                </button>
                <p className="mt-1.5 text-center text-xs text-slate-500">
                  Opens on {formatShort(startDate)}
                </p>
              </div>
            ) : (
              <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-slate-400">
                The delivery window has ended.
              </p>
            )}
          </div>
        </div>

        {/* Owner cancel: 5 hours after the ride was booked */}
        {canCancel && (
          <div className="flex flex-col gap-3 border-t border-dashed border-white/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            {confirming ? (
              <>
                <p className="text-sm text-slate-300">
                  Cancel this ride? The renter will be told, and the dates open
                  up again.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setConfirming(false)}
                    className="h-10 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                  >
                    Keep ride
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleCancel}
                    className="h-10 flex-1 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                  >
                    {busy ? "Cancelling…" : "Yes, cancel ride"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="flex items-center gap-2 text-xs text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <span>
                    You can cancel this ride for another{" "}
                    <span className="font-semibold text-white">
                      {formatLeft(msLeft)}
                    </span>
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-red-400/40 bg-red-500/10 px-4 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/20 active:scale-[0.97] sm:w-auto"
                >
                  Cancel ride
                </button>
              </>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
