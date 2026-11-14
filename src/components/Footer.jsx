"use client";

import Link from "next/link";
import { Barlow, Caveat } from "next/font/google";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
});

const CURRENT_YEAR = "2026";

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
  return (
    <footer className={`rn-footer ${barlow.className}`}>
      <div className="footer-main">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              Road<span className="blue-accent">Nest</span>
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

          {/* Footer links */}
          <div className="footer-links-area">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div className="link-column" key={title}>
                <h3>{title.charAt(0).toUpperCase() + title.slice(1)}</h3>
                <ul>
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">
            © {CURRENT_YEAR} RoadNest Luxury Rentals. All rights reserved.
          </p>

          <div className={`footer-slogan ${caveat.className}`}>
            Drive More, Worry Less.
          </div>
        </div>
      </div>

      <style jsx global>{`
        .rn-footer {
          display: block;
          position: relative;
          width: 100%;
          height: auto !important;
          min-height: 0 !important;
          flex: 0 0 auto !important;
          margin: 0;
          padding: 52px 0 24px;
          background: #05080f;
          color: #fff;
          border-top: 1px solid rgba(120, 160, 220, 0.1);
          box-sizing: border-box;
        }

        .rn-footer *,
        .rn-footer *::before,
        .rn-footer *::after {
          box-sizing: border-box;
        }

        .rn-footer .footer-main {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .rn-footer .footer-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 2fr);
          align-items: start;
          gap: 60px;
          margin-bottom: 40px;
        }

        .rn-footer .footer-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          min-width: 0;
        }

        .rn-footer .footer-logo {
          color: #fff;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          text-decoration: none;
        }

        .rn-footer .blue-accent {
          color: #3aa0ff;
        }

        .rn-footer .brand-desc {
          max-width: 320px;
          margin: 0;
          color: #9aa7ba;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .rn-footer .social-links {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 4px;
        }

        .rn-footer .social-icon {
          padding: 4px 0;
          color: #9aa7ba;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: 0.25s ease;
        }

        .rn-footer .social-icon:hover {
          color: #3aa0ff;
          border-color: #3aa0ff;
        }

        .rn-footer .footer-links-area {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 30px;
          min-width: 0;
        }

        .rn-footer .link-column h3 {
          position: relative;
          display: inline-block;
          margin: 0 0 22px;
          color: #fff;
          font-size: 1.05rem;
          font-weight: 700;
          text-transform: capitalize;
        }

        .rn-footer .link-column h3::after {
          content: "";
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 20px;
          height: 2px;
          background: #3aa0ff;
        }

        .rn-footer .link-column ul {
          display: flex;
          flex-direction: column;
          gap: 13px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .rn-footer .link-column li {
          margin: 0;
        }

        .rn-footer .link-column a {
          display: inline-block;
          color: #9aa7ba;
          font-size: 0.9rem;
          line-height: 1.5;
          text-decoration: none;
          transition: 0.25s ease;
        }

        .rn-footer .link-column a:hover {
          color: #fff;
          transform: translateX(4px);
        }

        .rn-footer .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .rn-footer .copyright {
          margin: 0;
          color: #6c7a89;
          font-size: 0.8rem;
          line-height: 1.6;
        }

        .rn-footer .footer-slogan {
          color: #3aa0ff;
          font-size: 1.7rem;
          line-height: 1.2;
          text-align: right;
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .rn-footer {
            padding: 42px 0 22px;
          }

          .rn-footer .footer-grid {
            grid-template-columns: 1fr;
            gap: 34px;
            margin-bottom: 34px;
          }

          .rn-footer .footer-brand {
            align-items: center;
            text-align: center;
          }

          .rn-footer .brand-desc {
            max-width: 420px;
          }

          .rn-footer .social-links {
            justify-content: center;
          }

          .rn-footer .footer-links-area {
            gap: 20px;
          }

          .rn-footer .link-column {
            text-align: center;
          }

          .rn-footer .link-column h3::after {
            left: 50%;
            transform: translateX(-50%);
          }

          .rn-footer .link-column ul {
            align-items: center;
          }
        }

        @media (max-width: 560px) {
          .rn-footer .footer-main {
            padding: 0 18px;
          }

          .rn-footer .footer-links-area {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            row-gap: 28px;
          }

          .rn-footer .link-column:last-child {
            grid-column: 1 / -1;
          }

          .rn-footer .footer-bottom {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .rn-footer .footer-slogan {
            font-size: 1.6rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
