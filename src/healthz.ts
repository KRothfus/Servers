import { Request, Response } from "express";

export function handlerReadiness(req: Request, res: Response) {
  res.set({ "Content-Type": "text/plain; charset=utf-8" }).send("OK");
}
// keep the streak!