"use client";

import { useEffect } from "react";

type ContactModalProps = Readonly<{
  children: React.ReactNode;
  isOpen: boolean;
  onClose(): void;
}>;

export function ContactModal({ children, isOpen, onClose }: ContactModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-zinc-950/40 p-4"
      role="dialog"
    >
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-5 shadow-xl">
        {children}
      </div>
    </div>
  );
}
