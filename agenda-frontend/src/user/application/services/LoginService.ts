import type { IUserRepository } from "@/user/application/ports/outbound/UserRepository";

export type LoginInput = Readonly<{
  email: string;
  password: string;
}>;

export class LoginService {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(input: LoginInput): Promise<void> {
    return this.userRepository.login(input);
  }
}
