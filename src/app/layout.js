
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StyledJsxRegistry from "@/components/StyledJsxRegistry";
import SplashScreen from "@/components/SplashScreen";

export const metadata = {
  title: "RoadNest | Premium Car Rentals",
  description:
    "Rent premium cars or list your own and earn. Simple booking, transparent pricing, 24/7 support.",
};

const SCROLL_FIX = `(function(){
  try {
    var navigation = performance.getEntriesByType("navigation")[0];

    if (navigation && navigation.type === "reload") {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      window.addEventListener("load", function() {
        window.scrollTo(0, 0);

        setTimeout(function() {
          history.scrollRestoration = "auto";
        }, 300);
      });
    }
  } catch (e) {}
})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="dark"
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCROLL_FIX }} />
      </head>

      <body className="bg-[#05080f] text-white antialiased">
        <StyledJsxRegistry>
          <div className="site-shell">

            <SplashScreen />

            <Navbar />

            <div className="site-content">
              {children}
            </div>

            <Footer />

          </div>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
