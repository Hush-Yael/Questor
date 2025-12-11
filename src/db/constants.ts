export const userRoles = ["student", "teacher"] as const;

export const examStatesEnum = {
  PENDING: "0",
  FINISHED: "1",
  UNAVAILABLE: "2",
  DRAFT: "3",
} as const;

export type ExamStateCode =
  (typeof examStatesEnum)[keyof typeof examStatesEnum];

export const examStatesCodes = Object.values(examStatesEnum) as [
  string,
  ...ExamStateCode[],
];

export const examStatesLabels = {
  [examStatesEnum.PENDING]: "Pendiente",
  [examStatesEnum.FINISHED]: "Finalizado",
  [examStatesEnum.UNAVAILABLE]: "No disponible",
  [examStatesEnum.DRAFT]: "Borrador",
} as const;

export const examAttemptEnum = {
  IN_PROGRESS: "0",
  FINISHED: "1",
} as const;

export type ExamAttemptCode =
  (typeof examAttemptEnum)[keyof typeof examAttemptEnum];

export const examAttemptCodes = Object.values(examAttemptEnum) as [
  string,
  ...ExamAttemptCode[],
];

export const examAttemptLabels = {
  [examAttemptEnum.IN_PROGRESS]: "En progreso",
  [examAttemptEnum.FINISHED]: "Finalizado",
} as const;

export const questionsEnum = {
  SELECT: "0",
  MULTI_SELECT: "1",
  TRUE_FALSE: "2",
  ANSWER: "3",
} as const;

export type QuestionCode = (typeof questionsEnum)[keyof typeof questionsEnum];

export const questionsCodes = Object.values(questionsEnum) as [
  string,
  ...QuestionCode[],
];

export const questionLabels = {
  [questionsEnum.SELECT]: "Elección",
  [questionsEnum.MULTI_SELECT]: "Elección múltiple",
  [questionsEnum.TRUE_FALSE]: "Verdadero/Falso",
  [questionsEnum.ANSWER]: "Respuesta",
} as const;
