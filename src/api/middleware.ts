import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./error.js"

export function middlewareLogResponse(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const statusCode = res.statusCode;

        if (req.url == "/.well-known/appspecific/com.chrome.devtools.json") {
            return;
        }

        if (statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });

    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileServerHits += 1;
    next();
}

export function middlewareErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.message);

    if (err instanceof NotFoundError) {
        res.status(404).send({"error": err.message});
    } else if (err instanceof BadRequestError) {
        res.status(400).send({"error": err.message})
    } else if (err instanceof UnauthorizedError) {
        res.status(401).send({"error": err.message})
    } else if (err instanceof ForbiddenError) {
        res.status(403).send({"error": err.message})
    } else {
        res.status(500).send({"error": err.message});
    }

}