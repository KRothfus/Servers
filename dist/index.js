import express from "express";
import { handlerReadiness } from "./healthz.js";
import { handlerReset, handlerWrite, middlewareLogResponses, middlewareMetricsInc, validateChirp } from "./middleware.js";
const app = express();
const PORT = 8080;
// Attach logging and metrics middleware before static file serving so
// requests to /app are both logged and counted.
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/app`);
});
app.get("/api/healthz", handlerReadiness);
// app.get("/app", middlewareMetricsInc)
app.get("/admin/metrics", handlerWrite);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", validateChirp);
