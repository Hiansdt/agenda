"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { APP_ROUTES } from "@/core/config/routes";
import { useUserController } from "@/user/adapters/inbound/controllers/UserController";

export function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, register, status } = useUserController();
  const isSubmitting = status === "loading";

  async function submit() {
    await register({ name, email, password });

    if (useUserController.getState().isAuthenticated) {
      router.push(APP_ROUTES.home);
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">Criar conta</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Crie sua conta para começar a gerenciar contatos.
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
          Nome
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
            required
          />
        </label>
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
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <p className="text-sm text-zinc-600">
        Já tem uma conta?{" "}
        <Link href={APP_ROUTES.login} className="font-medium text-zinc-950">
          Entrar
        </Link>
      </p>
    </section>
  );
}
