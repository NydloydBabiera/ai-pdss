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
    title: "Academic Settings",
    url: "/academics",
    icon: School,
    roles: ["admin"],
    subItems: [
      {
        title: "Academic Levels",
        url: "/levels",
        icon: LayersPlus,
        roles: ["admin"],
      },
      {
        title: "Academic Year",
        url: "/academicYear",
        icon: CalendarCheck,
        roles: ["admin"],
      },
    ]
  },
  {
    title: "Students",
    url: "",
    icon: User,
    roles: ["admin", "teacher"],
    subItems: [
      {
        title: "Student Registration",
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
       {
        title: "Subject load",
        url: "/students/subject-load",
        icon: TableOfContents,
        roles: ["admin", "teacher"],
      },
    ],
  },
  {
    title: "Instructors",
    url: "",
    icon: UserPen,
    roles: ["admin"],
    subItems: [
      {
        title: "Add Instructor",
        url: "/instructors/registration",
        icon: PlusIcon,
        roles: ["admin"],
      },
      {
        title: "Instructor List",
        url: "/instructors",
        icon: Users,
        roles: ["admin", "teacher"],
      },
    ],
  },
  {
    title: "Subjects",
    url: "/subjects",
    icon: BookOpen,
    roles: ["admin", "teacher"],
    subItems: [
      {
        title: "Add Subject",
        url: "/subjects/registration",
        icon: PlusIcon,
        roles: ["admin"],
      },
      {
        title: "Subject List",
        url: "/subjects",
        icon: Users,
        roles: ["admin", "teacher"],
      },
      {
        title: "Schedule",
        url: "/subjects/schedule",
        icon: CalendarDays,
        roles: ["admin", "teacher"],
      },
    ],
  },

  {
    title: "Attendance",
    url: "/attendance",
    icon: ClipboardCheck,
    roles: ["teacher"],
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