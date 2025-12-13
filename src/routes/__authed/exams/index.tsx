import {
  queryOptions,
  useQuery,
  keepPreviousData,
} from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { createEffect, createMemo, onMount } from "solid-js";
import {
  getExams,
  getExamsCount,
  getExamsCookies,
  type ExamCookieName,
} from "~/lib/db";
import { RiSystemAddFill } from "solid-icons/ri";
import { createSignal } from "solid-js";
import { setCookie } from "~/lib/server/utils";
import PaginationNav from "~/components/pages/exams/nav";
import List from "~/components/pages/exams/list";
import Header from "~/components/pages/exams/header";
import ExamsContext from "~/contexts/exams";
import { type ExamStateCode } from "~/db/constants";

export const totalQueryKey = ["exams-count"];

const totalQueryOpts = (teacherId: number) =>
  queryOptions({
    queryKey: totalQueryKey,
    queryFn: () => getExamsCount({ data: teacherId }),
  });

export const paginatedQueryKey = (currentPage: number) => [
  "exams-list",
  currentPage,
];

const paginatedQueryOpts = (data: {
  teacherId: number;
  currentPage: number;
  pageSize: number;
  filters: ExamStateCode[];
  q: string;
}) =>
  queryOptions({
    queryKey: paginatedQueryKey(data.currentPage),
    queryFn: () => getExams({ data }),
    placeholderData: keepPreviousData,
  });

export const Route = createFileRoute("/__authed/exams/")({
  component: RouteComponent,
  beforeLoad: () => getExamsCookies(),
  loader: async ({ context }) => {
    return Promise.all([
      context.queryClient.ensureQueryData({
        ...totalQueryOpts(context.user.id),
        revalidateIfStale: true,
      }),
      context.queryClient.ensureQueryData({
        ...paginatedQueryOpts({
          teacherId: context.user.id,
          currentPage: context.lastVisitedPage,
          pageSize: context.pageSize,
          filters: context.filters,
          q: "",
        }),
        revalidateIfStale: true,
      }),
    ]);
  },
});

function RouteComponent() {
  const context = Route.useRouteContext();
  const {
    user,
    pageSize: storedPageSize,
    filters: storedFilters,
    queryClient,
    lastVisitedPage,
  } = context();

  const [currentPage, setCurrentPage] = createSignal(lastVisitedPage);
  const [pageSize, setPageSize] = createSignal(storedPageSize);
  const [filters, setFilters] = createSignal(storedFilters);
  const [q, setQ] = createSignal("");

  const totalQuery = useQuery(() => totalQueryOpts(user.id));
  const paginatedQuery = useQuery(() =>
    paginatedQueryOpts({
      teacherId: user.id,
      currentPage: currentPage(),
      pageSize: pageSize(),
      filters: filters(),
      q: q(),
    })
  );

  const pageCount = createMemo(
    () => paginatedQuery.data?.pagination?.pageCount ?? 0
  );

  createEffect(() => {
    // Se envía a la primera página al excederse de la cantidad
    if (!paginatedQuery.isLoading) {
      if (currentPage() > pageCount()) setCurrentPage(1);
      if (lastVisitedPage > pageCount())
        setCookie({
          data: {
            name: "exams-last-visited-page" satisfies ExamCookieName,
            value: "1",
          },
        });
    }
  });

  onMount(() => {
    // Guardar valores cuando cambian en cookies
    createEffect(() => {
      const cookies = [
        {
          name: "exams-last-visited-page" satisfies ExamCookieName,
          value: currentPage().toString(),
        },
        {
          name: "exams-page-size" satisfies ExamCookieName,
          value: pageSize().toString(),
        },
      ];

      cookies.forEach((cookie) => {
        setCookie({
          data: cookie,
        });
      });
    });
  });

  // Prefetch the next currentPage
  createEffect(() => {
    if (!paginatedQuery.isPlaceholderData && totalQuery.data! === pageSize()) {
      const next = currentPage() + 1;
      queryClient.prefetchQuery({
        queryKey: ["exams-list", next],
        queryFn: () =>
          getExams({
            data: {
              teacherId: user.id,
              currentPage: next,
              pageSize: pageSize(),
              filters: filters(),
              q: q(),
            },
          }),
      });
    }
  });

  return (
    <main
      class="col gap-y-5 flex-grow-1 [&_[data-data-popper-positioner]]:z-100! peer-[[data-hidden=true]]/header:[&>header]:-transform-translate-y-[--header-height]"
      style={{
        "--bottom-nav-h": "55px",
        "--rounded-decoration-h": "32px",
        "--list-padding": "16px",
      }}
    >
      <ExamsContext.Provider
        value={{
          q,
          setQ,
          currentPage,
          setCurrentPage,
          pageSize,
          setPageSize,
          pageCount,
          filters,
          setFilters,
        }}
      >
        <Header totalQuery={totalQuery} paginatedQuery={paginatedQuery} />

        <List query={paginatedQuery} />

        <Link
          to="/exams/new"
          class="fixed bottom-[calc(var(--bottom-nav-h)+var(--list-padding))] right-[--list-padding] btn icon circle xl primary"
          aria-label="Añadir examen"
        >
          <RiSystemAddFill class="size-7" />
        </Link>

        <PaginationNav lastVisitedPage={lastVisitedPage} />
      </ExamsContext.Provider>
    </main>
  );
}
