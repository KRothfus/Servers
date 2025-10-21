import { defineConfig } from "drizzle-kit";
export default defineConfig({
    schema: "src/query/schema.ts",
    out: "dist",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DB_URL,
    },
});
