import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema.js";
import { config } from "../config.js";
export async function migrationHandler() {
    const migrationConfig = {
        migrationsFolder: "../query/migrations",
    };
    const migrationClient = postgres(config.dbURL, { max: 1 });
    await migrate(drizzle(migrationClient), config.migrationConfig);
    await migrationClient.end({ timeout: 5 });
}
const conn = postgres(config.dbURL);
export const db = drizzle(conn, { schema });
