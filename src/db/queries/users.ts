import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { firstOrUndefined } from "./utils.js";

export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function reset() {
    await db.delete(users);
}

export async function getUserByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
	return firstOrUndefined(result);
}

export async function updateUser(id:string, email:string, hashed: string) {
    const [result] = await db
        .update(users)
        .set({email: email, hashedPassword: hashed})
        .where(eq(users.id, id))
        .returning();

    return result;
}