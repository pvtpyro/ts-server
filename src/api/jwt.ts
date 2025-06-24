import { JwtPayload } from "jsonwebtoken";

const jwt = require('jsonwebtoken');

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
// iss is the issuer of the token. Set this to chirpy
// sub is the subject of the token, which is the user's ID.
// iat is the time the token was issued. Use Math.floor(Date.now() / 1000) to get the current time in seconds.
// exp is the time the token expires. Use iat + expiresIn to set the expiration

export async function makeJWT(userID: string, expiresIn: number, secret: string) {
    const options = {
        expiresIn: expiresIn
    };

    const token = jwt.sign(userID, secret, options);
    return token;
}