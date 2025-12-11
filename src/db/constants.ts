export const userRoles = ["student", "teacher"] as const;

class WithEnum<Code extends string, CodeName extends string> {
  enum: Record<CodeName, Code>;
  codes: Code[];
  labels: Record<Code, CodeName>;

  constructor(data: { code: Code; label: string; codeName: CodeName }[]) {
    const _enum = Object.fromEntries(
      data.map(({ code, codeName }) => [codeName, code])
    );
    this.enum = _enum as Record<CodeName, Code>;

    this.codes = Object.values(_enum);
    this.labels = Object.fromEntries(
      data.map(({ code, label }) => [code, label])
    ) as Record<Code, CodeName>;
  }
}

export const examStates = new WithEnum([
  { codeName: "PENDING", code: "0", label: "Pendiente" },
  { codeName: "FINISHED", code: "1", label: "Finalizado" },
  { codeName: "UNAVAILABLE", code: "2", label: "No disponible" },
  { codeName: "DRAFT", code: "3", label: "Borrador" },
]);

export type ExamStateCode = (typeof examStates.codes)[number];

export const examAttemptStates = new WithEnum([
  { codeName: "IN_PROGRESS", code: "0", label: "En progreso" },
  { codeName: "FINISHED", code: "1", label: "Finalizado" },
]);

export type ExamAttemptCode = (typeof examAttemptStates.codes)[number];

export const questionTypes = new WithEnum([
  { codeName: "SELECT", code: "0", label: "Elección" },
  { codeName: "MULTI_SELECT", code: "1", label: "Elección múltiple" },
  { codeName: "TRUE_FALSE", code: "2", label: "Verdadero/Falso" },
  { codeName: "ANSWER", code: "3", label: "Respuesta" },
]);

export type QuestionCode = (typeof questionTypes.codes)[number];
