import { unique } from "drizzle-orm/gel-core";
import { Request, Response, NextFunction } from "express";
import { db } from "../query/index.js";
import { NewUser, users } from "../query/schema.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { eq } from "drizzle-orm";

type UserEmail = {
  email: string;
  password: string;
  expiresInSeconds?: number;
};
export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function newUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userEmail: UserEmail = req.body;
  if (!userEmail || !userEmail.email) {
    res.status(400).json({ error: "Email is required" });
  }
  if (!userEmail || !userEmail.password) {
    res.status(400).json({ error: "Password is required" });
  }
  const newUser = {
    email: userEmail.email,
    hashedPassword: await hashPassword(userEmail.password),
  };
  const result = await db.insert(users).values(newUser).returning();
  console.log(`New user registered with email: ${userEmail.email}`);

  const userResponse: UserResponse = {
    id: result[0].id,
    email: result[0].email,
    createdAt: result[0].createdAt,
    updatedAt: result[0].updatedAt,
  };
  res.status(201).json(userResponse);
  return;
}

export async function updateUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = getBearerToken(req);
    if (!accessToken) {
      return res.status(401).json({ error: "Authorization header is missing" });
    }
    console.log("Access Token:", accessToken);
    const userToken = validateJWT(accessToken, process.env.JWT_SECRET!);
  } catch (error) {
    return res.status(401).json({ error: "Invalid or missing JWT" });
  }

  const userEmail: UserEmail = req.body;
  if (!userEmail || !userEmail.email) {
    res.status(400).json({ error: "Email is required" });
  }
  try {
    const hashedPassword = await hashPassword(userEmail.password);
    await db
      .update(users)
      .set({ hashedPassword: hashedPassword, updatedAt: new Date() })
      .where(eq(users.email, userEmail.email));
  } catch (error) {
    return next(error);
  }
  type UserResponse = Omit<UserEmail, "password">;
  return res
    .status(200)
    .json({ email: userEmail.email});
}
