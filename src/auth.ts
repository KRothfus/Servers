import { argon2d } from "argon2";
import { Request, Response } from "express";
import { db } from "./query";
import { users } from "./query/schema";
import { eq } from "drizzle-orm";
import { check } from "drizzle-orm/gel-core";

export async function hashPassword(password: string): Promise<string> {
    // Dummy hash function for illustration; replace with a real hashing algorithm
    const argon2 = require('argon2');
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        throw new Error("Password hashing failed");
    }
    }


export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    // Dummy check function for illustration; replace with a real hash comparison
    const argon2 = require('argon2');
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
const dbHashedPassword = await db.select().from(users).where(eq(users.email, email)).limit(1);
await checkPasswordHash(password, dbHashedPassword[0].hashedPassword);

res.status(200).json({ message: `Login attempted for email: ${email}` });
return true;
}