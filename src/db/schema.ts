import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import * as constants from "./constants";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  password: text().notNull(),
  role: text({ enum: constants.userRoles }).notNull().default("student"),
});
