import Link from "next/link";

export const metadata = { title: "Email verificado"}

export default function EmailVerifiedPage() {
    return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-12">
      <div className="flex flex-col gap-4 rounded-lg border border-green-200 bg-green-50 p-6">
        <h1 className="text-xl font-semibold text-green-800">
          Tu email se verificó correctamente
        </h1>
        <div className="flex gap-2 justify-center">
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