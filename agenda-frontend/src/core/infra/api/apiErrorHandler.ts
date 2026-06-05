import { toast } from "@heroui/react";

export function getApiErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function showApiErrorToast(error: unknown, fallback: string) {
  const message = getApiErrorMessage(error, fallback);

  toast.danger(message);

  return message;
}
