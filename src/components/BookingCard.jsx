// "use client";

// import { motion } from "framer-motion";
// import BookingCardForm from "./BookingCardForm";

// export default function BookingCard({ car }) {
//   const { name, pricePerDay, status } = car;

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="p-6 rounded-3xl bg-[#0b1626] border border-white/10 shadow-2xl"
//     >
//       <div className="flex justify-between items-start mb-6">
//         <div className="max-w-[150px]">
//           <h3 className="text-xl font-bold text-white truncate">{name}</h3>
//           <p className="text-slate-400 text-sm">Premium Rental</p>
//         </div>
//         <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
//           {status || "Available"}
//         </span>
//       </div>

//       <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
//         <div className="flex justify-between items-center">
//           <span className="text-slate-400 text-sm">Price per day</span>
//           <div className="text-right">
//             <span className="text-2xl font-bold text-blue-400">
//               ${pricePerDay}
//             </span>
//             <span className="text-slate-500 text-xs ml-1">/day</span>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col gap-3">
//         <BookingCardForm carId={car._id} carName={car.name} />
//       </div>
//       <p className="text-center text-[10px] text-slate-500 mt-4">
//         Free cancellation up to 24h before pickup.
//       </p>
//     </motion.div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import BookingCardForm from "./BookingCardForm";
import { formatRange } from "@/lib/date";

const STATUS_STYLE = {
  available: {
    label: "Available",
    cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  unavailable: {
    label: "Unavailable",
    cls: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  maintenance: {
    label: "Maintenance",
    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
};

export default function BookingCard({ car }) {
  const {
    _id,
    name,
    pricePerDay,
    status,
    imageUrl,
    location,
    type,
    bookedRanges = [],
  } = car;

  const st = STATUS_STYLE[status] || STATUS_STYLE.available;
  const shown = bookedRanges.slice(0, 3);
  const extra = bookedRanges.length - shown.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 rounded-3xl bg-[#0b1626] border border-white/10 shadow-2xl"
    >
      <div className="flex justify-between items-start gap-3 mb-6">
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-white truncate">{name}</h3>
          <p className="text-slate-400 text-sm">Premium Rental</p>
        </div>
        <span
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${st.cls}`}
        >
          {st.label}
        </span>
      </div>

      <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Price per day</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-400">
              ${pricePerDay}
            </span>
            <span className="text-slate-500 text-xs ml-1">/day</span>
          </div>
        </div>
      </div>

      {bookedRanges.length > 0 && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-300">
            Already booked
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {shown.map((r) => (
              <span
                key={r.startDate}
                className="rounded-lg bg-red-500/10 px-2.5 py-1 text-xs text-red-200"
              >
                {formatRange(r.startDate, r.endDate)}
              </span>
            ))}
            {extra > 0 && (
              <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                +{extra} more
              </span>
            )}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            These dates are blocked in the calendar.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <BookingCardForm
          carId={_id}
          carName={name}
          price={pricePerDay}
          imageURL={imageUrl}
          location={location}
          type={type}
          status={status}
          bookedRanges={bookedRanges}
        />
      </div>
      <p className="text-center text-[10px] text-slate-500 mt-4">
        Free cancellation up to 24h before pickup.
      </p>
    </motion.div>
  );
}
