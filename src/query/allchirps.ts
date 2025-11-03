import { asc } from "drizzle-orm";
import {chirps} from "./schema.js";
import { db } from "./index.js";
import { Response, Request, NextFunction } from "express";

export async function getAllChirps() {
  const chirpList = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
  return chirpList;
}


export async function allChirpsHandler(req: Request, res: Response) {
    try{
    const chirpList = await getAllChirps();
    res.status(200).json(chirpList);
    return
    } catch (error) {
     res.status(500).json({ error: "Internal Server Error" }); 
    }
}