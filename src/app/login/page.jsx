"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Barlow } from "next/font/google";
import toast, { Toaster } from "react-hot-toast";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { authClient } from "@/lib/auth-client";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inputClass =
  "h-11 w-full rounded-lg border border-white/10 bg-[#0e1b30] px-3 text-sm text-white placeholder:text-slate-500";

const labelClass = "text-sm font-medium text-slate-200";

export default function LoginPage() {
  const router = useRouter();
  const passwordBox = useRef(null);

  // Show / hide password
  function togglePassword() {
    const input = passwordBox.current.querySelector("input");
    input.type = input.type === "password" ? "text" : "password";
  }

  // Login with email + password
  async function handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { error } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
    });

    if (error) {
      toast.error(error.message || "Invalid email or password.");
      return;
    }

    toast.success("Logged in successfully!");
    setTimeout(() => router.push("/"), 1200);
  }

  // Continue with Google
  async function handleGoogle() {
    // TODO: Google sign-in logic here
    await authClient.signIn.social({
      provider: "google",
    });
  }

  return (
    <>
      {/* Outside <main> so the navbar can't cover it. Centered pop-up. */}
      <Toaster
        position="top-center"
        containerStyle={{ top: "42%" }}
        toastOptions={{
          style: {
            background: "#0a1424",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "16px 24px",
            fontSize: "1rem",
            borderRadius: "14px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          },
        }}
      />

      <main
        className={`${barlow.className} relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a1230] via-[#2b2552] to-[#e0804a] px-4 pb-24 pt-10 sm:pb-28`}
      >
        {/* Mountains */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-14 -z-10 h-40 w-full sm:h-56"
        >
          <path
            fill="#1a1f45"
            d="M0 140 L100 60 L190 120 L300 30 L420 130 L540 70 L660 125 L800 50 L800 200 L0 200 Z"
          />
          <path
            fill="#0b1226"
            d="M0 170 L120 110 L230 160 L360 100 L500 165 L640 120 L800 170 L800 200 L0 200 Z"
          />
        </svg>

        {/* Road + driving car */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-14 bg-[#070b14]"
        >
          <div className="rg-dashes absolute inset-x-0 top-1/2 h-[3px]" />
          <div className="rg-car absolute bottom-6 left-0 w-28 sm:w-36">
            <svg viewBox="0 0 120 40" className="h-auto w-full">
              <path
                d="M6 28 L6 22 Q6 19 10 18 L28 15 L38 7 Q40 5 44 5 L78 5 Q82 5 85 8 L92 15 L108 18 Q114 19 114 24 L114 28 Z"
                fill="#1f6fe0"
              />
              <path d="M42 7 L56 7 L56 15 L33 15 Z" fill="#cfe6ff" />
              <path d="M60 7 L78 7 L88 15 L60 15 Z" fill="#cfe6ff" />
              <rect
                x="108"
                y="20"
                width="6"
                height="3"
                rx="1.5"
                fill="#ffe08a"
              />
              <g transform="translate(30 29)">
                <g className="rg-wheel">
                  <circle r="8" fill="#05070d" />
                  <circle r="3.5" fill="#9fb0c8" />
                  <path d="M-8 0 H8" stroke="#05070d" strokeWidth="1.5" />
                </g>
              </g>
              <g transform="translate(92 29)">
                <g className="rg-wheel">
                  <circle r="8" fill="#05070d" />
                  <circle r="3.5" fill="#9fb0c8" />
                  <path d="M-8 0 H8" stroke="#05070d" strokeWidth="1.5" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Width wrapper */}
        <div className="w-full max-w-md sm:max-w-lg">
          {/* Intro */}
          <div className="rg-card mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              Rent. Drive. Explore.
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              Good to see you again
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-300 sm:text-base">
              Log in to manage your bookings, your listed cars, and your next
              trip.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1">
                My bookings
              </span>
              <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1">
                My added cars
              </span>
              <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1">
                24/7 support
              </span>
            </div>
          </div>

          {/* Card */}
          <div className="rg-card w-full rounded-3xl border border-white/10 bg-[#0a1424]/85 p-5 shadow-2xl shadow-black/50 backdrop-blur sm:p-8 lg:p-10">
            <h1 className="text-center text-2xl font-bold text-white">
              Welcome Back
            </h1>
            <p className="mt-1 text-center text-sm text-slate-400">
              Log in to RoadNest
            </p>

            <Form onSubmit={handleLogin} className="mt-6 grid gap-4">
              <TextField
                isRequired
                name="email"
                type="email"
                className="w-full"
              >
                <Label className={labelClass}>Email address</Label>
                <Input placeholder="you@example.com" className={inputClass} />
                <FieldError />
              </TextField>

              <TextField
                isRequired
                name="password"
                type="password"
                className="w-full"
              >
                <Label className={labelClass}>Password</Label>
                <div ref={passwordBox} className="relative">
                  <Input
                    placeholder="Your password"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    aria-label="Show or hide password"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                <FieldError />
              </TextField>

              <Button
                type="submit"
                variant="primary"
                className="h-11 w-full rounded-lg bg-[#1f8fff] text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:brightness-110 active:scale-[0.98]"
              >
                Login
              </Button>
            </Form>

            <p className="my-5 text-center text-xs text-slate-400">
              or Log In with
            </p>

            <button
              type="button"
              onClick={handleGoogle}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-slate-800 transition hover:bg-slate-100 active:scale-[0.98] hover:shadow-lg hover:shadow-slate-200/30 hover:cursor-pointer"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#FFC107"
                  d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"
                />
              </svg>
              Google
            </button>

            <p className="mt-5 text-center text-sm text-slate-400">
              New to RoadNest?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-400 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        <style jsx global>{`
          .rg-card {
            animation: rg-rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
          }
          .rg-car {
            animation: rg-drive 14s linear infinite;
          }
          .rg-wheel {
            transform-box: fill-box;
            transform-origin: center;
            animation: rg-spin 0.5s linear infinite;
          }
          .rg-dashes {
            background-image: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.6) 0 40px,
              transparent 40px
            );
            background-size: 80px 100%;
            animation: rg-road 1s linear infinite;
          }
          @keyframes rg-rise {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: none;
            }
          }
          @keyframes rg-drive {
            from {
              transform: translateX(-30vw);
            }
            to {
              transform: translateX(110vw);
            }
          }
          @keyframes rg-spin {
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes rg-road {
            to {
              background-position-x: -80px;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .rg-card,
            .rg-car,
            .rg-wheel,
            .rg-dashes {
              animation: none;
            }
          }
        `}</style>
      </main>
    </>
  );
}
