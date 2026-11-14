import Banner from "@/components/Banner";
import Stats from "@/components/home/Stats";
import FleetSection from "@/components/home/FleetWeb";
import Reviews from "@/components/home/Reviews";
import Founder from "@/components/home/Founder";
import Faq from "@/components/home/Faq";

export const metadata = {
  title: "RoadNest | Premium Car Rentals",
  description:
    "Rent premium cars or list your own and earn. Simple booking, transparent pricing, 24/7 support.",
};

export default function Home() {
  return (
    <main>
      <Banner />
      <Stats />
      <FleetSection />
      <Reviews />
      <Founder />
      <Faq />
    </main>
  );
}