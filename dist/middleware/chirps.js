import { db } from "../query/index.js";
import { chirps } from "../query/schema.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
export async function chirpHandler(req, res, next) {
    const chirp = req.body;
    const bearerToken = getBearerToken(req);
    const userId_JWT = validateJWT(bearerToken, config.secret);
    if (!chirp || typeof chirp.body !== "string") {
        return res.status(400).json({ error: "Chirp body is required" });
    }
    console.log("1");
    const trimmedChirp = chirp.body.trim();
    if (!trimmedChirp || trimmedChirp.length === 0) {
        return res.status(400).json({ error: "Chirp body cannot be empty" });
    }
    console.log("2");
    try {
        const usersChirp = {
            body: trimmedChirp,
            userId: userId_JWT,
        };
        const result = await db.insert(chirps).values(usersChirp).returning();
        console.log("3");
        res.status(201).json(result[0]);
        console.log("4");
    }
    catch (error) {
        return next(error);
    }
}
