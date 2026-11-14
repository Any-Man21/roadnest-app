import { Suspense } from "react";
import Link from "next/link";
import CarDetailView from "@/components/CarDetailView";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

// Dynamic SEO metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) {
    return {
      title: "Car Not Found | RoadNest",
      description: "This vehicle could not be found on RoadNest.",
    };
  }

  const name = car.name || "Car Rental";

  return {
    title: `${name} | RoadNest`,
    description: `Explore the ${name} on RoadNest. Check its details, features, and daily rental price, and book your next ride.`,
    openGraph: {
      title: `${name} | RoadNest`,
      description: `Discover the ${name} and book your next ride with RoadNest.`,
      type: "website",
      images: car.imageUrl
        ? [
            {
              url: car.imageUrl,
              alt: name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | RoadNest`,
      description: `Discover the ${name} and book your next ride with RoadNest.`,
      images: car.imageUrl ? [car.imageUrl] : [],
    },
  };
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
