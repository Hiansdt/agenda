"use client";

import { useState } from "react";

import type { Contact } from "@/contacts/domain/entities/Contact";

export type ContactFormValues = Readonly<{
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  observations?: string;
}>;

type ContactFormProps = Readonly<{
  contact?: Contact;
  error: string | null;
  isSubmitting: boolean;
  mode: "create" | "edit";
  onCancel(): void;
  onSubmit(values: ContactFormValues): Promise<void>;
}>;

function normalizeOptional(value: string) {
  const normalized = value.trim();

  return normalized || undefined;
}

export function ContactForm({
  contact,
  error,
  isSubmitting,
  mode,
  onCancel,
  onSubmit,
}: ContactFormProps) {
  const [name, setName] = useState(contact?.name ?? "");
  const [email, setEmail] = useState(contact?.email ?? "");
  const [phone, setPhone] = useState(contact?.phone ?? "");
  const [address, setAddress] = useState(contact?.address ?? "");
  const [observations, setObservations] = useState(
    contact?.observations ?? "",
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const title = mode === "create" ? "Novo contato" : "Editar contato";
  const submitLabel =
    mode === "create" ? "Criar contato" : "Salvar alterações";
  const loadingLabel =
    mode === "create" ? "Criando contato..." : "Salvando alterações...";

  async function submit() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setValidationError("Informe o nome do contato.");
      return;
    }

    setValidationError(null);

    await onSubmit({
      name: trimmedName,
      email: normalizeOptional(email),
      phone: normalizeOptional(phone),
      address: normalizeOptional(address),
      observations: normalizeOptional(observations),
    });
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Preencha os dados do contato.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <label className="block text-sm font-medium text-zinc-700">
          Nome
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
            required
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Telefone
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            type="tel"
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Endereço
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Observações
          <textarea
            value={observations}
            onChange={(event) => setObservations(event.target.value)}
            className="mt-1 min-h-24 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          />
        </label>

        {validationError ? (
          <p className="text-sm text-red-600">{validationError}</p>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-950"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 cursor-pointer rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isSubmitting ? loadingLabel : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
