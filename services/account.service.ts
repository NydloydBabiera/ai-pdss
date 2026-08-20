import { AccountData, AccountType, LoginData } from "@/_config/accountConfig";
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
export async function updatePassword(id: number, account: AccountType): Promise<AccountData> {
    const data = await prisma.account.update({
        where: {
            id: id
        },
        data: {
            password: await hashPassword(account.password)
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
            account: true,
        },
    });

    if (!session) {
        return;
    }

    const result = {
        id: session.account.id,
        email: session.account.email,
        role: session.account.Role,
    }

    return result;
}