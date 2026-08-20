import { AppBreadcrumb } from "@/_elements/appBreadcrumb";
import { AppSidebar } from "@/_elements/appSidebar";
import { BreadCrumbProvider } from "@/_elements/breadCrumbProvider";
import { LoadingProvider } from "@/_elements/loadingScreen";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";

export default async function ProtectedMain({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar role="admin" />
      <LoadingProvider>
        <main className="min-h-screen w-full app-content">
          <div className="flex h-14 items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border" />{" "}
            {/* optional visual divider */}
            <AppBreadcrumb />
          </div>
          {children}
          <Toaster />
        </main>
      </LoadingProvider>
    </SidebarProvider>
  );
}
