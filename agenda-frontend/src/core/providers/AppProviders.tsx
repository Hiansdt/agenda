import { AuthHydrator } from "@/user/ui/components/AuthHydrator";

type AppProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      <AuthHydrator />
      {children}
    </>
  );
}
