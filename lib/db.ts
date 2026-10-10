import { PrismaClient } from "@prisma/client";

// Compteur de requêtes SQL : c'est lui qui rend le problème N+1 visible à l'écran.
let queryCount = 0;

function createClient() {
  const client = new PrismaClient({ log: [{ emit: "event", level: "query" }] });
  client.$on("query", () => {
    queryCount++;
  });
  return client;
}

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };
export const db = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/** Exécute fn et renvoie son résultat avec le nombre de requêtes SQL et la durée. */
export async function measure<T>(fn: () => Promise<T>) {
  const before = queryCount;
  const start = performance.now();
  const result = await fn();
  return {
    result,
    queries: queryCount - before,
    ms: Math.round(performance.now() - start),
  };
}
