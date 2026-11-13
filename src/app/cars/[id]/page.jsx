import { Suspense } from "react";
import Link from "next/link";
import CarDetailView from "@/components/CarDetailView";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getCar(id) {
  try {
    let token = null;

    // JWT retrieval, but allows guests
    try {
      const tokenResponse = await auth.api.getToken({
        headers: await headers(),
      });

      token = tokenResponse?.token;
    } catch {
      console.log("Guest accessing car details.");
    }

    // Add JWT only when available
    const requestHeaders = {};

    if (token) {
      requestHeaders["authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/cars/${id}`, {
      headers: requestHeaders,
      cache: "no-store",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Failed to load car:", error);
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
