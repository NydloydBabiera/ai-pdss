import {
  LayoutDashboard,
  UserPlus,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  FileBarChart,
  PlusIcon,
  School,
} from "lucide-react"

export type UserRole = "admin" | "teacher" | "student"

export type SidebarItem = {
  title: string
  url: string
  icon: React.ElementType
  roles: UserRole[]
  subItems?: SidebarItem[]
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ["admin", "teacher", "student"],
  },
 {
    title: "Academics",
    url: "/academics",
    icon: School,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Students",
    url: "",
    icon: UserPlus,
    roles: ["admin", "teacher"],
    subItems: [
      {
        title: "Enroll Students",
        url: "/students/registration",
        icon: PlusIcon,
        roles: ["admin"],
      },
      {
        title: "Student List",
        url: "/students",
        icon: Users,
        roles: ["admin", "teacher"],
      },
    ],
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
      subItems: item.subItems?.filter((subItem) =>
        subItem.roles.includes(role)
      ),
    }))
}