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
    const {body, userId} = req.body;

    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }

    if(!body) {
        throw new BadRequestError("Missing required fields");
    }

    if (!userId) {
        throw new UnauthorizedError("You must be logged in to chirp");
    }

    const chirp = await createChirp({user_id: userId, body: body});
    if (!chirp) {
        throw new Error("Failed to create chirp");
    }

    // const words = body.split(" ");

    // const baddies = ["kerfuffle", "sharbert", "fornax"];
    // for (let i = 0; i < words.length; i++) {
    //     const word = words[i];
    //     const loweredWord = word.toLowerCase();
    //     if (baddies.includes(loweredWord)) {
    //         words[i] = "****";
    //     }
    // }

    // const cleaned = words.join(" ");

    // if valid, save to db


    respondWithJSON(res, 201, {
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.user_id
    });

}