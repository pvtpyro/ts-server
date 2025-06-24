import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { firstOrUndefined } from "./utils.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
    return result;
}

export async function getChirps() {
    const results = await db.query.chirps.findMany({
        orderBy: (chirps, { asc }) => [asc(chirps.createdAt)],
    });
    return results;
}

export async function getChirp(id: string) {
    const result = await db.select().from(chirps)
        .where(eq(chirps.id, id));
    return firstOrUndefined(result);
}