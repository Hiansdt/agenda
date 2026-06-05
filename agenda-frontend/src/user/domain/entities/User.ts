export type UserProps = Readonly<{
  id: string;
  name: string;
  email: string;
}>;

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps) {
    if (!props.email.includes("@")) {
      throw new Error("Informe um email de usuário válido.");
    }

    return new User({
      ...props,
      name: props.name.trim(),
      email: props.email.trim().toLowerCase(),
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

  toPrimitives(): UserProps {
    return this.props;
  }
}
