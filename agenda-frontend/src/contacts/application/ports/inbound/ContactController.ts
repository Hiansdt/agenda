import type { DeleteContactInput } from "@/contacts/application/services/DeleteContactService";
import type { CreateContactInput as ContactCreateInput } from "@/contacts/application/services/CreateContactService";
import type { GetContactInput } from "@/contacts/application/services/GetContactService";
import type { UpdateContactInput as ContactUpdateInput } from "@/contacts/application/services/UpdateContactService";
import type { Contact } from "@/contacts/domain/entities/Contact";
import type { IPagination } from "@/core/domain/entities/api";

export type ContactControllerStatus = "idle" | "loading" | "success" | "error";

export type ContactPagination = IPagination;

export type CreateContactInput = ContactCreateInput;
export type UpdateContactInput = ContactUpdateInput;

export type ContactControllerState = {
  contacts: Contact[];
  selectedContact: Contact | null;
  query: string;
  pagination: ContactPagination;
  status: ContactControllerStatus;
  error: string | null;
  listContacts(): Promise<void>;
  getContact(input: GetContactInput): Promise<void>;
  createContact(input: CreateContactInput): Promise<void>;
  updateContact(input: UpdateContactInput): Promise<void>;
  deleteContact(input: DeleteContactInput): Promise<void>;
  setQuery(query: string): void;
  setPagination(pagination: Partial<ContactPagination>): void;
  clearError(): void;
};
