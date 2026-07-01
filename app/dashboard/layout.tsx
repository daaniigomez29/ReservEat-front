import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { getCurrentUser, isOwnerOrAdmin } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?redirect=/dashboard");
  if (!isOwnerOrAdmin(user)) redirect("/restaurants");

  return (
    <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
      <DashboardSidebar />
      <section className="flex-1">{children}</section>
    </div>
  );
}
