import { Request, Response, NextFunction } from "express";



export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack || err);

    if (err instanceof BadRequest) {
        return res.status(400).send({error: err.message});
    } else if (err instanceof NotFoundError) {
        return res.status(404).send({error: err.message});
    } else if (err instanceof UnauthorizedError) {
        return res.status(401).send({error: err.message});
    } else if (err instanceof ForbiddenError) {
        return res.status(403).send({error: err.message});
    }
    res.status(500).send({error: 'Something went wrong on our end'});
}



// Error Classes

export class BadRequest extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequest";
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
    }
}