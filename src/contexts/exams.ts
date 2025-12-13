import { createContext, type Accessor, type Setter } from "solid-js";
import type { ExamStateCode } from "~/db/constants";

export interface ExamListContext {
  q: Accessor<string>;
  setQ: Setter<string>;
  currentPage: Accessor<number>;
  setCurrentPage: Setter<number>;
  pageSize: Accessor<number>;
  setPageSize: Setter<number>;
  pageCount: Accessor<number>;
  filters: Accessor<ExamStateCode[]>;
  setFilters: Setter<ExamStateCode[]>;
}

export default createContext<ExamListContext | undefined>(undefined);
