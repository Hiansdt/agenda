import type { IUserRepository } from "@/user/application/ports/outbound/UserRepository";
import type { LoginInput } from "@/user/application/services/LoginService";
import type { RegisterInput } from "@/user/application/services/RegisterService";
import { api } from "@/core/config/axios";

export class ApiUserRepository implements IUserRepository {
  async login(input: LoginInput): Promise<void> {
    await api.post("/users/login", input);
  }

  async register(input: RegisterInput): Promise<void> {
    await api.post("/users", input);
  }

  async restoreSession(): Promise<void> {
    await api.get("/users/me");
  }

  async logout(): Promise<void> {
    await api.post("/users/logout");
  }
}
