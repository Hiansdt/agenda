import type { IContactRepository } from "@/contacts/application/ports/outbound/ContactRepository";
import type { IPaginatedResponse } from "@/core/domain/entities/api";
import type { Contact } from "@/contacts/domain/entities/Contact";

export type ListContactsInput = Readonly<{
  page?: number;
  pageSize?: number;
  query?: string;
}>;

export class ListContactsService {
  constructor(private readonly contactRepository: IContactRepository) {}

  execute(input: ListContactsInput = {}): Promise<IPaginatedResponse<Contact>> {
    return this.contactRepository.getContacts(
      input.page ?? 1,
      input.pageSize ?? 10,
      input.query ?? "",
    );
  }
}
