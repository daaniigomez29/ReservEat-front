import Link from "next/link";

export const metadata = { title: "Error de verificación" };

export default function EmailErrorPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-12">
      <div className="flex flex-col gap-4 rounded-lg border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-semibold text-red-800">
          No pudimos verificar tu email
        </h1>
        <p className="text-sm text-red-700">
          El enlace de verificación no es válido o ha caducado. Vuelve a
          registrarte o solicita un nuevo correo de verificación.
        </p>
        <div className="flex gap-2">
          <Link
            href="/auth/register"
            className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Volver a registrarme
          </Link>
          <Link
            href="/auth/login"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
