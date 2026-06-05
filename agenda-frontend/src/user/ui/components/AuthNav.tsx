"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/core/config/routes";
import { useUserController } from "@/user/adapters/inbound/controllers/UserController";

export function AuthNav() {
  const router = useRouter();
  const { isAuthenticated, isHydrating, logout, status } = useUserController();
  const isLoading = status === "loading";

  async function handleLogout() {
    await logout();

    if (!useUserController.getState().isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }

  if (isHydrating) {
    return (
      <span className="inline-flex h-9 items-center text-sm text-zinc-500">
        Verificando sessão...
      </span>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Link href={APP_ROUTES.login}>Entrar</Link>
        <Link href={APP_ROUTES.register}>Criar conta</Link>
      </>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-emerald-500"
        />
        Conectado
      </span>
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={isLoading}
        className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Saindo..." : "Sair"}
      </button>
    </div>
  );
}
