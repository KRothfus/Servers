import { unique } from "drizzle-orm/gel-core";
import { Request, Response, NextFunction } from "express";
import { db } from "../query/index.js";
import { NewUser, users } from "../query/schema.js";
import { hashPassword } from "src/auth.js";


type UserEmail = {
  email: string;
  password: string;
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
  if (!userEmail || !userEmail.password) {
    res.status(400).json({ error: "Password is required" });
  }
  
  console.log(`New user registered with email: ${userEmail.email}`);
  const newUser = { email: userEmail.email, hashedPassword: await hashPassword(userEmail.password) };
  const result = await db.insert(users).values(newUser).returning();

  type UserResponse = Omit<NewUser, 'hashedPassword'>;
  const userResponse: UserResponse = {
    id: result[0].id,
    email: result[0].email,
    createdAt: result[0].createdAt,
    updatedAt: result[0].updatedAt,
  };

  res.status(201).json(userResponse);
}
