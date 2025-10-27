import { db } from "./index.js"
import { chirps } from "./schema.js"
import { Request, Response } from "express";
import { eq } from "drizzle-orm";

export async function chirpsByIDHandler(req:Request, res:Response) {
  const chirpID = req.params.chirpID;
  try {
    const chirpByID = await db
      .select()
      .from(chirps)
      .where(eq(chirps.id, chirpID))
      .limit(1);
      res.status(200).json(chirpByID[0]);
  } catch (error) {
    return res.status(500).json({ error: "Chirp not found" });
  }
}