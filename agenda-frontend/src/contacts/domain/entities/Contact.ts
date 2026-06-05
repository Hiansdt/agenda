import { ContactName } from "@/contacts/domain/value-objects/ContactName";

export type ContactProps = Readonly<{
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  observations?: string;
}>;

export type CreateContactProps = Omit<ContactProps, "id">;

export class Contact {
  private constructor(private readonly props: ContactProps) {}

  static create(props: ContactProps) {
    const name = ContactName.create(props.name);

    return new Contact({
      ...props,
      name: name.value,
      email: props.email?.trim() || undefined,
      phone: props.phone?.trim() || undefined,
      address: props.address?.trim() || undefined,
      observations: props.observations?.trim() || undefined,
    });
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get phone() {
    return this.props.phone;
  }

  get address() {
    return this.props.address;
  }

  get observations() {
    return this.props.observations;
  }

  toPrimitives(): ContactProps {
    return this.props;
  }
}
