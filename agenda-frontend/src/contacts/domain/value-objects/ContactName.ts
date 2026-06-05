export class ContactName {
  private constructor(public readonly value: string) {}

  static create(value: string) {
    const normalized = value.trim().replace(/\s+/g, " ");

    if (!normalized) {
      throw new Error("O nome do contato é obrigatório.");
    }

    return new ContactName(normalized);
  }
}
