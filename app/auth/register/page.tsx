import { RegisterForm } from "./RegisterForm";

export const metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold text-gray-900">Crear cuenta</h1>
      <RegisterForm />
    </div>
  );
}
