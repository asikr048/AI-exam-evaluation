import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: dbUrl
      ? {
          db: {
            url: dbUrl,
          },
        }
      : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export async function isDatabaseConnected(): Promise<{
  connected: boolean;
  type: "PostgreSQL (Prisma)" | "In-Memory Store";
  dbUrlMasked?: string;
}> {
  if (!dbUrl || dbUrl.trim().length === 0) {
    return {
      connected: true,
      type: "In-Memory Store",
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      connected: true,
      type: "PostgreSQL (Prisma)",
      dbUrlMasked: dbUrl.replace(/:([^:@]+)@/, ":••••••••@"),
    };
  } catch (err) {
    return {
      connected: false,
      type: "In-Memory Store",
    };
  }
}
