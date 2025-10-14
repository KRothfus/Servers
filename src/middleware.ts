import { Request, Response, NextFunction } from "express";
import { config } from "./config.js";

export function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      console.log(
        `[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`
      );
    }
  });
  next();
}
// streak 2
// streak 3
// streak 4
// streak 5
// streak 6
// streak 7
// streak 8

export function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction
) {
  config.fileserverHits += 1;
  next();
}

export function handlerWrite(req: Request, res: Response) {
  res.type("html").send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
  // streak 9
  // streak 10
}

export function handlerReset(req: Request, res: Response) {
  config.fileserverHits = 0;
  handlerWrite(req, res);
}

export function chirpHandler(req: Request, res: Response) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      validateChirp(req, res);
      return;
    } catch (e) {
      res.status(400).json({ error: "Invalid JSON" });
      return;
    }
  });
}

export function validateChirp(req: Request, res: Response) {
  type chirpData = {
    body: string;
  };
  const data: chirpData = req.body;

  if (!data.body || data.body.length === 0 || data.body.length > 140) {
    res.status(400).json({ error: "Chip is too long" });
    return false;
  }
  res.status(200).json({ valid: true });
}
