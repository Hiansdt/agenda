import type {
  Contact,
  CreateContactProps,
} from "@/contacts/domain/entities/Contact";
import { IPaginatedResponse } from "@/core/domain/entities/api";

export interface IContactRepository {
  getContacts(
    page: number,
    pageSize: number,
    search: string,
  ): Promise<IPaginatedResponse<Contact>>;
  getContact(id: string): Promise<Contact | null>;
  createContact(contact: CreateContactProps): Promise<Contact>;
  editContact(contact: Contact): Promise<Contact>;
  deleteContact(id: string): Promise<void>;
}
