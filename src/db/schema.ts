import { pgTable, timestamp, varchar, uuid, text, boolean } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
    hashedPassword: varchar("hashed_password").notNull().default("unset"),
    isChirpyRed: boolean("is_chirpy_red").default(false)
});
export type NewUser = typeof users.$inferInsert;


export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: varchar("body", { length: 256 }).notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
})
export type NewChirp = typeof chirps.$inferInsert;


export const refreshTokens = pgTable("refresh_tokens", {
    token: varchar("token", { length: 256 }).primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at")
});
export type RefreshTokens = typeof refreshTokens.$inferInsert;