import { db } from "../query/index.js";
import { users } from "../query/schema.js";
export async function newUserHandler(req, res, next) {
    const userEmail = req.body;
    if (!userEmail || !userEmail.email) {
        res.status(400).json({ error: "Email is required" });
    }
    console.log(`New user registered with email: ${userEmail.email}`);
    const newUser = { email: userEmail.email };
    const result = await db.insert(users).values(newUser).returning();
    res.status(201).json(result[0]);
}
