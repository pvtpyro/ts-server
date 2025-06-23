import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";

export function middlewareLogResponse(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const statusCode = res.statusCode;

        if(req.url == "/.well-known/appspecific/com.chrome.devtools.json") {
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
    respondWithError(res, 500, 'Something went wrong on our end');
}