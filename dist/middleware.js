import { config } from "./config.js";
export function respondWithError(res, code, message) {
    respondWithJSON(res, code, { error: message });
}
export function respondWithJSON(res, code, payload) {
    res.header("Content-Type", "application/json");
    const body = JSON.stringify(payload);
    res.status(code).send(body);
}
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode >= 400) {
            console.log(`[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
        }
    });
    next();
}
// streak 2
// streak 3
// streak 4
// streak 5
// streak 6
// streak 7
// streak 8
export function middlewareMetricsInc(req, res, next) {
    config.fileserverHits += 1;
    next();
}
export function handlerWrite(req, res) {
    res.type("html").send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
    // streak 9
    // streak 10
}
export function handlerReset(req, res) {
    config.fileserverHits = 0;
    handlerWrite(req, res);
}
function cleanedBody(body) {
    const splitBody = body.split(" ");
    for (let i = 0; i < splitBody.length; i++) {
        if (["kerfuffle", "sharbert", "fornax"].includes(splitBody[i].toLowerCase())) {
            splitBody[i] = "****";
        }
    }
    return splitBody.join(" ");
}
export async function handlerChirpsValidate(req, res) {
    const params = req.body;
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        respondWithError(res, 400, "Chirp is too long");
        return;
    }
    respondWithJSON(res, 200, {
        cleanedBody: cleanedBody(params.body),
    });
}
