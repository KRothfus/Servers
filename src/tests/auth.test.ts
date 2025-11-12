import { describe, it, expect, beforeAll } from "vitest";
import {
  checkPasswordHash,
  hashPassword,
  makeJWT,
  validateJWT,
  getBearerToken,
} from "../auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT Functions", () => {
  const userID = "user123";
  const secret = "supersecretkey";

  it("should create and validate a JWT correctly", () => {
    const token = makeJWT(userID, 3600, secret);
    const validatedUserID = validateJWT(token, secret);
    expect(validatedUserID).toBe(userID);
  });

  it("should throw an error for an invalid JWT", () => {
    const invalidToken = "invalid.token.string";
    expect(() => validateJWT(invalidToken, secret)).toThrow("Invalid token");
  });
});

describe("Test token", () => {
  it("should extract bearer token from request", () => {
    const mockReq = {
      headers: {
        authorization: "Bearer testtoken123",
      },
    } as any;

    const token = getBearerToken(mockReq);
    expect(token).toBe("testtoken123");
  });
});
describe("Test getBearerToken with missing header", () => {
  it("should throw an error when Authorization header is missing", () => {
    const mockReq = {
      headers: {},
    } as any;

    expect(() => getBearerToken(mockReq)).toThrow(
      "Authorization header is missing"
    );
  });
});