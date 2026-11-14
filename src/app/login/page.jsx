import LoginPage from "./LoginClient";

export const metadata = {
  title: "Login| RoadNest",
  description:
    "Login to your RoadNest account to access your dashboard and manage your car listings.",
  openGraph: {
    title: "List Your Car | RoadNest",
    description:
      "Make your vehicle available for rent with RoadNest. Create your car listing today.",
    type: "website",
  },
};

export default function Page() {
  return <LoginPage />;
}
