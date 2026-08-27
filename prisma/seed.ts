import "dotenv/config";
import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SEED_ADMIN_PASSWORD;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

if (!email || !password) {
  throw new Error(
    "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to create the initial administrator.",
  );
}

if (password.length < 12) {
  throw new Error("SEED_ADMIN_PASSWORD must contain at least 12 characters.");
}

const adminEmail = email;
const adminPassword = password;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existingInstructor = await prisma.instructor.findFirst({
    where: { email: adminEmail },
    include: { account: true },
  });

  if (existingInstructor?.account) {
    console.log(`Initial administrator already exists: ${adminEmail}`);
    return;
  }

  const passwordHash = await argon2.hash(adminPassword);

  await prisma.$transaction(async (tx) => {
    const instructor = existingInstructor ?? await tx.instructor.create({
      data: {
        firstName: process.env.SEED_ADMIN_FIRST_NAME?.trim() || "System",
        middleName: process.env.SEED_ADMIN_MIDDLE_NAME?.trim() || "Administrator",
        lastName: process.env.SEED_ADMIN_LAST_NAME?.trim() || "Account",
        email: adminEmail,
        age: 18,
        address: process.env.SEED_ADMIN_ADDRESS?.trim() || "System",
        birthDate: new Date("2000-01-01T00:00:00.000Z"),
        gender: "MALE",
        isActive: true,
      },
    });

    await tx.account.create({
      data: {
        email: adminEmail,
        password: passwordHash,
        token: "",
        isActive: true,
        isFirstLogin: true,
        instructorId: instructor.id,
        Role: "ADMIN",
      },
    });
  });

  console.log(`Initial administrator created: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
