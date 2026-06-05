import type { IContactRepository } from "@/contacts/application/ports/outbound/ContactRepository";
import type { Contact } from "@/contacts/domain/entities/Contact";

export type GetContactInput = Readonly<{
  id: string;
}>;

export class GetContactService {
  constructor(private readonly contactRepository: IContactRepository) {}

  execute(input: GetContactInput): Promise<Contact | null> {
    return this.contactRepository.getContact(input.id);
  }
}
