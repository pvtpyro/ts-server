import type { Request, Response } from "express";

import { respondWithJSON, respondWithError } from "./json.js";

export async function handlerValidate(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;

    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        respondWithError(res, 400, "Chirp is too long");
        return;
    }

    const words = params.body.split(" ");

    const baddies = ["kerfuffle", "sharbert", "fornax"];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = word.toLowerCase();
        if (baddies.includes(loweredWord)) {
            words[i] = "****";
        }
    }

    const cleaned = words.join(" ");

    respondWithJSON(res, 200, {
        cleanedBody: cleaned,
    });
}
