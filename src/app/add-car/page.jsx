"use client";

import { useRef, useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Label,
  ListBox,
  NumberField,
  Select,
  Spinner,
  TextArea,
  TextField,
  Input,
} from "@heroui/react";
import { Barlow } from "next/font/google";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CAR_TYPES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Sports",
  "Luxury",
  "Electric",
  "Van",
];

const STATUSES = [
  { id: "available", label: "Available" },
  { id: "unavailable", label: "Unavailable" },
  { id: "maintenance", label: "Under maintenance" },
];

/* Staggered entrance wrapper */
function Rise({ i = 0, className = "", children }) {
  return (
    <div
      className={`ac-rise ${className}`}
      style={{ "--d": `${0.1 + i * 0.07}s` }}
    >
      {children}
    </div>
  );
}

export default function AddCarPage() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null); // { type: "success" | "error", text }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const fd = new FormData(e.currentTarget);
    const car = Object.fromEntries(fd.entries());

    car.pricePerDay = Number(car.pricePerDay);
    car.seats = Number(car.seats);

    setLoading(true);
    setNotice(null);

    try {
      const res = await fetch("http://localhost:5000/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(car),
      });

      if (!res.ok) throw new Error("Couldn’t add the car. Please try again.");

      const data = await res.json();
      console.log(data); // { acknowledged: true, insertedId: "..." }

      setNotice({
        type: "success",
        text: "Your car is listed and ready for renters.",
      });
      formRef.current?.reset();
    } catch (err) {
      setNotice({
        type: "error",
        text:
          err instanceof TypeError
            ? "Can’t reach the server. Check that your backend is running."
            : err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`${barlow.className} relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-[#060b14] px-4 py-10 text-white sm:px-6 sm:py-14`}
    >
      {/* soft background glow */}
      <div
        aria-hidden="true"
        className="ac-glow pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[720px] max-w-[140vw] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-3xl">
        <Rise i={0}>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Add a New Car
          </h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            List your car and reach more renters.
          </p>
        </Rise>

        <Rise
          i={1}
          className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-8"
        >
          <Form
            ref={formRef}
            onSubmit={onSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <Rise i={2}>
              <TextField isRequired name="name" className="w-full">
                <Label>Car Name</Label>
                <Input placeholder="e.g. Toyota Corolla" />
                <FieldError />
              </TextField>
            </Rise>

            <Rise i={3}>
              <NumberField
                isRequired
                minValue={1}
                name="pricePerDay"
                className="w-full"
              >
                <Label>Daily Rent Price</Label>
                <NumberField.Group className="w-full">
                  <NumberField.DecrementButton />
                  <NumberField.Input placeholder="e.g. $45" />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <FieldError />
              </NumberField>
            </Rise>

            <Rise i={4}>
              <Select
                isRequired
                name="type"
                placeholder="Select car type"
                className="w-full"
              >
                <Label>Car Type</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {CAR_TYPES.map((t) => (
                      <ListBox.Item key={t} id={t} textValue={t}>
                        {t}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <FieldError />
              </Select>
            </Rise>

            <Rise i={5}>
              <TextField
                isRequired
                type="url"
                name="imageUrl"
                className="w-full"
              >
                <Label>Image URL</Label>
                <Input placeholder="e.g. https://i.ibb.co/car.jpg" />
                <FieldError />
              </TextField>
            </Rise>

            <Rise i={6}>
              <NumberField
                isRequired
                minValue={1}
                maxValue={20}
                name="seats"
                className="w-full"
              >
                <Label>Seat Capacity</Label>
                <NumberField.Group className="w-full">
                  <NumberField.DecrementButton />
                  <NumberField.Input placeholder="e.g. 5" />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <FieldError />
              </NumberField>
            </Rise>

            <Rise i={7}>
              <TextField isRequired name="location" className="w-full">
                <Label>Pickup Location</Label>
                <Input placeholder="e.g. Dhaka" />
                <FieldError />
              </TextField>
            </Rise>

            <Rise i={8} className="md:col-span-2">
              <TextField isRequired name="description" className="w-full">
                <Label>Description</Label>
                <TextArea
                  rows={4}
                  placeholder="Tell us about your car…"
                  className="w-full"
                />
                <FieldError />
              </TextField>
            </Rise>

            <Rise i={9}>
              <Select
                isRequired
                name="status"
                placeholder="Select status"
                className="w-full"
              >
                <Label>Availability Status</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {STATUSES.map((s) => (
                      <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                        {s.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <FieldError />
              </Select>
            </Rise>

            {/* Feedback */}
            {notice && (
              <div
                key={notice.text}
                role={notice.type === "error" ? "alert" : "status"}
                className={`ac-pop rounded-xl border px-4 py-3 text-sm md:col-span-2 ${
                  notice.type === "success"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    : "border-red-400/30 bg-red-400/10 text-red-200"
                }`}
              >
                {notice.text}
              </div>
            )}

            {/* Actions */}
            <Rise
              i={10}
              className="flex flex-col gap-3 sm:flex-row md:col-span-2"
            >
              <Button
                type="submit"
                variant="primary"
                isPending={loading}
                className="w-full sm:w-44"
              >
                {({ isPending }) => (
                  <>
                    {isPending && <Spinner size="sm" color="current" />}
                    {isPending ? "Adding…" : "Add Car"}
                  </>
                )}
              </Button>
              <Button
                type="reset"
                variant="secondary"
                isDisabled={loading}
                onPress={() => setNotice(null)}
                className="w-full sm:w-32"
              >
                Reset
              </Button>
            </Rise>
          </Form>
        </Rise>
      </div>

      <style jsx global>{`
        .ac-rise {
          animation: ac-rise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) var(--d, 0s)
            both;
        }
        .ac-pop {
          animation: ac-pop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
        }
        .ac-glow {
          animation: ac-breathe 8s ease-in-out infinite alternate;
        }
        @keyframes ac-rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes ac-pop {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes ac-breathe {
          from {
            opacity: 0.45;
          }
          to {
            opacity: 0.95;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ac-rise,
          .ac-pop,
          .ac-glow {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
