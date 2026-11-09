// "use client";

// import { useState } from "react";
// import Link from "next/link";

// const STATUS = {
//   available: {
//     label: "Available",
//     dot: "bg-emerald-400",
//     text: "text-emerald-300",
//     pulse: true,
//   },
//   unavailable: {
//     label: "Unavailable",
//     dot: "bg-red-400",
//     text: "text-red-300",
//     pulse: false,
//   },
//   maintenance: {
//     label: "Maintenance",
//     dot: "bg-amber-400",
//     text: "text-amber-300",
//     pulse: false,
//   },
// };

// const Icon = ({ children, className = "h-4 w-4" }) => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="1.8"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className={className}
//     aria-hidden="true"
//   >
//     {children}
//   </svg>
// );

// const SeatIcon = () => (
//   <Icon>
//     <circle cx="9" cy="8" r="3.5" />
//     <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
//     <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.4c2 .8 3.5 2.7 3.5 5.6" />
//   </Icon>
// );

// const PinIcon = () => (
//   <Icon>
//     <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
//     <circle cx="12" cy="10" r="2.5" />
//   </Icon>
// );

// const ArrowIcon = () => (
//   <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5">
//     <path d="M5 12h14M13 6l6 6-6 6" />
//   </Icon>
// );

// const CarIcon = () => (
//   <Icon className="h-14 w-14">
//     <path d="M5 16l1.6-5.2A2 2 0 0 1 8.5 9.4h7a2 2 0 0 1 1.9 1.4L19 16" />
//     <path d="M3 16h18v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
//   </Icon>
// );

// export default function CarCard({ car, index = 0 }) {
//   const {
//     _id,
//     name,
//     pricePerDay,
//     type,
//     imageUrl,
//     seats,
//     location,
//     description,
//     status,
//   } = car;

//   const [imgFailed, setImgFailed] = useState(false);
//   const st = STATUS[status] || STATUS.available;
//   const unavailable = status && status !== "available";

//   return (
//     // Outer layer = entrance animation (staggered). Inner card = hover effects.
//     <div
//       style={{ transitionDelay: `${Math.min(index, 8) * 70}ms` }}
//       className="h-full transition-all duration-500 ease-out starting:translate-y-5 starting:opacity-0 motion-reduce:transition-none"
//     >
//       <Link
//         href={`/cars/${_id}`}
//         className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1.5 hover:border-blue-400/40 hover:shadow-[0_24px_50px_-20px_rgba(47,139,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transform-none motion-reduce:transition-none"
//       >
//         {/* Image */}
//         <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#122036] to-[#0a1424]">
//           {imageUrl && !imgFailed ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img
//               src={imageUrl}
//               alt={name}
//               loading="lazy"
//               onError={() => setImgFailed(true)}
//               className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 ${
//                 unavailable ? "grayscale-[60%]" : ""
//               }`}
//             />
//           ) : (
//             <div className="grid h-full place-items-center text-slate-600">
//               <CarIcon />
//             </div>
//           )}

//           {/* fade into card body */}
//           <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/10 to-transparent" />

//           {/* light sweep on hover */}
//           <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/10 opacity-0 blur-sm transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100" />

//           {type && (
//             <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
//               {type}
//             </span>
//           )}

//           <span
//             className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-xs font-medium backdrop-blur ${st.text}`}
//           >
//             <span
//               className={`h-1.5 w-1.5 rounded-full ${st.dot} ${st.pulse ? "animate-pulse" : ""}`}
//             />
//             {st.label}
//           </span>
//         </div>

//         {/* Details */}
//         <div className="flex flex-1 flex-col gap-3 p-4">
//           <div className="flex items-start justify-between gap-3">
//             <h3 className="min-w-0 line-clamp-1 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-blue-300">
//               {name}
//             </h3>
//             <p className="shrink-0 leading-tight">
//               <span className="text-lg font-bold text-blue-400">
//                 ${Number(pricePerDay || 0).toLocaleString()}
//               </span>
//               <span className="text-xs text-slate-400">/day</span>
//             </p>
//           </div>

//           <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">
//             {description}
//           </p>

//           <div className="mt-auto flex items-center gap-4 border-t border-white/10 pt-3 text-xs text-slate-300">
//             <span className="inline-flex shrink-0 items-center gap-1.5">
//               <SeatIcon />
//               {seats} seats
//             </span>
//             <span className="inline-flex min-w-0 items-center gap-1.5">
//               <PinIcon />
//               <span className="truncate">{location}</span>
//             </span>
//             <span className="ml-auto inline-flex shrink-0 items-center gap-1 font-medium text-blue-400 transition-all duration-300 group-hover:gap-2">
//               Book Your Ride
//               <ArrowIcon />
//             </span>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";

const STATUS = {
  available: {
    label: "Available",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    pulse: true,
  },
  unavailable: {
    label: "Unavailable",
    dot: "bg-red-400",
    text: "text-red-300",
    pulse: false,
  },
  maintenance: {
    label: "Maintenance",
    dot: "bg-amber-400",
    text: "text-amber-300",
    pulse: false,
  },
  // booked by the logged-in user
  booked: {
    label: "Booked",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    pulse: false,
    tick: true,
  },
  // booked by someone else, right now
  taken: {
    label: "Unavailable",
    dot: "bg-red-400",
    text: "text-red-300",
    pulse: false,
  },
};

const Icon = ({ children, className = "h-4 w-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const SeatIcon = () => (
  <Icon>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.4c2 .8 3.5 2.7 3.5 5.6" />
  </Icon>
);

const PinIcon = () => (
  <Icon>
    <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

const ArrowIcon = () => (
  <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

const CheckIcon = () => (
  <Icon className="h-3.5 w-3.5">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

const CarIcon = () => (
  <Icon className="h-14 w-14">
    <path d="M5 16l1.6-5.2A2 2 0 0 1 8.5 9.4h7a2 2 0 0 1 1.9 1.4L19 16" />
    <path d="M3 16h18v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
  </Icon>
);

export default function CarCard({
  car,
  index = 0,
  bookedByMe = false,
  bookedNow = false,
}) {
  const {
    _id,
    name,
    pricePerDay,
    type,
    imageUrl,
    seats,
    location,
    description,
    status,
  } = car;

  const [imgFailed, setImgFailed] = useState(false);

  const stKey = bookedByMe
    ? "booked"
    : bookedNow
      ? "taken"
      : STATUS[status]
        ? status
        : "available";
  const st = STATUS[stKey];

  const unavailable =
    !bookedByMe && ((status && status !== "available") || bookedNow);

  return (
    // Outer layer = entrance animation (staggered). Inner card = hover effects.
    <div
      style={{ transitionDelay: `${Math.min(index, 8) * 70}ms` }}
      className="h-full transition-all duration-500 ease-out starting:translate-y-5 starting:opacity-0 motion-reduce:transition-none"
    >
      <Link
        href={`/cars/${_id}`}
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#0b1220] shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(47,139,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transform-none motion-reduce:transition-none ${
          bookedByMe
            ? "border-emerald-400/40 hover:border-emerald-400/70"
            : "border-white/10 hover:border-blue-400/40"
        }`}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#122036] to-[#0a1424]">
          {imageUrl && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 ${
                unavailable ? "grayscale-[60%]" : ""
              }`}
            />
          ) : (
            <div className="grid h-full place-items-center text-slate-600">
              <CarIcon />
            </div>
          )}

          {/* fade into card body */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/10 to-transparent" />

          {/* light sweep on hover */}
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/10 opacity-0 blur-sm transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100" />

          {type && (
            <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              {type}
            </span>
          )}

          <span
            className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-xs font-medium backdrop-blur ${st.text}`}
          >
            {st.tick ? (
              <CheckIcon />
            ) : (
              <span
                className={`h-1.5 w-1.5 rounded-full ${st.dot} ${st.pulse ? "animate-pulse" : ""}`}
              />
            )}
            {st.label}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 line-clamp-1 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-blue-300">
              {name}
            </h3>
            <p className="shrink-0 leading-tight">
              <span className="text-lg font-bold text-blue-400">
                ${Number(pricePerDay || 0).toLocaleString("en-US")}
              </span>
              <span className="text-xs text-slate-400">/day</span>
            </p>
          </div>

          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">
            {description}
          </p>

          <div className="mt-auto flex items-center gap-4 border-t border-white/10 pt-3 text-xs text-slate-300">
            <span className="inline-flex shrink-0 items-center gap-1.5">
              <SeatIcon />
              {seats} seats
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <PinIcon />
              <span className="truncate">{location}</span>
            </span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 font-medium text-blue-400 transition-all duration-300 group-hover:gap-2">
              {bookedByMe || bookedNow ? "View Details" : "Book Your Ride"}
              <ArrowIcon />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
