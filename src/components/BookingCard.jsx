"use client";

import { motion } from "framer-motion";

export default function BookingCard({ car }) {
  const { name, pricePerDay, status } = car;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 rounded-3xl bg-[#0b1626] border border-white/10 shadow-2xl"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="max-w-[150px]">
          <h3 className="text-xl font-bold text-white truncate">{name}</h3>
          <p className="text-slate-400 text-sm">Premium Rental</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
          {status || "Available"}
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

      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:cursor-pointer"
        >
          Book Now
        </motion.button>
      </div>
      <p className="text-center text-[10px] text-slate-500 mt-4">
        Free cancellation up to 24h before pickup.
      </p>
    </motion.div>
  );
}
