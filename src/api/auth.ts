import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { Request, Response } from 'express';
import { UnauthorizedError } from "../api/error.js";
import crypto from "crypto";
import { config } from '../config.js';
import { respondWithJSON } from './json.js';
import { revokeRefreshToken, userForRefreshToken } from '../db/queries/tokens.js';

const TOKEN_ISSUER = "chirpy";

const saltRounds = 10;

export async function hashPassword(password: string) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

export async function checkPasswordHash(password: string, hash: string) {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password hash:', error);
        throw error;
    }
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;
    const token = jwt.sign(
        {
            iss: TOKEN_ISSUER,
            sub: userID,
            iat: issuedAt,
            exp: expiresAt,
        } satisfies payload,
        secret,
        { algorithm: "HS256" },
    );

    console.log("token", token)

    return token;
}

export function validateJWT(tokenString: string, secret: string) {
    let decoded: payload;
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (e) {
        throw new UnauthorizedError("Invalid token");
    }

    if (decoded.iss !== TOKEN_ISSUER) {
        throw new UnauthorizedError("Invalid issuer");
    }

    if (!decoded.sub) {
        throw new UnauthorizedError("No user ID in token");
    }

    return decoded.sub;
}

export function getBearerToken(req: Request) {
    // Bearer TOKEN_STRING
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new UnauthorizedError('Malformed authorization header');
    }

    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        return token;
    } else {
        throw new Error('Authorization header is not in the expected Bearer token format.');
    }
}

export async function makeRefreshToken() {
    return crypto.randomBytes(32).toString("hex");
}

export async function handlerRefresh(req: Request, res: Response) {
    let refreshToken = getBearerToken(req);

    console.log('DEBUG: refresh token', refreshToken)

    const result = await userForRefreshToken(refreshToken);
    console.log('DEBUG: userForRefreshToken', result)
    if (!result) {
        throw new UnauthorizedError("invalid refresh token");
    }

    const user = result.user;
    const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);

    type response = {
        token: string;
    };

    respondWithJSON(res, 200, {
        token: token,
    } satisfies response);
}

export async function handlerRevoke(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    await revokeRefreshToken(refreshToken);
    res.status(204).send();
}