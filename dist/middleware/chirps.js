import { db } from "../query/index.js";
import { chirps } from "../query/schema.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { eq } from "drizzle-orm";
export async function chirpHandler(req, res, next) {
    const chirp = req.body;
    if (!chirp || typeof chirp.body !== "string") {
        return res.status(400).json({ error: "Chirp body is required" });
    }
    const trimmedChirp = chirp.body.trim();
    if (!trimmedChirp || trimmedChirp.length === 0) {
        return res.status(400).json({ error: "Chirp body cannot be empty" });
    }
    let userId_JWT;
    try {
        const bearerToken = getBearerToken(req);
        userId_JWT = validateJWT(bearerToken, config.secret);
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid or missing JWT" });
    }
    try {
        const usersChirp = {
            body: trimmedChirp,
            userId: userId_JWT,
        };
        const result = await db.insert(chirps).values(usersChirp).returning();
        res.status(201).json(result[0]);
    }
    catch (error) {
        return next(error);
    }
}
export async function deleteChirpHandler(req, res, next) {
    const chirpID = req.body.id;
    if (!chirpID) {
        throw new Error('id required');
        return res.status(400).json({ error: "Chirp ID is required" });
    }
    let userId_JWT;
    try {
        const bearerToken = getBearerToken(req);
        userId_JWT = validateJWT(bearerToken, config.secret);
    }
    catch (error) {
        throw new Error('missing token');
        return res.status(401).json({ error: "Invalid or missing JWT" });
    }
    try {
        const chirpToDelete = await db
            .select()
            .from(chirps)
            .where(eq(chirps.id, chirpID.toString()))
            .limit(1);
        if (chirpToDelete.length === 0) {
            throw new Error('chirp not found');
            return res.status(404).json({ error: "Chirp not found" });
        }
        if (chirpToDelete[0].userId !== userId_JWT) {
            throw new Error('not auth');
            return res
                .status(403)
                .json({ error: "Not authorized to delete this chirp" });
        }
        await db.delete(chirps).where(eq(chirps.id, chirpID.toString()));
        res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        return next(error);
    }
}
