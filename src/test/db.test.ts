import { fakerES as f } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import db from "~/db";
import * as tables from "~/db/schema";
import { type ExamStateCode, examStatesEnum } from "~/db/constants";

const subjectsNames = [
  "Cálculo Diferencial e Integral",
  "Álgebra Lineal",
  "Geometría Analítica",
  "Ecuaciones Diferenciales",
  "Física ",
  "Química",
  "Estructuras de Datos",
  "Bases de Datos",
  "Programación",
  "Redes y Comunicaciones",
];

export const getFirstTeacherId = async () => {
  const object = await db
    .select({ id: tables.users.id })
    .from(tables.users)
    .where(eq(tables.users.role, "teacher"))
    .get();
  if (object === undefined) throw new Error("First teacher not found");
  return object.id;
};

const states: { value: ExamStateCode; weight: number }[] = [
  { value: examStatesEnum["PENDING"], weight: 0.85 },
  { value: examStatesEnum["FINISHED"], weight: 0.1 },
  { value: examStatesEnum["UNAVAILABLE"], weight: 0.05 },
  { value: examStatesEnum["DRAFT"], weight: 0.05 },
];

const fakeExam = (
  teacherId: number
): Omit<typeof tables.exams.$inferSelect, "id"> => {
  const createdAt = f.date.past();
  const updatedAt = f.date.future({ refDate: createdAt });

  return {
    teacherId,
    subjectId: f.helpers.rangeToNumber({ min: 1, max: 10 }),
    name: f.lorem.words({
      min: 2,
      max: 12,
    }),
    description: f.lorem.sentences({ min: 1, max: 4 }),
    duration: f.datatype.boolean()
      ? f.number.int({
          min: 60000,
          max: 3600 * 1000,
        })
      : null,
    state: f.helpers.weightedArrayElement(states),
    endsAt: null,
    startsAt: null,
    score: f.helpers.rangeToNumber({ min: 1, max: 100 }),
    createdAt,
    updatedAt,
    maxAttempts: f.helpers.rangeToNumber({ min: 1, max: 10 }),
  };
};

export const bulkInserts = {
  subjects: (teacherId: number) =>
    db.insert(tables.subjects).values(
      Array.from({ length: subjectsNames.length }, (_, i) => ({
        name: subjectsNames[i],
        semester: f.helpers.rangeToNumber({ min: 1, max: 10 }),
        teacherId,
      })) as (typeof tables.subjects.$inferInsert)[]
    ).onConflictDoUpdate,
  exams: (amount = 50, teacherId: number) =>
    db
      .insert(tables.exams)
      .values(
        Array.from({ length: amount }, () =>
          fakeExam(teacherId)
        ) as (typeof tables.exams.$inferInsert)[]
      ),
};
