"use client";

import { create } from "zustand";

import type { IUserRepository } from "@/user/application/ports/outbound/UserRepository";
import type { LoginInput } from "@/user/application/services/LoginService";
import { LoginService } from "@/user/application/services/LoginService";
import { LogoutService } from "@/user/application/services/LogoutService";
import type { RegisterInput } from "@/user/application/services/RegisterService";
import { RegisterService } from "@/user/application/services/RegisterService";
import { RestoreSessionService } from "@/user/application/services/RestoreSessionService";
import type { UserControllerState } from "@/user/application/ports/inbound/UserController";
import { container } from "@/core/di/container";
import { DI_TOKENS } from "@/core/di/tokens";

const userRepository = container.resolve<IUserRepository>(DI_TOKENS.AuthRepository);
const loginService = new LoginService(userRepository);
const registerService = new RegisterService(userRepository);
const restoreSessionService = new RestoreSessionService(userRepository);
const logoutService = new LogoutService(userRepository);

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const useUserController = create<UserControllerState>((set) => ({
  isAuthenticated: false,
  isHydrating: true,
  status: "idle",
  error: null,
  async login(input: LoginInput) {
    set({ status: "loading", error: null });

    try {
      await loginService.execute(input);
      set({
        isAuthenticated: true,
        status: "success",
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Não foi possível entrar."),
        isAuthenticated: false,
        status: "error",
      });
    }
  },
  async register(input: RegisterInput) {
    set({ status: "loading", error: null });

    try {
      await registerService.execute(input);
      await loginService.execute({
        email: input.email,
        password: input.password,
      });
      set({
        isAuthenticated: true,
        status: "success",
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Não foi possível criar a conta."),
        isAuthenticated: false,
        status: "error",
      });
    }
  },
  async restoreSession() {
    set({ isHydrating: true, status: "loading", error: null });

    try {
      await restoreSessionService.execute();
      set({
        isAuthenticated: true,
        isHydrating: false,
        status: "success",
      });
    } catch {
      set({
        error: null,
        isAuthenticated: false,
        isHydrating: false,
        status: "idle",
      });
    }
  },
  async logout() {
    set({ status: "loading", error: null });

    try {
      await logoutService.execute();
      set({
        isAuthenticated: false,
        isHydrating: false,
        status: "success",
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Não foi possível sair."),
        status: "error",
      });
    }
  },
  clearError() {
    set({ error: null });
  },
}));
