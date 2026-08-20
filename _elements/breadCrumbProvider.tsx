"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { usePathname } from "next/navigation";

export type NavigationBreadcrumb = {
  title: string;
  href: string;
};

type NavigationBreadcrumbContextType = {
  breadcrumbs: NavigationBreadcrumb[];
  clearBreadcrumbs: () => void;
};

const NavigationBreadcrumbContext =
  createContext<NavigationBreadcrumbContextType | undefined>(
    undefined
  );

type Props = {
  children: ReactNode;
};

export function BreadCrumbProvider({
  children,
}: Props) {
  const pathname = usePathname();

  const [breadcrumbs, setBreadcrumbs] = useState<
    NavigationBreadcrumb[]
  >([]);

  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Don't record the same route twice
    if (previousPath.current === pathname) {
      return;
    }

    previousPath.current = pathname;

    const title = getPageTitle(pathname);

    setBreadcrumbs((current) => {
      // If navigating back to an existing page,
      // remove everything after that page.
      const existingIndex = current.findIndex(
        (item) => item.href === pathname
      );

      if (existingIndex !== -1) {
        return current.slice(0, existingIndex + 1);
      }

      return [
        ...current,
        {
          title,
          href: pathname,
        },
      ];
    });
  }, [pathname]);

  const clearBreadcrumbs = () => {
    setBreadcrumbs([]);
  };

  return (
    <NavigationBreadcrumbContext.Provider
      value={{
        breadcrumbs,
        clearBreadcrumbs,
      }}
    >
      {children}
    </NavigationBreadcrumbContext.Provider>
  );
}

export function useNavigationBreadcrumb() {
  const context = useContext(
    NavigationBreadcrumbContext
  );

  if (!context) {
    throw new Error(
      "useNavigationBreadcrumb must be used inside NavigationBreadcrumbProvider"
    );
  }

  return context;
}

function getPageTitle(pathname: string) {
  const segment = pathname
    .split("/")
    .filter(Boolean)
    .pop();

  if (!segment) {
    return "Dashboard";
  }

  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}