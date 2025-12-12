import * as z from "zod";
import * as tables from "./schema";
import * as constants from "./constants";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const customErrors = {
  invalidValue: (issue: z.core.$ZodRawIssue) =>
    issue.input === undefined
      ? "El campo es requerido."
      : "El valor no es válido",
  minLength: (amount: number) => `Se requieren al menos ${amount} caracteres`,
  maxLength: (amount: number) =>
    `El máximo de caracteres aceptados es ${amount}`,
  minValue: (amount: number) => `El valor mínimo debe ser ${amount}`,
  maxValue: (amount: number) => `El valor máximo debe ser ${amount}`,
} as const;

const common = {
  minInt1: z
    .int({ error: customErrors.invalidValue })
    .min(1, customErrors.minValue(1)),

  get optionalMinInt1() {
    return this.minInt1.optional();
  },

  minNum1: z
    .number({ error: customErrors.invalidValue })
    .min(1, customErrors.minValue(1)),

  numMinMax: (min: number, max: number) =>
    z
      .number({ error: customErrors.invalidValue })
      .min(min, customErrors.minLength(min))
      .max(max, customErrors.maxLength(max)),

  strMinMax: (min: number, max: number) =>
    z
      .string({ error: customErrors.invalidValue })
      .min(min, customErrors.minLength(min))
      .max(max, customErrors.maxLength(max)),
};

export const users = {
  select: createSelectSchema(tables.users),
  insert: createInsertSchema(tables.users, {
    username: common.strMinMax(3, 64),
    password: common.strMinMax(import.meta.env.PROD ? 8 : 3, 72),
    role: z
      .enum(constants.userRoles, {
        error: customErrors.invalidValue,
      })
      .default("student"),
  }).omit({ id: true }),
};

export const subjects = {
  select: createSelectSchema(tables.subjects),
  insert: createInsertSchema(tables.subjects, {
    teacherId: common.minInt1,
    name: common.strMinMax(3, 64),
    semester: common.minInt1,
  }),
};

export const exams = {
  select: createSelectSchema(tables.exams),
  insert: createInsertSchema(tables.exams, {
    subjectId: common.minInt1,
    teacherId: common.minInt1,
    name: common.strMinMax(3, 128),
    description: common.strMinMax(1, 255).optional(),
    state: z.enum(constants.examStates.codes, {
      error: customErrors.invalidValue,
    }),
    createdAt: common.optionalMinInt1,
    updatedAt: common.optionalMinInt1,
    startsAt: common.optionalMinInt1,
    endsAt: common.optionalMinInt1,
    durationSeconds: common.minInt1.max(1440, customErrors.maxValue(1440)).optional(),
    maxAttempts: common.optionalMinInt1,
    score: common.minNum1.max(100, customErrors.maxValue(100)),
  }).omit({ id: true }),
};

export const questions = {
  select: createSelectSchema(tables.questions),
  insert: createInsertSchema(tables.questions, {
    examId: common.minInt1,
    type: z.enum(constants.questionTypes.codes, {
      error: customErrors.invalidValue,
    }),
    booleanAnswer: z.boolean({ error: customErrors.invalidValue }).optional(),
    prompt: common.strMinMax(1, 255),
    score: z.number({ error: customErrors.invalidValue }),
    index: z.number({ error: customErrors.invalidValue }),
  }).omit({ id: true }),
};

export const questionOptions = {
  select: createSelectSchema(tables.questionOptions),
  insert: createInsertSchema(tables.questionOptions, {
    examId: common.minInt1,
    questionId: common.minInt1,
    label: common.strMinMax(1, 255),
    isCorrect: z.boolean({ error: customErrors.invalidValue }),
  }).omit({ id: true }),
};

export const studentAnswers = {
  select: createSelectSchema(tables.studentAnswers),
  insert: createInsertSchema(tables.studentAnswers, {
    examId: common.minInt1,
    questionId: common.minInt1,
    studentId: common.minInt1,
    text: common.strMinMax(1, 512),
  }).omit({ id: true }),
};

export const studentAttempts = {
  select: createSelectSchema(tables.studentAttempts),
  insert: createInsertSchema(tables.studentAttempts, {
    examId: common.minInt1,
    studentId: common.minInt1,
    startedAt: common.minInt1,
    finishedAt: common.optionalMinInt1,
    score: common.minNum1.max(100, customErrors.maxValue(100)),
    state: z.enum(constants.examAttemptStates.codes, {
      error: customErrors.invalidValue,
    }),
  }).omit({ id: true }),
};
