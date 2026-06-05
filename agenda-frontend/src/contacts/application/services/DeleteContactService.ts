import type { IContactRepository } from "@/contacts/application/ports/outbound/ContactRepository";

export type DeleteContactInput = Readonly<{
  id: string;
}>;

export class DeleteContactService {
  constructor(private readonly contactRepository: IContactRepository) {}

  async execute(input: DeleteContactInput): Promise<void> {
    await this.contactRepository.deleteContact(input.id);
  }
}
