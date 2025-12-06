import * as z from "zod";
import * as tables from "./schema";
import * as constants from "./constants";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const customErrors = {
  invalidValue: (issue: z.core.$ZodRawIssue) =>
    issue.input === undefined
      ? "El campo es requerido."
      : "El valor no es válido",
  minValue: (amount: number) => `Se requieren al menos ${amount} caracteres`,
  maxValue: (amount: number) => `Se requieren menos de ${amount} caracteres`,
} as const;

export const tableSchemas = {
  users: {
    select: createSelectSchema(tables.users).omit({ id: true }),
    insert: createInsertSchema(tables.users, {
      username: z
        .string({ error: customErrors.invalidValue })
        .min(3, customErrors.minValue(3))
        .max(255, customErrors.maxValue(255)),
      password: z
        .string({
          error: customErrors.invalidValue,
        })
        .min(
          import.meta.env.PROD ? 8 : 3,
          customErrors.minValue(import.meta.env.PROD ? 8 : 3)
        )
        .max(255, customErrors.maxValue(255)),
      role: z
        .enum(constants.userRoles, {
          error: customErrors.invalidValue,
        })
        .default("student"),
    }).omit({ id: true }),
  },
} as const;
