"use client";

import { AccountData } from "@/_config/accountConfig";
import { createContext, useContext, ReactNode } from "react";

// export type AuthUser = {
//   id: string;
//   email: string;
//   role: string;
// };

type AuthContextType = {
  user: AccountData | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  user: AccountData | null;
};

export function AuthProvider({ children, user }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
