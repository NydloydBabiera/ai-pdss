"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { InstructorData } from "@/_config/instructorConfig";
import { AccountData } from "@/_config/accountConfig";
import { useRouter } from "next/navigation";
import { useLoading } from "./loadingScreen";
import { logoutAction } from "@/app/authentication/actions";
import { notify } from "@/lib/notifications";

interface NavUserProps {
  instructor: AccountData;
}
export function NavUser({ instructor }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleLogout = async () => {
    startLoading("Logging out...");

    try {
      const result = await logoutAction();

      if (!result.success) {
        notify.error(result.message);
        return;
      }

      notify.success(result.message);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);

      notify.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while logging out",
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {instructor?.instructor?.firstName?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {instructor?.instructor
                  ? `${instructor.instructor.firstName} ${instructor.instructor.lastName}`
                  : "User"}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {instructor?.email}
              </span>
            </div>

            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* User information */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {instructor?.instructor?.firstName?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {instructor?.instructor
                        ? `${instructor.instructor.firstName} ${instructor.instructor.lastName}`
                        : "User"}
                    </span>

                    <span className="truncate text-xs text-muted-foreground">
                      {instructor?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Profile */}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <BadgeCheck />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Bell />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
