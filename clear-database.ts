// scripts/clear-database.ts
import { prisma } from "./lib/db/prisma";

async function clearDatabase() {
  try {
    // Delete all records from each model
    await prisma.googleUser.deleteMany({});
    await prisma.verificationToken.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.chat.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("All data deleted successfully.");
  } catch (error) {
    console.error("Error deleting data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();