import type { Request, Response } from "express";
import { createChirp, getChirps } from "../db/queries/chirps.js";
import { BadRequestError, UnauthorizedError } from "./error.js";
import { respondWithJSON } from "./json.js";

export async function handleGetChirps(req: Request, res: Response) {
    const chirps = await getChirps();
      respondWithJSON(res, 200, chirps);
}

export async function handleUserChirps(req: Request, res: Response) {
    type parameters = {
        body: string;
        userId: string;
    };

    const params: parameters = req.body;

    const cleaned = validateChirp(params.body);
    const chirp = await createChirp({ body: cleaned, userId: params.userId });

    respondWithJSON(res, 201, chirp);
}

function validateChirp(body: string) {
    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
        throw new BadRequestError(
        `Chirp is too long. Max length is ${maxChirpLength}`,
        );
    }

    const badWords = ["kerfuffle", "sharbert", "fornax"];
    return getCleanedBody(body, badWords);
}

function getCleanedBody(body: string, badWords: string[]) {
    const words = body.split(" ");

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = word.toLowerCase();
        if (badWords.includes(loweredWord)) {
        words[i] = "****";
        }
    }

    const cleaned = words.join(" ");
    return cleaned;
}

