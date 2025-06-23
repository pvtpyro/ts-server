import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "./error.js";
import { respondWithJSON } from "./json.js";
import { createChirp } from "../db/queries/chirps.js";

export async function handleUsers(req: Request, res: Response) {
    type parameters = {
        email: string;
    };
    const params: parameters = req.body;

    if (!params.email) {
        throw new BadRequestError("Missing required fields");
    }

    const user = await createUser({email: params.email})
    if (!user) {
        throw new Error("Could not create user");
    }

    respondWithJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
};

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