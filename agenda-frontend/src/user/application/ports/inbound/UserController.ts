import type { LoginInput } from "@/user/application/services/LoginService";
import type { RegisterInput } from "@/user/application/services/RegisterService";

export type UserControllerStatus = "idle" | "loading" | "success" | "error";

export type UserControllerState = {
  isAuthenticated: boolean;
  isHydrating: boolean;
  status: UserControllerStatus;
  error: string | null;
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  restoreSession(): Promise<void>;
  logout(): Promise<void>;
  clearError(): void;
};
