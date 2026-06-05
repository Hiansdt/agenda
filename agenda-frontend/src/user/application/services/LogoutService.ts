import type { IUserRepository } from "@/user/application/ports/outbound/UserRepository";

export class LogoutService {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(): Promise<void> {
    return this.userRepository.logout();
  }
}
