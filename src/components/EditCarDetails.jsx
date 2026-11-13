"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Button,
  Form,
  Input,
  Label,
  ListBox,
  Modal,
  NumberField,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import { CiEdit } from "react-icons/ci";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export function EditCarDetails({ car, onUpdated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const updatedCar = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    );
    updatedCar.pricePerDay = Number(updatedCar.pricePerDay);
    updatedCar.seats = Number(updatedCar.seats);

    setSaving(true);
    setError("");

    try {
      // JWT from Better Auth. The backend checks it with your JWKS.
      const { data: tokenData, error: tokenError } = await authClient.token();
      if (tokenError || !tokenData?.token) {
        throw new Error("Your session expired. Please log in again.");
      }

      const res = await fetch(`${API_URL}/cars/${car._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(updatedCar),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Your session expired. Please log in again.");
      }
      // 403 = not the owner. The server message says so.
      if (!res.ok) {
        throw new Error(
          data.message || "Couldn’t update the car. Please try again.",
        );
      }

      toast.success("Car updated.");
      setIsOpen(false);

      if (onUpdated) onUpdated(updatedCar);
      else window.location.reload();
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Can’t reach the server. Check that your backend is running."
          : err.message,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal>
      <Button
        variant="secondary"
        onPress={() => {
          setError("");
          setIsOpen(true);
        }}
      >
        Update <CiEdit />
      </Button>

      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-2xl">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>Update Your Car Details</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="p-6">
              <Form
                id="edit-car-form"
                onSubmit={onSubmit}
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >
                <TextField
                  isRequired
                  name="name"
                  defaultValue={car.name}
                  className="w-full"
                >
                  <Label>Car Name</Label>
                  <Input placeholder="e.g. BMW X5" />
                </TextField>

                <NumberField
                  isRequired
                  minValue={1}
                  name="pricePerDay"
                  defaultValue={Number(car.pricePerDay)}
                  className="w-full"
                >
                  <Label>Daily Rent Price</Label>
                  <NumberField.Group className="w-full">
                    <NumberField.DecrementButton />
                    <NumberField.Input placeholder="e.g. 120" />
                    <NumberField.IncrementButton />
                  </NumberField.Group>
                </NumberField>

                <Select
                  isRequired
                  name="type"
                  defaultValue={car.type}
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
                </Select>

                <TextField
                  isRequired
                  type="url"
                  name="imageUrl"
                  defaultValue={car.imageUrl}
                  className="w-full"
                >
                  <Label>Image URL</Label>
                  <Input placeholder="e.g. https://i.ibb.co/car.jpg" />
                </TextField>

                <NumberField
                  isRequired
                  minValue={1}
                  maxValue={20}
                  name="seats"
                  defaultValue={Number(car.seats)}
                  className="w-full"
                >
                  <Label>Seat Capacity</Label>
                  <NumberField.Group className="w-full">
                    <NumberField.DecrementButton />
                    <NumberField.Input placeholder="e.g. 5" />
                    <NumberField.IncrementButton />
                  </NumberField.Group>
                </NumberField>

                <TextField
                  isRequired
                  name="location"
                  defaultValue={car.location}
                  className="w-full"
                >
                  <Label>Pickup Location</Label>
                  <Input placeholder="e.g. Dhaka" />
                </TextField>

                <Select
                  isRequired
                  name="status"
                  defaultValue={car.status}
                  placeholder="Select status"
                  className="w-full md:col-span-2"
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
                </Select>

                <TextField
                  isRequired
                  name="description"
                  defaultValue={car.description}
                  className="w-full md:col-span-2"
                >
                  <Label>Description</Label>
                  <TextArea rows={4} placeholder="Tell us about the car…" />
                </TextField>

                {error && (
                  <p
                    role="alert"
                    className="text-sm text-red-400 md:col-span-2"
                  >
                    {error}
                  </p>
                )}
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button slot="close" variant="secondary">
                Cancel
              </Button>
              <Button type="submit" form="edit-car-form" isPending={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
