import argon2 from "argon2";
import { db } from "./query/index.js";
import { refreshTokens, users } from "./query/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export async function hashPassword(password) {
    // Dummy hash function for illustration; replace with a real hashing algorithm
    // const argon2 = require('argon2');
    try {
        const hash = await argon2.hash(password);
        return hash;
    }
    catch (err) {
        throw new Error("Password hashing failed");
    }
}
export async function checkPasswordHash(password, hash) {
    // Dummy check function for illustration; replace with a real hash comparison
    // const argon2 = require('argon2');
    try {
        const match = await argon2.verify(hash, password);
        return match;
    }
    catch (err) {
        throw new Error("Password verification failed");
    }
}
export async function refreshHandler(req, res) {
    const givenToken = getBearerToken(req);
    const token = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, givenToken))
        .limit(1);
    if (token.length === 0) {
        res.status(401).json({ error: "Invalid refresh token" });
        return;
    }
    else if (token[0].revokedAt !== null) {
        res
            .status(401)
            .json({ error: `Refresh token was revoked on ${token[0].revokedAt}` });
        return;
    }
    else if (token[0].expiresAt < new Date()) {
        res.status(401).json({ error: "Refresh token has expired" });
        return;
    }
    else {
        res
            .status(200)
            .json({ token: makeJWT(token[0].userId, process.env.JWT_SECRET || "") });
        return;
    }
}
export async function revokeHandler(req, res) {
    const givenToken = getBearerToken(req);
    const existing = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, givenToken))
        .limit(1);
    if (existing.length === 0) {
        return res.status(401).json({ error: "Invalid refresh token" });
    }
    await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() /* updatedAt auto or set here */ })
        .where(eq(refreshTokens.token, givenToken));
    return res.sendStatus(204);
}
export async function loginHandler(req, res) {
    const password = req.body.password;
    const email = req.body.email;
    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return false;
    }
    try {
        const dbHashedPassword = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        if (dbHashedPassword.length === 0) {
            throw new Error("User not found");
        }
        const passwordGood = await checkPasswordHash(password, dbHashedPassword[0].hashedPassword);
        if (!passwordGood) {
            throw new Error("Password does not match");
        }
        const expAt = new Date();
        expAt.setDate(expAt.getDate() + 60);
        const refreshToken = {
            token: makeRefreshToken(),
            userId: dbHashedPassword[0].id,
            expiresAt: expAt,
            revokedAt: null,
        };
        await db.insert(refreshTokens).values(refreshToken);
        res.status(200).json({
            id: dbHashedPassword[0].id,
            email: dbHashedPassword[0].email,
            createdAt: dbHashedPassword[0].createdAt,
            updatedAt: dbHashedPassword[0].updatedAt,
            token: makeJWT(dbHashedPassword[0].id, process.env.JWT_SECRET || ""),
            refreshToken: refreshToken.token,
        });
    }
    catch (error) {
        res.status(401).json({ error: "Incorrect email or password" });
        return false;
    }
    return true;
}
export function makeJWT(userID, secret) {
    const payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    };
    return jwt.sign(payload, secret);
}
export function validateJWT(tokenString, secret) {
    try {
        const decoded = jwt.verify(tokenString, secret);
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            throw new Error("Token has expired");
        }
        return decoded.sub;
    }
    catch (error) {
        throw new Error("Invalid token");
    }
}
export function getBearerToken(req) {
    const authHeader = req.get("Authorization");
    if (authHeader) {
        const tokenParts = authHeader.split(" ");
        console.log("Token Parts:", tokenParts);
        const tokenString = tokenParts[1].trim();
        console.log("Extracted Token:", tokenString);
        return tokenString;
    }
    else {
        throw new Error("Authorization header is missing");
    }
}
export function makeRefreshToken() {
    return crypto.randomBytes(32).toString("hex");
}
