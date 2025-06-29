import type { Request, Response } from "express";
import { createChirp, deleteChirp, getChirp, getChirps, getChirpsById } from "../db/queries/chirps.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./error.js";
import { respondWithJSON } from "./json.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";

// get all chirps
export async function handleGetChirps(req: Request, res: Response) {
    // const chirps = await getChirps();

    // let authorId = "";
    // let authorIdQuery = req.query.authorId;

    // obj literals handle undefined gracefully
    let userId = `${req.query.authorId || ''}`;
    let sort: "asc" | "desc" = req.query.sort == 'desc'
        ? 'desc'
        : 'asc';
    // let sort: "asc" | "desc" = `${req.query.sort || 'asc'}`;

    // if (typeof authorIdQuery === "string") {
    //     authorId = authorIdQuery;
    // }

    // !wtf why?!
    // let sortDirection = "asc";
    // let sortDirectionParam = req.query.sort;
    // if (sortDirectionParam === "desc") {
    //     sortDirection = "desc";
    // }

    // const filteredChirps = chirps.filter(
    //     (chirp) => chirp.userId === authorId || authorId === "",
    // );
    // filteredChirps.sort((a, b) =>
    //     sortDirection === "asc"
    //         ? a.createdAt.getTime() - b.createdAt.getTime()
    //         : b.createdAt.getTime() - a.createdAt.getTime(),
    // );

    // const {authorId} = req.query;
    // const id = String(authorId);
    // console.log("params", authorId)

    let chirps = {}
    if(userId) {
        chirps = await getChirps(userId, sort);
        console.log("authors chirps")
    } else {
        chirps = await getChirps(null, sort);
        console.log("all chirps")
    }

    respondWithJSON(res, 200, chirps);

}

// get single chirp
export async function handleGetChirp(req: Request, res: Response) {
    const { chirpID } = req.params;
    const chirp = await getChirp(chirpID);

    if (!chirp) {
        throw new NotFoundError(`Chirp with chirpId: ${chirpID} not found`);
    }
    respondWithJSON(res, 200, chirp);
}



// create chirp
export async function handleUserChirps(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;

    const user_token = getBearerToken(req);
    const userId = validateJWT(user_token, config.jwt.secret)

    const cleaned = validateChirp(params.body);
    const chirp = await createChirp({ body: cleaned, userId });


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

export async function handlerDeleteChirp(req: Request, res: Response) {
    const { chirpId } = req.params;

    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);

    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
    }

    if (chirp.userId !== userId) {
        throw new ForbiddenError("You can't delete this chirp");
    }

    const deleted = await deleteChirp(chirpId);
    if (!deleted) {
        throw new Error(`Failed to delete chirp with chirpId: ${chirpId}`);
    }

    res.status(204).send();
}