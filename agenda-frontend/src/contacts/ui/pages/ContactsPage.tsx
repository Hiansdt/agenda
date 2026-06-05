"use client";

import { useEffect, useState } from "react";

import { useContactController } from "@/contacts/adapters/inbound/controllers/ContactController";
import type { Contact } from "@/contacts/domain/entities/Contact";
import {
  ContactForm,
  type ContactFormValues,
} from "@/contacts/ui/components/ContactForm";
import { ContactDeleteConfirmation } from "@/contacts/ui/components/ContactDeleteConfirmation";
import { ContactList } from "@/contacts/ui/components/ContactList";
import { ContactModal } from "@/contacts/ui/components/ContactModal";

export function ContactsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const {
    clearError,
    contacts,
    createContact,
    deleteContact,
    listContacts,
    pagination,
    pagination: { page, pageSize },
    query,
    setPagination,
    setQuery,
    status,
    updateContact,
  } = useContactController();
  const isModalOpen =
    isCreateOpen || Boolean(deletingContact) || Boolean(editingContact);
  const isLoading = status === "loading" && !isModalOpen;
  const isSubmitting = status === "loading" && isModalOpen;

  useEffect(() => {
    void listContacts();
  }, [listContacts, page, pageSize, query]);

  function openCreate() {
    clearError();
    setIsCreateOpen(true);
  }

  function openEdit(contact: Contact) {
    clearError();
    setEditingContact(contact);
  }

  function openDelete(contact: Contact) {
    clearError();
    setDeletingContact(contact);
  }

  function changePage(page: number) {
    clearError();
    setPagination({ page });
  }

  function closeModals() {
    clearError();
    setIsCreateOpen(false);
    setDeletingContact(null);
    setEditingContact(null);
  }

  async function submitCreate(values: ContactFormValues) {
    await createContact(values);

    if (useContactController.getState().status === "success") {
      setIsCreateOpen(false);
    }
  }

  async function submitEdit(values: ContactFormValues) {
    if (!editingContact) {
      return;
    }

    await updateContact({
      id: editingContact.id,
      ...values,
    });

    if (useContactController.getState().status === "success") {
      setEditingContact(null);
    }
  }

  async function submitDelete() {
    if (!deletingContact) {
      return;
    }

    await deleteContact({ id: deletingContact.id });

    if (useContactController.getState().status === "success") {
      setDeletingContact(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-zinc-950">
            Contatos
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Gerencie as pessoas na sua agenda.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Buscar
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950 sm:w-72"
              placeholder="Nome, email ou telefone"
            />
          </label>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Novo contato
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-600">Carregando contatos...</p>
      ) : (
        <ContactList
          contacts={contacts}
          onDelete={openDelete}
          onEdit={openEdit}
          onPageChange={changePage}
          pagination={pagination}
        />
      )}

      <ContactModal isOpen={isCreateOpen} onClose={closeModals}>
        <ContactForm
          isSubmitting={isSubmitting}
          mode="create"
          onCancel={closeModals}
          onSubmit={submitCreate}
        />
      </ContactModal>

      <ContactModal isOpen={Boolean(editingContact)} onClose={closeModals}>
        {editingContact ? (
          <ContactForm
            key={editingContact.id}
            contact={editingContact}
            isSubmitting={isSubmitting}
            mode="edit"
            onCancel={closeModals}
            onSubmit={submitEdit}
          />
        ) : null}
      </ContactModal>

      <ContactModal isOpen={Boolean(deletingContact)} onClose={closeModals}>
        {deletingContact ? (
          <ContactDeleteConfirmation
            contact={deletingContact}
            isSubmitting={isSubmitting}
            onCancel={closeModals}
            onConfirm={submitDelete}
          />
        ) : null}
      </ContactModal>
    </section>
  );
}
