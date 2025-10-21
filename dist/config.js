process.loadEnvFile();
const dbURL = process.env.DB_URL;
if (!dbURL) {
    throw new Error('Environment variable DB_URL is required');
}
export const config = {
    fileserverHits: 0,
    dbURL: dbURL,
};
