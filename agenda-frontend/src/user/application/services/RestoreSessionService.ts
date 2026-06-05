import type { IUserRepository } from "@/user/application/ports/outbound/UserRepository";

export class RestoreSessionService {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(): Promise<void> {
    return this.userRepository.restoreSession();
  }
}
