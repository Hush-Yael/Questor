import { createServerFn } from "@tanstack/solid-start";
import { count, eq, getTableColumns, inArray, SQL, sql } from "drizzle-orm";
import db from "~/db";
import * as tables from "~/db/schema";
import * as tableSchemas from "~/db/validators";
import * as z from "zod";
import type { SQLiteSelect } from "drizzle-orm/sqlite-core";
import { getCookie, setCookie } from "@tanstack/solid-start/server";
import { examStates, type ExamStateCode } from "~/db/constants";

export const getOverview = createServerFn({ method: "GET" }).handler(
  async () => {
    const queries = await db.transaction(async (tx) => {
      const promises = [
        //* students
        tx
          .select({ count: count() })
          .from(tables.users)
          .where(eq(tables.users.role, "student")),
        //* exams
        tx.select({ count: count() }).from(tables.exams),
        //* subjects
        tx.select({ count: count() }).from(tables.subjects),
      ];

      const results = await Promise.all(promises);
      return results.map((rows) => (rows.length ? rows[0].count : 0));
    });

    return {
      students: queries[0],
      exams: queries[1],
      subjects: queries[2],
    };
  }
);

export const getExamsCount = createServerFn({ method: "GET" })
  .inputValidator(tableSchemas.exams.select.shape.teacherId)
  .handler(async ({ data: teacherId }) => {
    const countQ = await db
      .select({ count: count() })
      .from(tables.exams)
      .where(eq(tables.exams.teacherId, teacherId));

    return countQ[0].count;
  });

async function paginateQuery<T extends SQLiteSelect>(
  query: T,
  { pageSize, page }: { pageSize: number; page: number }
) {
  const rows = await query.limit(pageSize).offset((page - 1) * pageSize);
  const rowCount = rows[0]?.total ?? 0;
  const pageCount = Math.ceil(rowCount / pageSize);

  return {
    rows,
    pagination: { rowCount, pageCount },
  };
}

export const examCookiesValidators = {
  currentPage: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).default(1),
  q: z.string().trim().optional(),
  filters: z.union([
    z
      .string()
      .optional()
      .transform((str) => (str ? JSON.parse(str) : ([] as ExamStateCode[])))
      .pipe(z.array(z.enum(examStates.codes))),
    z.array(z.enum(examStates.codes)),
  ]),
};

export type ExamCookieName = "exams-last-visited-page" | "exams-page-size";

export const getExamsCookies = createServerFn({ method: "GET" }).handler(
  async () => {
    {
      let lastVisitedPage = Number(getCookie("exams-last-visited-page"));
      const { error: pageError } =
        examCookiesValidators.currentPage.safeParse(lastVisitedPage);

      if (pageError) {
        lastVisitedPage = 1;
        setCookie("exams-last-visited-page", lastVisitedPage.toString());
      }

      let pageSize = Number(getCookie("exams-page-size"));
      const { error: sizeError } =
        examCookiesValidators.pageSize.safeParse(pageSize);

      if (sizeError) {
        pageSize = 10;
        setCookie("exams-page-size", pageSize.toString());
      }

      let filters: string | ExamStateCode[] =
        getCookie("exams-filters") ?? "[]";
      const { error: filterError, data } =
        examCookiesValidators.filters.safeParse(filters);

      if (filterError) {
        filters = [];
        setCookie("exams-filters", JSON.stringify(filters));
      } else filters = data;

      return { pageSize, lastVisitedPage, filters };
    }
  }
);

export const getExams = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      teacherId: tableSchemas.exams.select.shape.teacherId,
      ...examCookiesValidators,
    })
  )
  .handler(async ({ data }) => {
    // await Promise.sleep(500);

    const _exams = tables.exams;

    const {
      // oxlint-disable-next-line no-unused-vars
      description,
      teacherId: _,
      // oxlint-disable-next-line no-unused-vars
      subjectId,
      ...columns
    } = getTableColumns(_exams);

    let rows = db
      .select({
        ...columns,
        subject: tables.subjects.name,
        questionsCount: count(tables.questions.examId),
        total: sql`count(*) over()`.as("total") as unknown as SQL<number>,
      })
      .from(_exams)
      .leftJoin(tables.questions, eq(_exams.id, tables.questions.examId))
      .leftJoin(tables.subjects, eq(_exams.subjectId, tables.subjects.id))
      .groupBy(_exams.id)
      .where(eq(_exams.teacherId, data.teacherId))
      .$dynamic();

    if (data.filters.length)
      rows = rows.where(inArray(_exams.state, data.filters));

    if (data.q && data.q.length)
      rows = rows.where(
        sql`LOWER(${_exams.name}) LIKE LOWER(${`%${data.q}%`})`
      );

    return await paginateQuery(rows, {
      pageSize: data.pageSize,
      page: data.currentPage,
    });
  });

export type PaginatedData<T> = {
  rows: T[];
  pagination: { rowCount: number; pageCount: number };
};

export type ListExam = Awaited<ReturnType<typeof getExams>>["rows"][number];
export type ExamsPaginatedData = PaginatedData<ListExam>;

export const deleteExam = createServerFn({ method: "POST" })
  .inputValidator(tableSchemas.exams.select.shape.id)
  .handler(async ({ data }) => {
    const { rowsAffected } = await db.delete(tables.exams).where(eq(tables.exams.id, data));
    if (!rowsAffected)
      throw new Error('No se pudo eliminar el examen');
  });