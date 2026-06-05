"use client";

import { create } from "zustand";

import { CreateContactService } from "@/contacts/application/services/CreateContactService";
import { DeleteContactService } from "@/contacts/application/services/DeleteContactService";
import { GetContactService } from "@/contacts/application/services/GetContactService";
import { ListContactsService } from "@/contacts/application/services/ListContactsService";
import { UpdateContactService } from "@/contacts/application/services/UpdateContactService";
import type {
  ContactControllerState,
  ContactPagination,
  CreateContactInput,
  UpdateContactInput,
} from "@/contacts/application/ports/inbound/ContactController";
import type { IContactRepository } from "@/contacts/application/ports/outbound/ContactRepository";
import { container } from "@/core/di/container";
import { DI_TOKENS } from "@/core/di/tokens";
import { showApiErrorToast } from "@/core/infra/api/apiErrorHandler";

const contactRepository = container.resolve<IContactRepository>(
  DI_TOKENS.ContactRepository,
);
const listContactsService = new ListContactsService(contactRepository);
const getContactService = new GetContactService(contactRepository);
const createContactService = new CreateContactService(contactRepository);
const updateContactService = new UpdateContactService(contactRepository);
const deleteContactService = new DeleteContactService(contactRepository);

const initialPagination: ContactPagination = {
  page: 1,
  pageSize: 10,
  numPages: 1,
  total: 0,
};

export const useContactController = create<ContactControllerState>(
  (set, get) => ({
    contacts: [],
    selectedContact: null,
    query: "",
    pagination: initialPagination,
    status: "idle",
    error: null,

    async listContacts() {
      const { query, pagination } = get();

      set({ status: "loading", error: null });

      try {
        const data = await listContactsService.execute({
          page: pagination.page,
          pageSize: pagination.pageSize,
          query,
        });

        set({
          contacts: data.items,
          pagination: {
            page: data.page,
            pageSize: data.pageSize,
            numPages: data.numPages,
            total: data.total,
          },
          status: "success",
        });
      } catch (error) {
        const message = showApiErrorToast(
          error,
          "Não foi possível carregar os contatos.",
        );

        set({
          error: message,
          status: "error",
        });
      }
    },

    async getContact(input) {
      set({ status: "loading", error: null });

      try {
        const selectedContact = await getContactService.execute(input);
        set({ selectedContact, status: "success" });
      } catch (error) {
        const message = showApiErrorToast(
          error,
          "Não foi possível carregar o contato.",
        );

        set({
          error: message,
          selectedContact: null,
          status: "error",
        });
      }
    },

    async createContact(input: CreateContactInput) {
      set({ status: "loading", error: null });

      try {
        const contact = await createContactService.execute(input);
        set({ selectedContact: contact, status: "success" });
        await get().listContacts();
      } catch (error) {
        const message = showApiErrorToast(
          error,
          "Não foi possível criar o contato.",
        );

        set({
          error: message,
          status: "error",
        });
      }
    },
    async updateContact(input: UpdateContactInput) {
      set({ status: "loading", error: null });

      try {
        const contact = await updateContactService.execute(input);
        set({ selectedContact: contact, status: "success" });
        await get().listContacts();
      } catch (error) {
        const message = showApiErrorToast(
          error,
          "Não foi possível atualizar o contato.",
        );

        set({
          error: message,
          status: "error",
        });
      }
    },
    async deleteContact(input) {
      set({ status: "loading", error: null });

      try {
        await deleteContactService.execute(input);
        set((state) => ({
          selectedContact:
            state.selectedContact?.id === input.id
              ? null
              : state.selectedContact,
          status: "success",
        }));
        await get().listContacts();
      } catch (error) {
        const message = showApiErrorToast(
          error,
          "Não foi possível excluir o contato.",
        );

        set({
          error: message,
          status: "error",
        });
      }
    },
    setQuery(query) {
      set((state) => ({
        query,
        pagination: {
          ...state.pagination,
          page: 1,
        },
      }));
    },
    setPagination(pagination) {
      set((state) => ({
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }));
    },
    clearError() {
      set({ error: null });
    },
  }),
);
