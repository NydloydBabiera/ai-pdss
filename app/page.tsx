import { AppSidebar } from "@/_elements/appSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import LoginPage from "./authentication/page";
import { GalleryVerticalEnd, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-6 md:p-10 animate-float-up">
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* Branding */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>

          <h1 className="text-xl font-bold tracking-tight">AI-PDSS</h1>

          <p className="max-w-sm text-sm text-muted-foreground">
            AI-Driven Pedagogical Decision-Support System
          </p>

          <p className="text-xs text-muted-foreground">
            For Teacher-Led Learner Intervention
          </p>

        </div>
        {/* Login */}
        <LoginPage />

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AI-PDSS. All rights reserved.
        </p>
      </div>
    </div>
    // <div className="flex flex-1 flex-col gap-6 p-6">
    //   <div>
    //     <h1 className="text-3xl font-bold">
    //       Dashboard
    //     </h1>

    //     <p className="text-muted-foreground">
    //       Welcome to your dashboard.
    //     </p>
    //   </div>

    //   <div className="grid gap-4 md:grid-cols-3">
    //     <div className="rounded-xl border p-6">
    //       <h2 className="font-semibold">Students</h2>
    //       <p className="text-2xl font-bold">120</p>
    //     </div>

    //     <div className="rounded-xl border p-6">
    //       <h2 className="font-semibold">Teachers</h2>
    //       <p className="text-2xl font-bold">15</p>
    //     </div>

    //     <div className="rounded-xl border p-6">
    //       <h2 className="font-semibold">Subjects</h2>
    //       <p className="text-2xl font-bold">24</p>
    //     </div>
    //   </div>
    // </div>
  );
}
