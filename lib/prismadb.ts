import { PrismaClient } from "@prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

declare global {
  var prisma: PrismaClient | undefined
}

// Prisma 7 requires a driver adapter; the MariaDB adapter is Prisma's MySQL driver.
const prismadb = globalThis.prisma || new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL ?? ""),
})
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb

export default prismadb;
