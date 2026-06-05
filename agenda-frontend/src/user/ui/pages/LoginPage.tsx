"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { APP_ROUTES } from "@/core/config/routes";
import { useUserController } from "@/user/adapters/inbound/controllers/UserController";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, login, status } = useUserController();
  const isSubmitting = status === "loading";

  async function submit() {
    await login({ email, password });

    if (useUserController.getState().isAuthenticated) {
      router.push(APP_ROUTES.home);
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">Entrar</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Informe suas credenciais para acessar sua agenda.
        </p>
      </div>

      <form
        className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <label className="block text-sm font-medium text-zinc-700">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
            required
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Senha
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
            required
          />
        </label>
        <button
          type="submit"
          className="h-10 w-full rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <p className="text-sm text-zinc-600">
        Precisa de uma conta?{" "}
        <Link href={APP_ROUTES.register} className="font-medium text-zinc-950">
          Criar conta
        </Link>
      </p>
    </section>
  );
}
