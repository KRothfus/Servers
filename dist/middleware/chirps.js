import { db } from "../query/index.js";
import { chirps } from "../query/schema.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
export async function chirpHandler(req, res, next) {
    const chirp = req.body;
    const bearerToken = getBearerToken(req);
    console.log("Bearer Token:", bearerToken);
    const checkJWT = validateJWT(bearerToken, config.secret);
    console.log("Validated JWT User ID:", checkJWT);
    console.log("Chirp User ID:", chirp.userId);
    if (!chirp || !chirp.body) {
        return res.status(400).json({ error: "Chirp body is required" });
    }
    try {
        const usersChirp = {
            body: chirp.body.trim(),
            userId: checkJWT,
        };
        const result = await db.insert(chirps).values(usersChirp).returning();
        res.status(201).json(result[0]);
    }
    catch (error) {
        return next(error);
    }
}
