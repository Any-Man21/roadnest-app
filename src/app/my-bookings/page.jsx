import MyBookingsPage from "./MyBookingsClient";

export const metadata = {
  title: "My Bookings | RoadNest",
  description:
    "List your car on RoadNest and connect with renters. Add your vehicle details, set your daily rental price, and start receiving bookings.",
  openGraph: {
    title: "List Your Car | RoadNest",
    description:
      "Make your vehicle available for rent with RoadNest. Create your car listing today.",
    type: "website",
  },
};

export default function Page() {
  return <MyBookingsPage />;
}
