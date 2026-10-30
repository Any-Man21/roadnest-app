// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import CarDetailView from "@/components/CarDetailView";

// export default function CarsDetailsPage() {
//   const params = useParams();
//   const id = params.id;
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchCar() {
//       try {
//         setLoading(true);
//         const res = await fetch(`http://localhost:5000/cars/${id}`);

//         if (!res.ok) {
//           throw new Error("Car not found");
//         }

//         const data = await res.json();
//         setCar(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) {
//       fetchCar();
//     }
//   }, [id]);

//   // 1. Loading State (Vibe matching)
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#05080f] flex items-center justify-center text-white">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-slate-400 animate-pulse">
//             Loading your luxury ride...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // 2. Error State
//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#05080f] text-white flex items-center justify-center p-10 text-center">
//         <div>
//           <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
//           <p className="text-slate-400">{error}</p>
//           <Link
//             href="/cars"
//             className="mt-4 inline-block text-blue-400 underline"
//           >
//             Return
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // 3. Final View
//   return <CarDetailView car={car} />;
// }

import { Suspense } from "react";
import Link from "next/link";
import CarDetailView from "@/components/CarDetailView";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getCar(id) {
  try {
    const res = await fetch(`${API_URL}/cars/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* The only part that waits for the URL param and the data */
async function CarContent({ params }) {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05080f] p-10 text-center text-white">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Car not found</h1>
          <p className="text-slate-400">
            This car may have been removed, or the server is unreachable.
          </p>
          <Link
            href="/cars"
            className="mt-4 inline-block text-blue-400 underline"
          >
            Back to cars
          </Link>
        </div>
      </div>
    );
  }

  return <CarDetailView car={car} />;
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05080f] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="animate-pulse text-slate-400">
          Loading your luxury ride…
        </p>
      </div>
    </div>
  );
}

export default function CarsDetailsPage({ params }) {
  return (
    <Suspense fallback={<Loading />}>
      <CarContent params={params} />
    </Suspense>
  );
}
