import type { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "./error.js";
import { reset } from "../db/queries/users.js";

export async function handlerReset(_: Request, res: Response) {

    if (config.api.platform !== "dev") {
        throw new ForbiddenError();
    }

    config.api.fileServerHits = 0;
    await reset();

    res.write("Hits reset to 0");
    res.end();
}
