import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { generateSessionToken, hashToken } from "@/lib/auth/token";
import { prisma } from "@/lib/prisma";

type Account = {
    email: string;
    password: string;
}

type Auth = {
    token: string;
    expiresAt: Date;
}
export async function updatePassword(id: number, account: Account): Promise<Account> {
    const instructor = await prisma.account.update({
        where: {
            id: id
        },
        data: {
            password: await hashPassword(account.password)
        }
    })

    return instructor
}

export async function login(account: Account): Promise<Auth> {

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