import { PrismaClient } from "@prisma/client";

// Initialize PrismaClient and store it as a singleton
const prisma = globalThis.prisma || new PrismaClient();

// Assign to globalThis in development to prevent reinitialization during hot reloads
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Type the globalThis object for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Export the singleton instance
export { prisma };