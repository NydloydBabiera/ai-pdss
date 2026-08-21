"use server"

import { AccountType, UpdatePasswordType } from "@/_config/accountConfig";
import { generateSessionToken } from "@/lib/auth/token";
import { login, logOut, updatePassword } from "@/services/account.service";
import { cookies } from "next/headers";

export async function loginAction(data: AccountType) {
    try {
        const account = await login(data);

        const cookieStore = await cookies();

        cookieStore.set("token", account.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: account.expiresAt,
            path: "/",
        });

        return {
            success: true,
            message: "Login successful.",
            data: account,
        };
    } catch (error) {
        console.error(
            "loginAction:",
            error
        );

        return {
            success: false,
            message: error,
        };
    }
}

export async function updatePasswordAction(data: UpdatePasswordType) {

    try {

        const newPassword = await updatePassword(data);
        return {
            success: true,
            message: "Password updated successfully.",
            data: newPassword,
        };
    } catch (error) {
        console.error(
            "updatePasswordAction:",
            error
        );

        return {
            success: false,
            message: error,
        };
    }


}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (token) {
      await logOut(token);
    }

    cookieStore.delete("token");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to logout",
    };
  }
}