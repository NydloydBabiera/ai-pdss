import { AppSidebar } from "@/_elements/appSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome to your dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Students</h2>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Teachers</h2>
          <p className="text-2xl font-bold">15</p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Subjects</h2>
          <p className="text-2xl font-bold">24</p>
        </div>
      </div>
    </div>
  )
}
