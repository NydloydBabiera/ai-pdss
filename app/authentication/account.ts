"use server"

import { AccountType } from "@/_config/accountConfig";
import { generateSessionToken } from "@/lib/auth/token";
import { login } from "@/services/account.service";
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