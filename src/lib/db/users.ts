import db from "~/db/";
import { eq } from "drizzle-orm";
import * as tables from "~/db/schema";

export const getUserById = async (id: number) => {
  return await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, id))
    .get();
};

export const getUserByName = async (username: string) => {
  return await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.username, username))
    .get();
};

export const createUser = async (data: typeof tables.users.$inferInsert) => {
  return await db.insert(tables.users).values(data).returning().get();
};
