import "server-only";
import { AccountData, AccountType, LoginData, UpdatePasswordType } from "@/_config/accountConfig";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { generateSessionToken, hashToken } from "@/lib/auth/token";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// type Account = {
//     email: string;
//     password: string;
// }

// type Auth = {
//     token: string;
//     expiresAt: Date;
// }
export async function updatePassword(account: UpdatePasswordType): Promise<AccountData> {
    const data = await prisma.account.update({
        where: {
            id: account.id
        },
        data: {
            password: await hashPassword(account.newPassword),
            isFirstLogin: false,
        }
    })
    const result = {
        id: data.id,
        email: data.email,
        role: data.Role,
    }
    return result
}

export async function login(account: AccountType): Promise<LoginData> {

    const user = await prisma.account.findFirst({
        where: {
            email: account.email
        },
    });

    if (!user) {
        throw new Error("No user found for this email");
    }

    const validPassword =
        await verifyPassword(
            account.password,
            user.password
        );

    if (!validPassword) {
        throw new Error("Password is incorrect");
    }

    const token = generateSessionToken();

    const tokenHash = hashToken(token);

    const expiresAt = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7
    );

    await prisma.accountSession.create({
        data: {
            tokenHash,
            accountId: user.id,
            expiresAt,
        },
    });

    return {
        token,
        expiresAt,
        isFirstLogin: user.isFirstLogin,
        accountId: user?.id
    };
}


export async function getCurrentUser(): Promise<AccountData | undefined> {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
        return;
    }

    const tokenHash = hashToken(token);

    const session = await prisma.accountSession.findFirst({
        where: {
            tokenHash,
            expiresAt: {
                gt: new Date(),
            },
        },
        include: {
            account: {
                include: {
                    instructor: true
                }
            },
        },
    });

    if (!session) {
        return;
    }

    const result = {
        id: session.account.id,
        email: session.account.email,
        role: session.account.Role,
        instructor: session.account.instructor
    }

    return result;
}

export async function logOut(token: string) {
    const tokenHash = hashToken(token);

    await prisma.accountSession.deleteMany({
        where: {
            tokenHash,
        },
    });

    return {
        success: true,
        message: "Logged out successfully",
    };
}