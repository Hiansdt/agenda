import type { IUserRepository } from "@/user/application/ports/outbound/UserRepository";

export type RegisterInput = Readonly<{
  name: string;
  email: string;
  password: string;
}>;

export class RegisterService {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(input: RegisterInput): Promise<void> {
    return this.userRepository.register(input);
  }
}
