import type { Request, Response } from "express";
import path from "path";
import { config } from "../config.js";

export async function handlerReadiness(req: Request, res: Response) {
    // res.set("Content-Type", "text/plain; charset=utf-8");
    res.type("text/plain; charset=utf-8")
    res.send("OK")
    res.end();
};

export async function handlerMetrics(req: Request, res: Response) {
    const metricsFilePath = path.join(__dirname, '..', 'metrics.html');

    res.type("text/plain; charset=utf-8");

    res.on("finish", () => {
        console.log(`Hits: ${config.fileServerHits}`);
    });

    res.sendFile(metricsFilePath);
}