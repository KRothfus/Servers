import { unique } from "drizzle-orm/gel-core";
import { Request, Response, NextFunction } from "express";
import { db } from "../query/index.js";
import { NewUser, users } from "../query/schema.js";


type UserEmail = {
  email: string;
};

export async function newUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
){
  const userEmail: UserEmail = req.body;
  if (!userEmail || !userEmail.email) {
    res.status(400).json({ error: "Email is required" });
  }

  console.log(`New user registered with email: ${userEmail.email}`);
  const newUser = { email: userEmail.email };
  const result = await db.insert(users).values(newUser).returning();
  res.status(201).json(result[0]);
}
