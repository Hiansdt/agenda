import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";

import type { Contact } from "@/contacts/domain/entities/Contact";
import type { ContactPagination } from "@/contacts/application/ports/inbound/ContactController";
import { EmptyState } from "@/core/ui/components/EmptyState";

type ContactListProps = Readonly<{
  contacts: Contact[];
  onDelete(contact: Contact): void;
  onEdit(contact: Contact): void;
  onPageChange(page: number): void;
  pagination: ContactPagination;
}>;

export function ContactList({
  contacts,
  onDelete,
  onEdit,
  onPageChange,
  pagination,
}: ContactListProps) {
  if (!contacts.length) {
    return (
      <EmptyState
        title="Nenhum contato encontrado"
        description="Crie um contato ou ajuste a busca atual."
      />
    );
  }

  const canGoBack = pagination.page > 1;
  const canGoForward = pagination.page < pagination.numPages;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div>
        {contacts.map((contact) => (
          <article
            key={contact.id}
            className="grid gap-3 border-b border-zinc-100 px-3 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="min-w-0">
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                <div className="truncate text-sm font-medium text-zinc-950">
                  {contact.name}
                </div>
                {contact.observations ? (
                  <div className="line-clamp-1 text-xs text-zinc-500">
                    {contact.observations}
                  </div>
                ) : null}
              </div>
              <dl className="mt-1 grid gap-x-4 gap-y-0.5 text-xs text-zinc-600 sm:grid-cols-3">
                <div className="min-w-0">
                  <dt className="sr-only">Email</dt>
                  <dd className="truncate">{contact.email ?? "Sem email"}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="sr-only">Telefone</dt>
                  <dd className="truncate">
                    {contact.phone ?? "Sem telefone"}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="sr-only">Endereço</dt>
                  <dd className="truncate">
                    {contact.address ?? "Sem endereço"}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="flex gap-1.5 sm:justify-end">
              <button
                type="button"
                onClick={() => onEdit(contact)}
                aria-label="Editar contato"
                title="Editar contato"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(contact)}
                aria-label="Excluir contato"
                title="Excluir contato"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-zinc-100 px-3 py-2.5 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Página {pagination.page} de {pagination.numPages} ·{" "}
          {pagination.total} contatos
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={!canGoBack}
            className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Anterior
          </button>
          <button
            type="button"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={!canGoForward}
            className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
