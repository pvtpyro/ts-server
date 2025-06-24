import type { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "./error.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken } from "./auth.js";
import { NewUser } from "../db/schema.js";
import { config } from "../config.js";
import { saveRefreshToken } from "../db/queries/tokens.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;
type LoginResponse = UserResponse & {
    token: string;
    refreshToken: string;
};


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
    if(!matches) {
        throw new UnauthorizedError("invalid username or password");
    }

    const token = await makeJWT(user.id, 60, config.jwt.secret);
    const refresh = await makeRefreshToken();

    const saved = await saveRefreshToken(user.id, refresh);
    if (!saved) {
        throw new UnauthorizedError("could not save refresh token");
    }

    if(!refresh) {
        throw new UnauthorizedError("could not save refresh token");
    }

    respondWithJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: token,
        refreshToken: refresh
    } satisfies LoginResponse)
}
