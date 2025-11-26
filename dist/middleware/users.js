import { db } from "../query/index.js";
import { users } from "../query/schema.js";
import { hashPassword } from "../auth.js";
import { eq } from "drizzle-orm";
export async function newUserHandler(req, res, next) {
    const userEmail = req.body;
    if (!userEmail || !userEmail.email) {
        res.status(400).json({ error: "Email is required" });
    }
    if (!userEmail || !userEmail.password) {
        res.status(400).json({ error: "Password is required" });
    }
    const newUser = { email: userEmail.email, hashedPassword: await hashPassword(userEmail.password) };
    const result = await db.insert(users).values(newUser).returning();
    console.log(`New user registered with email: ${userEmail.email}`);
    const userResponse = {
        id: result[0].id,
        email: result[0].email,
        createdAt: result[0].createdAt,
        updatedAt: result[0].updatedAt,
    };
    res.status(201).json(userResponse);
    return;
}
export async function updateUserHandler(req, res, next) {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
        return res.status(401).json({ error: "Authorization header is missing" });
    }
    const userEmail = req.body;
    if (!userEmail || !userEmail.email) {
        res.status(400).json({ error: "Email is required" });
    }
    try {
        const hashedPassword = await hashPassword(userEmail.password);
        await db
            .update(users)
            .set({ hashedPassword: hashedPassword, updatedAt: new Date() })
            .where(eq(users.email, userEmail.email));
    }
    catch (error) {
        return next(error);
    }
    return res.status(200).json({ message: "User updated successfully" });
}
