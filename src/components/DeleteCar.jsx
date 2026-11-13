"use client";

import { AlertDialog, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function DeleteCar({ car, onDeleted }) {
  const router = useRouter();
  const { name } = car;

  // delete logic
  const handleDelete = async () => {
    try {
      // JWT from Better Auth. The backend checks it with your JWKS.
      const { data: tokenData, error: tokenError } = await authClient.token();
      if (tokenError || !tokenData?.token) {
        throw new Error("Your session expired. Please log in again.");
      }

      const res = await fetch(`${API_URL}/cars/${car._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Your session expired. Please log in again.");
      }
      // 403 = not the owner. The server message says so.
      if (!res.ok) {
        throw new Error(data.message || "Couldn’t delete the car.");
      }

      toast.success(`${name} deleted.`);

      if (onDeleted) onDeleted();
      else router.push("/cars");
    } catch (err) {
      toast.error(
        err instanceof TypeError
          ? "Can’t reach the server. Check that your backend is running."
          : err.message,
      );
    }
  };

  return (
    <AlertDialog>
      <Button variant="outline" className="text-red-300">
        Delete
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Delete Car Permanently From Our Website?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                This will permanently delete <strong>{name}</strong> and all of
                its data. This action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button slot="close" variant="danger" onPress={handleDelete}>
                Terminate
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
