import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();
// streak
export type APIConfig = {
    fileserverHits: number;
    dbURL: string;
    migrationConfig: {
        migrationsFolder: MigrationConfig["migrationsFolder"];
    };
    platform:string;
    secret: string;
}

const dbURL = process.env.DB_URL;
if (!dbURL) {
    throw new Error('Environment variable DB_URL is required');
}

export const config: APIConfig = {
    fileserverHits: 0,
    dbURL: dbURL,
    migrationConfig: {
        migrationsFolder: "dist/migrations",
    },
    platform: process.env.PLATFORM || "dev",
    secret: process.env.JWT_SECRET || "",
}