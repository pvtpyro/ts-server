import type { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "./error.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, hashPassword } from "./auth.js";
import { NewUser } from "src/db/schema.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;


export async function handleUsers(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };
    const params: parameters = req.body;

    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const hashed = await hashPassword(params.password)
    const user = await createUser({email: params.email, hashedPassword: hashed} satisfies NewUser)
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

export async function handleLogin(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };
    const params: parameters = req.body;

    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const user = await getUserByEmail(params.email)
    if (!user) {
        throw new Error("User doesn't exist");
    }
    console.log("user", user)

    const matches = await checkPasswordHash(params.password, user.hashedPassword)
    if(matches) {
        respondWithJSON(res, 200, {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } satisfies NewUser)
    } else {
        throw new UnauthorizedError("Incorrect email or password")
    }
}