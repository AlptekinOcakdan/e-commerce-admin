import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads .env; Node's built-in loader keeps it dependency-free.
try {
  process.loadEnvFile();
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
