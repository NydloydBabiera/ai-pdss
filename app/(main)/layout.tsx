import { AppBreadcrumb } from "@/_elements/appBreadcrumb";
import { AppSidebar } from "@/_elements/appSidebar";
import { AuthProvider } from "@/_elements/authProvider";
import { LoadingProvider } from "@/_elements/loadingScreen";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/services/account.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ProtectedMain({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const user = await getCurrentUser();

  const authUser = user
    ? {
        id: user.id,
        email: user.email,
        role: user.role,
        instructor: user.instructor,
      }
    : null;
  console.log("🚀 ~ ProtectedMain ~ authUser:", authUser);

  if (!user) {
    redirect("/");
  }

  return (
    <AuthProvider user={authUser}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar user={user} />
        <LoadingProvider>
          <main className="min-h-screen w-full app-content">
            <div className="flex h-14 items-center gap-3 border-b px-4">
              <SidebarTrigger />
              <div className="h-4 w-px bg-border" />{" "}
              {/* optional visual divider */}
              <Suspense fallback={<span className="text-sm text-muted-foreground">Loading navigation...</span>}>
                <AppBreadcrumb />
              </Suspense>
            </div>
            {children}
            <Toaster />
          </main>
        </LoadingProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}
