import { argon2d } from "argon2";


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