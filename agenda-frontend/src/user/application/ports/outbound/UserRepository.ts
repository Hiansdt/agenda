import type { LoginInput } from "@/user/application/services/LoginService";
import type { RegisterInput } from "@/user/application/services/RegisterService";

export interface IUserRepository {
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  restoreSession(): Promise<void>;
  logout(): Promise<void>;
}
