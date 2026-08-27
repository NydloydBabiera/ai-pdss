import { Role } from "@/generated/prisma/enums"
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
  LayersPlus,
  User,
  UserPen,
  CalendarCheck,
  TableOfContents,
} from "lucide-react"

export type UserRole = Role

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
    roles: ["ADMIN", "STAFF", "TEACHER"],
  },
  {
    title: "Academic Settings",
    url: "/academics",
    icon: School,
    roles: ["ADMIN"],
    subItems: [
      {
        title: "Academic Levels",
        url: "/levels",
        icon: LayersPlus,
        roles: ["ADMIN"],
      },
      {
        title: "Academic Year",
        url: "/academicYear",
        icon: CalendarCheck,
        roles: ["ADMIN"],
      },
    ]
  },
  {
    title: "Students",
    url: "",
    icon: User,
    roles: ["ADMIN", "ADMIN"],
    subItems: [
      {
        title: "Student List",
        url: "/students",
        icon: Users,
        roles: ["ADMIN", "TEACHER"],
      },
      {
        title: "Subject load",
        url: "/students/subject-load",
        icon: TableOfContents,
        roles: ["ADMIN", "TEACHER"],
      },
    ],
  },
  {
    title: "Instructors",
    url: "",
    icon: UserPen,
    roles: ["ADMIN"],
    subItems: [
      {
        title: "Instructor List",
        url: "/instructors",
        icon: Users,
        roles: ["ADMIN", "TEACHER"],
      },
    ],
  },
  {
    title: "Subjects",
    url: "/subjects",
    icon: BookOpen,
    roles: ["ADMIN", "TEACHER"],
    subItems: [
      {
        title: "Subjects",
        url: "/subjects",
        icon: Users,
        roles: ["ADMIN", "TEACHER"],
      },
      {
        title: "Schedule",
        url: "/schedule",
        icon: CalendarDays,
        roles: ["ADMIN", "TEACHER"],
      },
    ],
  },

  {
    title: "Attendance",
    url: "/attendance",
    icon: ClipboardCheck,
    roles: ["TEACHER"],
  },

  {
    title: "Reports",
    url: "/reports",
    icon: FileBarChart,
    roles: ["ADMIN", "TEACHER"],
  },
]

export function getSidebarItems(role: Role) {
  return sidebarItems
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      subItems: item.subItems?.filter((subItem) =>
        subItem.roles.includes(role)
      ),
    }))
}