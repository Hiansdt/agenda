import type { IContactRepository } from "@/contacts/application/ports/outbound/ContactRepository";
import { Contact, type ContactProps } from "@/contacts/domain/entities/Contact";

export type UpdateContactInput = ContactProps;

export class UpdateContactService {
  constructor(private readonly contactRepository: IContactRepository) {}

  async execute(input: UpdateContactInput): Promise<Contact> {
    const contact = Contact.create(input);
    return this.contactRepository.editContact(contact);
  }
}
