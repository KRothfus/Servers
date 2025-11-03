import express from "express";
import { handlerReadiness } from "./healthz.js";
import { handlerChirpsValidate, handlerReset, handlerWrite, middlewareLogResponses, middlewareMetricsInc, } from "./middleware/middleware.js";
import { config } from "./config.js";
import { errorHandler } from "./middleware/errorhandling.js";
import { newUserHandler } from "./middleware/users.js";
import { chirpHandler } from "./middleware/chirps.js";
import { migrationHandler } from "./query/index.js";
import { allChirpsHandler } from "./query/allchirps.js";
import { chirpsByIDHandler } from "./query/chirpsbyid.js";
import { loginHandler } from "./auth.js";
const app = express();
const PORT = 8080;
// Attach logging and metrics middleware before static file serving so
// requests to /app are both logged and counted.
function envThrow(key) {
    if (!key.dbURL) {
        throw new Error("DB_URL is not defined in environment variables");
    }
    return;
}
envThrow(config);
await migrationHandler();
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc);
app.use(express.json());
app.use("/app", express.static("./src/app"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/app`);
});
// streak
// streakk
// sreakkk
app.get("/api/healthz", handlerReadiness);
// app.get("/app", middlewareMetricsInc)
app.get("/admin/metrics", handlerWrite);
app.get("/api/chirps", allChirpsHandler);
app.get("/api/chirps/:chirpID", chirpsByIDHandler);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", async (req, res, next) => {
    Promise.resolve(handlerChirpsValidate(req, res)).catch(next);
});
app.post("/api/users", newUserHandler);
app.post("/api/login", loginHandler);
app.post("/api/chirps", chirpHandler);
app.use(errorHandler);
