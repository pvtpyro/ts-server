import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

// type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const status = res.statusCode;

        if(req.url == "/.well-known/appspecific/com.chrome.devtools.json") {
            return;
        }

        if(status >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`)
        }

    });
    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        config.fileserverHits += 1;
        console.log(`Hits: ${config.fileserverHits}`);
    });
	next();
}

export function middlewareGetMetrics(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        console.log(`Hits: ${config.fileserverHits}`);
    });
    res.send(`Hits: ${config.fileserverHits}`)
}

export function middlewareResetMetrics(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        config.fileserverHits = 0;
        console.log(`Hits: ${config.fileserverHits}`);
    });
    next();
}