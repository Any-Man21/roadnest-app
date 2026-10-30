import Link from "next/link";
import { Barlow } from "next/font/google";
import CarCard from "@/components/CarCard";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getCars() {
  try {
    // no-store = always fetch fresh, so newly added cars show up immediately
    const res = await fetch(`${API_URL}/cars`, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad response");
    return { cars: await res.json(), error: false };
  } catch {
    return { cars: [], error: true };
  }
}

export const metadata = {
  title: "Explore Cars | RoadNest",
};

export default async function ExploreCarsPage() {
  const { cars, error } = await getCars();

  return (
    <main
      className={`${barlow.className} relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-[#060b14] px-4 py-10 text-white sm:px-6 sm:py-14`}
    >
      {/* soft background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[720px] max-w-[140vw] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <header className="transition-all duration-700 ease-out starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Explore And Dive In
            <span className="block bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              To Your New Ride
            </span>
          </h1>

          {!error && cars.length > 0 && (
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              {cars.length} {cars.length === 1 ? "car" : "cars"} ready for your
              next trip.
            </p>
          )}
        </header>

        {/* Content */}
        <section className="mt-8 sm:mt-10">
          {error ? (
            <StateMessage
              title="Couldn’t load cars"
              text="We can’t reach the server right now. Please check that your backend is running and try again."
            />
          ) : cars.length === 0 ? (
            <StateMessage
              title="No cars listed yet"
              text="Be the first to list a car and start earning."
              href="/add-car"
              cta="Add a Car"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cars.map((car, i) => (
                <CarCard key={car._id} car={car} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StateMessage({ title, text, href, cta }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center transition-all duration-500 ease-out starting:translate-y-3 starting:opacity-0">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
      {href && (
        <Link
          href={href}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50"
        >
          {cta}
        </Link>
      )}
    </div>
  );
}
