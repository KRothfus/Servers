process.loadEnvFile();

export type APIConfig = {
    fileserverHits: number;
    dbURL: string;
}

const dbURL = process.env.DB_URL;
if (!dbURL) {
    throw new Error('Environment variable DB_URL is required');
}

export const config: APIConfig = {
    fileserverHits: 0,
    dbURL: dbURL,
}