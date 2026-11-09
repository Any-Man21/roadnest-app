// "use client";

// import { Envelope } from "@gravity-ui/icons";
// import {
//   Button,
//   Input,
//   Label,
//   ListBox,
//   Modal,
//   NumberField,
//   Surface,
//   TextArea,
//   TextField,
//   Select,
// } from "@heroui/react";
// import { CiEdit } from "react-icons/ci";

// export function EditCarDetails({ car }) {
//   const {
//     name,
//     pricePerDay,
//     type,
//     description,
//     imageUrl,
//     seats,
//     location,
//     status,
//   } = car;
//   const onSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData(e.currentTarget);
//     const updatedCar = Object.fromEntries(formData.entries());
//   };

//   return (
//     <Modal>
//       <Button variant="secondary">
//         Edit <CiEdit />
//       </Button>
//       <Modal.Backdrop>
//         <Modal.Container placement="auto">
//           <Modal.Dialog className="sm:max-w-md">
//             <Modal.CloseTrigger />
//             <Modal.Header>
//               <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
//                 <Envelope className="size-5" />
//               </Modal.Icon>
//               <Modal.Heading>Update you Car Details</Modal.Heading>
//             </Modal.Header>
//             <Modal.Body className="p-6">
//               <Surface variant="default">
//                 <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   {/* Car Name */}
//                   <TextField className="w-full" name="name" variant="secondary">
//                     <Label>Car Name</Label>
//                     <Input defaultValue={name} placeholder="e.g. BMW X5" />
//                   </TextField>

//                   {/* Daily Rent Price */}
//                   <NumberField
//                     className="w-full"
//                     name="pricePerDay"
//                     variant="secondary"
//                   >
//                     <Label>Daily Rent Price</Label>
//                     <NumberField.Group className="w-full">
//                       <NumberField.DecrementButton />
//                       <NumberField.Input placeholder="e.g. 120" />
//                       <NumberField.IncrementButton />
//                     </NumberField.Group>
//                   </NumberField>

//                   {/* Car Type Dropdown */}
//                   <Select
//                     className="w-full"
//                     name="type"
//                     variant="secondary"
//                     placeholder="Select car type"
//                   >
//                     <Label>Car Type</Label>
//                     <Select.Trigger>
//                       <Select.Value />
//                       <Select.Indicator />
//                     </Select.Trigger>
//                     <Select.Popover>
//                       <ListBox>
//                         {[
//                           "Sedan",
//                           "SUV",
//                           "Hatchback",
//                           "Sports",
//                           "Luxury",
//                           "Electric",
//                           "Van",
//                         ].map((t) => (
//                           <ListBox.Item key={t} id={t} textValue={t}>
//                             {t}
//                             <ListBox.ItemIndicator />
//                           </ListBox.Item>
//                         ))}
//                       </ListBox>
//                     </Select.Popover>
//                   </Select>

//                   {/* Image URL */}
//                   <TextField
//                     className="w-full"
//                     name="imageUrl"
//                     type="url"
//                     variant="secondary"
//                   >
//                     <Label>Image URL</Label>
//                     <Input placeholder="e.g. https://imgbb.com/..." />
//                   </TextField>

//                   {/* Seat Capacity */}
//                   <NumberField
//                     className="w-full"
//                     name="seats"
//                     variant="secondary"
//                   >
//                     <Label>Seat Capacity</Label>
//                     <NumberField.Group className="w-full">
//                       <NumberField.DecrementButton />
//                       <NumberField.Input placeholder="e.g. 5" />
//                       <NumberField.IncrementButton />
//                     </NumberField.Group>
//                   </NumberField>

//                   {/* Pickup Location */}
//                   <TextField
//                     className="w-full"
//                     name="location"
//                     variant="secondary"
//                   >
//                     <Label>Pickup Location</Label>
//                     <Input placeholder="e.g. Dhaka, Bangladesh" />
//                   </TextField>

//                   {/* Availability Status */}
//                   <Select
//                     className="w-full md:col-span-2"
//                     name="status"
//                     variant="secondary"
//                     placeholder="Select status"
//                   >
//                     <Label>Availability Status</Label>
//                     <Select.Trigger>
//                       <Select.Value />
//                       <Select.Indicator />
//                     </Select.Trigger>
//                     <Select.Popover>
//                       <ListBox>
//                         {[
//                           { id: "available", label: "Available" },
//                           { id: "unavailable", label: "Unavailable" },
//                           { id: "maintenance", label: "Under maintenance" },
//                         ].map((s) => (
//                           <ListBox.Item
//                             key={s.id}
//                             id={s.id}
//                             textValue={s.label}
//                           >
//                             {s.label}
//                             <ListBox.ItemIndicator />
//                           </ListBox.Item>
//                         ))}
//                       </ListBox>
//                     </Select.Popover>
//                   </Select>

//                   {/* Description */}
//                   <TextField
//                     className="w-full md:col-span-2"
//                     name="description"
//                     variant="secondary"
//                   >
//                     <Label>Description</Label>
//                     <TextArea
//                       rows={4}
//                       placeholder="Tell us about the car's features, condition, etc..."
//                     />
//                   </TextField>
//                 </form>
//               </Surface>
//             </Modal.Body>
//             <Modal.Footer>
//               <Button slot="close" variant="secondary">
//                 Cancel
//               </Button>
//               <Button slot="close">Send Message</Button>
//             </Modal.Footer>
//           </Modal.Dialog>
//         </Modal.Container>
//       </Modal.Backdrop>
//     </Modal>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const API_URL = "http://localhost:5000";

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

export function EditCarDetails({ car }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const updatedCar = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    );
    updatedCar.pricePerDay = Number(updatedCar.pricePerDay);
    updatedCar.seats = Number(updatedCar.seats);

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/cars/${car._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCar),
      });

      if (!res.ok)
        throw new Error("Couldn’t update the car. Please try again.");

      window.location.reload(); // reload the page data so the changes show instantly
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal>
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
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
                  <p className="text-sm text-red-400 md:col-span-2">{error}</p>
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
