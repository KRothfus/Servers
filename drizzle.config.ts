import { defineConfig } from "drizzle-kit";
import { config } from "process";

export default defineConfig({
  schema: "src/query/schema.ts",
  out: "dist",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL as string,
  },
});