import type { IContactRepository } from "@/contacts/application/ports/outbound/ContactRepository";
import type {
  Contact,
  CreateContactProps,
} from "@/contacts/domain/entities/Contact";

export type CreateContactInput = CreateContactProps;

export class CreateContactService {
  constructor(private readonly contactRepository: IContactRepository) {}

  execute(input: CreateContactInput): Promise<Contact> {
    return this.contactRepository.createContact(input);
  }
}
