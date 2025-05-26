import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

async function seed() {
  const prisma = new PrismaClient();
  try {
    const id = "2a530dd8-2d09-4fea-886d-68006d22848f";
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync("Secret Detective", saltRounds);
    await prisma.profile.upsert({
      where: { id },
      update: {}, // do nothing is exists
      create: {
        id,
        email: "bobbyhasd@gmail.com",
        hashedPassword,
      },
    });
    console.log("Database seeded!");
  } catch (err) {
    console.error(err);
  }
  prisma.$disconnect();
}

seed();
