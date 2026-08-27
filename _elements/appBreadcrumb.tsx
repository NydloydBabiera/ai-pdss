"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { sidebarItems } from "@/_config/sidebarConfig";

type NavigationEntry = { title: string; href: string };
const STORAGE_KEY = "pdss-navigation-breadcrumbs";

const knownRoutes = sidebarItems.flatMap((item) => [
  { title: item.title, url: item.url },
  ...(item.subItems?.map((subItem) => ({
    title: subItem.title,
    url: subItem.url,
  })) ?? []),
]);

function titleFromPath(pathname: string) {
  if (pathname === "/dashboard") return "Dashboard";

  const knownRoute = knownRoutes.find((item) => item.url === pathname);
  if (knownRoute) return knownRoute.title;

  const segments = pathname.split("/").filter(Boolean);
  const resource = segments[0]?.replace(/-/g, " ") ?? "Page";
  const action = segments.at(-1);

  if (action === "registration") return `Add ${resource.replace(/s$/, "")}`;
  if (action === "edit") return `Edit ${resource.replace(/s$/, "")}`;

  return segments
    .filter((segment) => !/^\d+$/.test(segment))
    .map((segment) => segment.replace(/-/g, " "))
    .join(" / ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function readHistory(): NavigationEntry[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (entry): entry is NavigationEntry =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as NavigationEntry).title === "string" &&
        typeof (entry as NavigationEntry).href === "string",
    );
  } catch {
    return [];
  }
}

export function AppBreadcrumb() {
  const pathname = usePathname();
  const current = { href: pathname, title: titleFromPath(pathname) };
  const [previous, setPrevious] = useState<NavigationEntry>();

  useEffect(() => {
    const history = readHistory();
    const lastEntry = history.at(-1);

    if (lastEntry?.href === pathname) {
      // Route history is an external sessionStorage-backed value.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrevious(history.at(-2));
      return;
    }

    const currentEntry = { href: pathname, title: titleFromPath(pathname) };
    const nextHistory = [...history, currentEntry].slice(-2);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    // Keep the rendered snapshot synchronized with sessionStorage.
    setPrevious(lastEntry);
  }, [pathname]);

  const showDashboard = pathname !== "/";
  const showPrevious =
    previous && previous.href !== pathname && previous.href !== "/";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {showDashboard ? (
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/">Dashboard</Link>} />
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        )}

        {showPrevious && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Link href={previous.href}>{previous.title}</Link>}
              />
            </BreadcrumbItem>
          </>
        )}

        {showDashboard && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{current.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
