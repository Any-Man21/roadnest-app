import { Suspense } from "react";
import Link from "next/link";
import { Barlow } from "next/font/google";
import CarsList from "@/components/CarsList";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const metadata = {
  title: "Explore Cars | RoadNest",
  description: "Explore and book your next ride with RoadNest.",
};

async function getCars(search, type) {
  try {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (type) params.set("type", type);

    const query = params.toString();

    const res = await fetch(`${API_URL}/cars${query ? `?${query}` : ""}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cars");
    }

    return {
      cars: await res.json(),
      error: false,
    };
  } catch (error) {
    console.error("Cars page error:", error);

    return {
      cars: [],
      error: true,
    };
  }
}

async function CarsGrid({ search, type }) {
  const { cars, error } = await getCars(search, type);

  if (error) {
    return (
      <StateMessage
        title="Couldn't load cars"
        text="We can't reach the server right now. Please check your connection and try again."
      />
    );
  }

  if (cars.length === 0) {
    return (
      <StateMessage
        title="No matching cars found"
        text="Try another car name or select a different category."
        href="/cars"
        cta="Explore All Cars"
      />
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400 sm:text-base">
          <span className="font-semibold text-white">{cars.length}</span>{" "}
          {cars.length === 1 ? "vehicle" : "vehicles"} found
        </p>

        {(search || type) && (
          <div className="flex flex-wrap items-center gap-2">
            {search && (
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-300">
                Search: {search}
              </span>
            )}

            {type && (
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-300">
                Category: {type}
              </span>
            )}

            <Link
              href="/cars"
              className="text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              Clear filters ×
            </Link>
          </div>
        )}
      </div>

      <CarsList cars={cars} />
    </>
  );
}

export default async function ExploreCarsPage({ searchParams }) {
  const params = await searchParams;

  const search = typeof params?.search === "string" ? params.search.trim() : "";

  const type = typeof params?.type === "string" ? params.type.trim() : "";

  return (
    <main
      className={`${barlow.className} relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-[#060b14] px-4 py-10 text-white sm:px-6 sm:py-14`}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[720px] max-w-[140vw] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-7xl">
        {/* Page heading */}
        <header className="transition-all duration-700">
          <p className="mb-3 text-xs font-bold tracking-[4px] text-blue-400">
            ROADNEST COLLECTION
          </p>

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {search || type ? (
              <>
                Discover Your
                <span className="block bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  Perfect Match
                </span>
              </>
            ) : (
              <>
                Explore And Dive In
                <span className="block bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  To Your New Ride
                </span>
              </>
            )}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            {search || type
              ? "Here are the vehicles matching your search. Your next journey starts here."
              : "Discover our collection of carefully selected vehicles and find the perfect ride for your next journey."}
          </p>
        </header>

        {/* Cars */}
        <section className="mt-9 sm:mt-12">
          <Suspense fallback={<CarsSkeleton />}>
            <CarsGrid search={search} type={type} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

function CarsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]"
        >
          <div className="aspect-[16/10] bg-white/5" />

          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-1/2 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StateMessage({ title, text, href, cta }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
      <div className="mb-4 text-4xl">🚘</div>

      <h2 className="text-xl font-semibold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>

      {href && (
        <Link
          href={href}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5"
        >
          {cta}
        </Link>
      )}
    </div>
  );
}
