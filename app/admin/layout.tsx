import { AppSidebar } from "@/_elements/appSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
      <SidebarInset>
        <main className="flex min-h-screen flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
