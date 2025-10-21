import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { error } from "console";
import { BadRequest } from "./errorhandling.js";

export function respondWithError(res: Response, code: number, message: string) {
  respondWithJSON(res, code, { error: message });
}

export function respondWithJSON(res: Response, code: number, payload: any) {
  res.header("Content-Type", "application/json");
  const body = JSON.stringify(payload);
  res.status(code).send(body);
}

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

function cleanedBody(body: string): string {
    const splitBody = body.split(" ");
    for (let i = 0; i < splitBody.length; i++) {
        if (["kerfuffle", "sharbert", "fornax"].includes(splitBody[i].toLowerCase())) {
            splitBody[i] = "****";
        }
    }
    return splitBody.join(" ");
}

// streak 11
export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

   const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequest("Chirp is too long. Max length is 140");
    // respondWithError(res, 400, "Chirp is too long");
    // return;
  }

  respondWithJSON(res, 200, {
    cleanedBody: cleanedBody(params.body)   ,
  });
}
