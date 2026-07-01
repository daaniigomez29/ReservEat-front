import { LoginForm } from "./LoginForm";

export const metadata = { title: "Iniciar sesión" };

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold text-gray-900">Iniciar sesión</h1>
      <LoginForm redirectTo={redirect} />
    </div>
  );
}
