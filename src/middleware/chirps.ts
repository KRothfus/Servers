import { Request, Response, NextFunction } from "express";
import { db } from "../query/index.js";
import { chirps } from "../query/schema.js";
type Chirp = {
  body: string;
  userId: string;
};

export async function chirpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const chirp: Chirp = req.body;
  if (!chirp || !chirp.body || !chirp.userId) {
    return res.status(400).json({ error: "Chirp body and userId are required" });
  }

  try{
  const usersChirp = {
    body: chirp.body.trim(),
    userId: chirp.userId,
  };
 
  const result = await db.insert(chirps).values(usersChirp).returning();
  res.status(201).json(result[0]);
} catch (error) {
  return next(error); 
}
 
}
