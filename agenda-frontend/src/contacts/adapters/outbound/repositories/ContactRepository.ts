import type { AxiosInstance } from "axios";

import { IPaginatedResponse } from "@/core/domain/entities/api";
import { IContactRepository } from "@/contacts/application/ports/outbound/ContactRepository";
import {
  Contact,
  type ContactProps,
  type CreateContactProps,
} from "@/contacts/domain/entities/Contact";

export class ContactRepository implements IContactRepository {
  constructor(private readonly api: AxiosInstance) {}

  async getContacts(
    page: number,
    pageSize: number,
    search: string,
  ): Promise<IPaginatedResponse<Contact>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      search: String(search),
    });

    const { data } = await this.api.get(`/contacts/?${params.toString()}`);
    return {
      ...data,
      items: data.items.map((contact: ContactProps) => Contact.create(contact)),
    };
  }

  async getContact(id: string): Promise<Contact | null> {
    try {
      const { data } = await this.api.get<ContactProps>(`/contacts/${id}/`);
      return Contact.create(data);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "status" in error.response &&
        error.response.status === 404
      ) {
        return null;
      }

      throw error;
    }
  }

  async createContact(contact: CreateContactProps): Promise<Contact> {
    const { data } = await this.api.post<ContactProps>(`/contacts`, contact);
    return Contact.create(data);
  }

  async deleteContact(id: string): Promise<void> {
    await this.api.delete(`/contacts/${id}/`);
  }

  async editContact(contact: Contact): Promise<Contact> {
    const { data } = await this.api.patch<ContactProps>(
      `/contacts/${contact.id}/`,
      contact.toPrimitives(),
    );
    return Contact.create(data);
  }
}
