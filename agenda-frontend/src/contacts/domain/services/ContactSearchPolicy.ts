import { Contact } from "@/contacts/domain/entities/Contact";

export class ContactSearchPolicy {
  matches(contact: Contact, query: string) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    const searchable = [
      contact.name,
      contact.email ?? "",
      contact.phone ?? "",
      contact.address ?? "",
      contact.observations ?? "",
    ].join(" ");

    return searchable.toLowerCase().includes(normalizedQuery);
  }
}
