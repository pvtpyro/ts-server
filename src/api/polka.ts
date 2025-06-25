import type { Request, Response } from "express";
import { upgradeChirpyRed } from "../db/queries/users.js";
import { NotFoundError } from "./error.js";

export async function handlerPolkaHooks(req: Request, res: Response) {
    type parameters = {
        event: string,
        data: {
            userId: string
        }
    }
    const params: parameters = req.body;

    if (params.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }

    const user = await upgradeChirpyRed(params.data.userId);
    if (!user) {
        throw new NotFoundError()
    }

    res.status(204).send();
}