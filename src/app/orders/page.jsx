import OrdersPage from "./OrdersClient";
export const metadata = {
  title: "Orders | RoadNest",
  description:
    "List of your orders with RoadNest. Manage your bookings and payments here.",
  openGraph: {
    title: "List Your Car | RoadNest",
    description:
      "Make your vehicle available for rent with RoadNest. Create your car listing today.",
    type: "website",
  },
};

export default function Page() {
  return <OrdersPage />;
}
