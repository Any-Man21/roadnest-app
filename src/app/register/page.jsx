import RegisterPage from "./RegisterClient";

export const metadata = {
  title: "Register Your Account | RoadNest",
  description:
    "Register your account with RoadNest to start renting your car. Create your account today.",
  openGraph: {
    title: "List Your Car | RoadNest",
    description:
      "Make your vehicle available for rent with RoadNest. Create your car listing today.",
    type: "website",
  },
};

export default function Page() {
  return <RegisterPage />;
}
