import argon2 from "argon2"; 
import { Request, Response } from "express";
import { db } from "./query/index.js";
import { users } from "./query/schema.js";
import { eq } from "drizzle-orm";
import { UserResponse } from "./middleware/users.js";


export async function hashPassword(password: string): Promise<string> {
    // Dummy hash function for illustration; replace with a real hashing algorithm
    // const argon2 = require('argon2');
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        throw new Error("Password hashing failed");
    }
    }


export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    // Dummy check function for illustration; replace with a real hash comparison
    // const argon2 = require('argon2');
    try {
        const match = await argon2.verify(hash, password);
        return match;
    } catch (err) {
        throw new Error("Password verification failed");
    }
    }


export async function loginHandler(req: Request, res: Response): Promise<boolean> {
const password = req.body.password;
const email = req.body.email;
if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return false;
}
try{
const dbHashedPassword = await db.select().from(users).where(eq(users.email, email)).limit(1);
const passwordGood = await checkPasswordHash(password, dbHashedPassword[0].hashedPassword);
res.status(200).json({
    id: dbHashedPassword[0].id,
    email: dbHashedPassword[0].email,
    createdAt: dbHashedPassword[0].createdAt,
    updatedAt: dbHashedPassword[0].updatedAt,
} as UserResponse);
}catch (error) {
    res.status(401).json({ error: "Incorrect email or password" });
    return false;
}

return true;
}