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
  res.type('html').send(`<html>
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
