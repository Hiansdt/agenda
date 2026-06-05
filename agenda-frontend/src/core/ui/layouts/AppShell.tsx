import Link from "next/link";

import { APP_ROUTES } from "@/core/config/routes";
import { AuthNav } from "@/user/ui/components/AuthNav";

type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link href={APP_ROUTES.contacts} className="text-sm font-semibold">
            Agenda
          </Link>
          <div className="flex items-center gap-4 text-sm text-zinc-600">
            <Link href={APP_ROUTES.contacts}>Contatos</Link>
            <AuthNav />
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
