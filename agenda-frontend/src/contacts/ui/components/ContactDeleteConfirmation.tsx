"use client";

import type { Contact } from "@/contacts/domain/entities/Contact";

type ContactDeleteConfirmationProps = Readonly<{
  contact: Contact;
  isSubmitting: boolean;
  onCancel(): void;
  onConfirm(): Promise<void>;
}>;

export function ContactDeleteConfirmation({
  contact,
  isSubmitting,
  onCancel,
  onConfirm,
}: ContactDeleteConfirmationProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-950">
          Excluir contato
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Tem certeza que deseja excluir <strong>{contact.name}</strong>? Essa
          ação não pode ser desfeita.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-950"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => void onConfirm()}
          disabled={isSubmitting}
          className="h-10 cursor-pointer rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
        >
          {isSubmitting ? "Excluindo..." : "Excluir"}
        </button>
      </div>
    </section>
  );
}
