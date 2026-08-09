import {
  LayoutDashboard,
  UserPlus,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  FileBarChart,
} from "lucide-react"

export type UserRole = "admin" | "teacher" | "student"

export type SidebarItem = {
  title: string
  url: string
  icon: React.ElementType
  roles: UserRole[]
  items?: SidebarItem[]
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ["admin", "teacher", "student"],
  },

  {
    title: "Students",
    url: "#",
    icon: UserPlus,
    roles: ["admin"],
    // items: [
    //   {
    //     title: "Students",
    //     url: "/registrations/students",
    //     icon: GraduationCap,
    //     roles: ["admin"],
    //   },
    //   {
    //     title: "Teachers",
    //     url: "/registrations/teachers",
    //     icon: Users,
    //     roles: ["admin"],
    //   },
    //   {
    //     title: "Subjects",
    //     url: "/registrations/subjects",
    //     icon: BookOpen,
    //     roles: ["admin"],
    //   },
    // ],
  },
  {
    title: "Subjects",
    url: "/subjects",
    icon: BookOpen,
    roles: ["admin"],
  },

  {
    title: "Attendance",
    url: "/attendance",
    icon: ClipboardCheck,
    roles: ["teacher"],
  },

  {
    title: "Students",
    url: "/students",
    icon: GraduationCap,
    roles: ["teacher"],
  },

  {
    title: "Schedule",
    url: "/schedule",
    icon: CalendarDays,
    roles: ["teacher", "admin"],
  },

  {
    title: "Reports",
    url: "/reports",
    icon: FileBarChart,
    roles: ["admin", "teacher"],
  },
]

export function getSidebarItems(role: UserRole) {
  return sidebarItems
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      items: item.items?.filter((subItem) =>
        subItem.roles.includes(role)
      ),
    }))
}