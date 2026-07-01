import type { Metadata } from "next";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { MainFooter } from "@/components/layout/MainFooter";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { getCurrentUser } from "@/lib/auth/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReservEat",
  description: "Reserva mesa en los mejores restaurantes",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col bg-gray-50">
        <AuthProvider initialUser={user}>
          <MainNavbar />
          <main className="flex-1">{children}</main>
          <MainFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
