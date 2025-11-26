import express from "express";
import { handlerReadiness } from "./healthz.js";
import {
  handlerChirpsValidate,
  handlerReset,
  handlerWrite,
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./middleware/middleware.js";
import { config } from "./config.js";
import { error } from "console";
import { errorHandler } from "./middleware/errorhandling.js";
import { APIConfig } from "./config.js";
import { newUserHandler, updateUserHandler } from "./middleware/users.js";
import { chirpHandler, deleteChirpHandler } from "./middleware/chirps.js";
import { migrationHandler } from "./query/index.js";
import { allChirpsHandler } from "./query/allchirps.js";
import { chirpsByIDHandler } from "./query/chirpsbyid.js";
import { loginHandler, refreshHandler, revokeHandler } from "./auth.js";
const app = express();
const PORT = 8080;

// Attach logging and metrics middleware before static file serving so
// requests to /app are both logged and counted.
function envThrow(key: APIConfig){
  if (!key.dbURL){
    throw new Error("DB_URL is not defined in environment variables");
  }
  return
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
app.post("/api/chirps", chirpHandler)
app.post("/api/refresh", refreshHandler)
app.post("/api/revoke", revokeHandler)

app.put("/api/users", updateUserHandler)

app.delete("/api/chirps/:chirpID", deleteChirpHandler)
app.use(errorHandler);