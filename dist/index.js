import express from "express";
import { handlerReadiness } from "./healthz.js";
const app = express();
const PORT = 8080;
app.use("/app", express.static("./src/app"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/app`);
});
app.get("/healthz", handlerReadiness);
