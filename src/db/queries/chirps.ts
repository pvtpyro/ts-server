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

export async function getChirps(id?: string | null, sort:"asc" | "desc" = "asc") {
    const results = await db.query.chirps.findMany({
        where: id ? eq(chirps.userId, id) : undefined,
        orderBy: (chirps, ctx) => [ctx[sort](chirps.createdAt)],
    });

    return results;
}

export async function getChirpsById(id: string) {
    const results = await db.select()
        .from(chirps)
        .where(eq(chirps.userId, id))
    return results;
}

export async function getChirp(id: string) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    return result;
}

export async function deleteChirp(id: string) {
    const rows = await db.delete(chirps).where(eq(chirps.id, id)).returning();
    return rows.length > 0;
}