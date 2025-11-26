import { Request, Response, NextFunction } from "express";
import { db } from "../query/index.js";
import { chirps } from "../query/schema.js";
import { register } from "module";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { check } from "drizzle-orm/gel-core/checks.js";
import { userInfo } from "os";
type Chirp = {
  body: string;
  userId: string;
};

export async function chirpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const chirp = req.body;
  if (!chirp || typeof chirp.body !== "string") {
    return res.status(400).json({ error: "Chirp body is required" });
  }

  const trimmedChirp = chirp.body.trim();
  if (!trimmedChirp || trimmedChirp.length === 0) {
    return res.status(400).json({ error: "Chirp body cannot be empty" });
  }
  let userId_JWT: string;
  try {
    const bearerToken = getBearerToken(req);
    userId_JWT = validateJWT(bearerToken, config.secret);
  } catch (error) {
    return res.status(401).json({ error: "Invalid or missing JWT" });
  }

  try {
    const usersChirp: Chirp = {
      body: trimmedChirp,
      userId: userId_JWT,
    };

    const result = await db.insert(chirps).values(usersChirp).returning();

    res.status(201).json(result[0]);
  } catch (error) {
    return next(error);
  }
}
