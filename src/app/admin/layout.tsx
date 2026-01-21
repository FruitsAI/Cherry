import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pkg from "../../../package.json";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Double check role here just in case (middleware handles main protection)
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[var(--cherry-bg)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] text-[var(--cherry-text)] font-sans selection:bg-[var(--cherry-red)] selection:text-white">
      <AdminHeader version={pkg.version} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
