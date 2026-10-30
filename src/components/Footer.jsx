"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Barlow, Caveat } from "next/font/google";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const caveat = Caveat({ subsets: ["latin"], weight: ["600"] });

const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Fleet", href: "/cars" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  services: [
    { label: "Luxury Rentals", href: "/cars?type=luxury" },
    { label: "Sports Cars", href: "/cars?type=sport" },
    { label: "Premium SUVs", href: "/cars?type=suv" },
    { label: "Airport Pickups", href: "/services/airport" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact Us", href: "/contact" },
  ],
};

export default function Footer() {
  // FIX: Initialize year as an empty string to prevent hydration mismatch
  const [year, setYear] = useState("");

  useEffect(() => {
    // Set the year only after the component mounts on the client
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className={`rn-footer ${barlow.className}`}>
      <div className="footer-main">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span className="logo-text">
                Road<span className="blue-accent">Nest</span>
              </span>
            </Link>
            <p className="brand-desc">
              Redefining the art of driving. We provide an elite collection of
              automotive masterpieces for those who demand the extraordinary.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">
                Instagram
              </a>
              <a href="#" className="social-icon">
                Twitter
              </a>
              <a href="#" className="social-icon">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links-area">
            <div className="link-column">
              <h3>Company</h3>
              <ul>
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="link-column">
              <h3>Services</h3>
              <ul>
                {FOOTER_LINKS.services.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="link-column">
              <h3>Support</h3>
              <ul>
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="bottom-left">
            <p>© {year} RoadNest Luxury Rentals. All rights reserved.</p>
          </div>
          <div className={`bottom-right ${caveat.className}`}>
            Drive More, Worry Less.
          </div>
        </div>
      </div>

      <style jsx global>{`
        .rn-footer {
          background: #05080f;
          color: #ffffff;
          padding: 80px 0 30px 0;
          border-top: 1px solid rgba(120, 160, 220, 0.1);
          position: relative;
        }
        .footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 3fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        /* Brand Section */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .footer-logo {
          text-decoration: none;
          font-size: 2rem;
          font-weight: 800;
          color: white;
        }
        .logo-text .blue-accent {
          color: #3aa0ff;
        }
        .brand-desc {
          color: #9aa7ba;
          font-size: 0.95rem;
          line-height: 1.6;
          max-width: 320px;
        }
        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }
        .social-icon {
          color: #9aa7ba;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: 0.3s;
          padding: 5px 0;
          border-bottom: 1px solid transparent;
        }
        .social-icon:hover {
          color: #3aa0ff;
          border-bottom: 1px solid #3aa0ff;
        }

        /* Links Area */
        .footer-links-area {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .link-column h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: white;
          position: relative;
          display: inline-block;
        }
        .link-column h3::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 20px;
          height: 2px;
          background: #3aa0ff;
        }
        .link-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .link-column li {
          margin-bottom: 12px;
        }
        .link-column a {
          color: #9aa7ba;
          text-decoration: none;
          font-size: 0.9rem;
          transition: 0.3s;
          display: inline-block;
        }
        .link-column a:hover {
          color: white;
          transform: translateX(5px);
        }

        /* Bottom Bar */
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .bottom-left p {
          color: #6c7a89;
          font-size: 0.8rem;
        }
        .bottom-right {
          font-size: 1.6rem;
          color: #3aa0ff;
          line-height: 1;
          text-align: right;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }
          .footer-brand {
            align-items: center;
          }
          .brand-desc {
            max-width: 100%;
          }
          .social-links {
            justify-content: center;
          }
          .footer-links-area {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .link-column h3::after {
            left: 50%;
            transform: translateX(-50%);
          }
          .link-column ul {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
