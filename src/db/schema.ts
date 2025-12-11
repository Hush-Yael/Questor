import { sql } from "drizzle-orm";
import { int, numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";
import * as constants from "./constants";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  password: text().notNull(),
  role: text({ enum: constants.userRoles }).notNull().default("student"),
});

export const subjects = sqliteTable("subjects", {
  id: int().primaryKey({ autoIncrement: true }),
  teacherId: int()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull().unique(),
  semester: int().notNull(),
});

export const exams = sqliteTable("exams", {
  id: int().primaryKey({ autoIncrement: true }),
  subjectId: int()
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  teacherId: int()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull(),
  description: text(),
  createdAt: int({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('subsecond') * 1000)`),
  updatedAt: int({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('subsecond') * 1000)`),
  startsAt: int({ mode: "timestamp_ms" }),
  endsAt: int({ mode: "timestamp_ms" }),
  state: text({ enum: constants.examStatesCodes }).notNull(),
  duration: int(),
  maxAttempts: int().notNull().default(1),
  score: numeric({ mode: "number" }).notNull(),
});

export const questions = sqliteTable("questions", {
  id: int().primaryKey({ autoIncrement: true }),
  examId: int()
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  type: text({
    enum: constants.questionsCodes,
  }).notNull(),
  booleanAnswer: int({ mode: "boolean" }),
  prompt: text().notNull(),
  score: numeric({ mode: "number" }).notNull(),
  index: int().notNull(),
});

export const questionOptions = sqliteTable("question_options", {
  id: int().primaryKey({ autoIncrement: true }),
  examId: int()
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  questionId: int()
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  label: text().notNull(),
  isCorrect: int({ mode: "boolean" }).notNull(),
});

export const studentAnswers = sqliteTable("student_answers", {
  id: int().primaryKey({ autoIncrement: true }),
  examId: int()
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  questionId: int()
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  studentId: int()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  attemptId: int()
    .notNull()
    .references(() => studentAttempts.id, { onDelete: "cascade" }),
  text: text().notNull(),
});

export const studentAttempts = sqliteTable("student_attempts", {
  id: int().primaryKey({ autoIncrement: true }),
  examId: int()
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  studentId: int()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startedAt: int({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('subsecond') * 1000)`),
  finishedAt: int({ mode: "timestamp_ms" }),
  score: numeric({ mode: "number" }).notNull(),
  state: text({ enum: constants.examAttemptCodes }).notNull(),
});
