import { For, Show, createSignal, useContext } from "solid-js";
import { RiDocumentFile4Line } from "solid-icons/ri";
import Exam from "~/components/pages/exams/exam";
import type { UseQueryResult } from "@tanstack/solid-query";
import { deleteExam, type ExamsPaginatedData, type ListExam } from "~/lib/db";
import Drawer from "@corvu/drawer";
import { Content } from "~/components/ui/popover/drawer";
import { Link } from "@tanstack/solid-router";
import { HiSolidTrash } from "solid-icons/hi";
import { RiDesignEdit2Fill } from "solid-icons/ri";
import { useServerFn } from "@tanstack/solid-start";
import { toast } from "~/components/ui/toast/fns";
import { useQueryClient } from "@tanstack/solid-query";
import { paginatedQueryKey, totalQueryKey } from "~/routes/__authed/exams";
import ExamListContext from "~/contexts/exams";

const timeOpts: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour12: true,
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
};

export type ExamInfo = Pick<
  ListExam,
  "id" | "name" | "createdAt" | "startsAt" | "endsAt" | "updatedAt"
>;

export default function List<
  T extends UseQueryResult<ExamsPaginatedData>,
>(props: { query: T }) {
  const { currentPage } = useContext(ExamListContext)!;
  const qClient = useQueryClient();
  const [open, setOpen] = createSignal(false);
  const [info, setInfo] = createSignal<undefined | ExamInfo>(
    props.query.data?.rows[0]
  );

  const deleteFn = useServerFn(deleteExam);

  return (
    <div class="group col w-full min-h-full flex-1 ma -mt-[--rounded-decoration-h] has-[[data-empty-msg]]:mb-[--bottom-nav-h] p-4 px-6 pb-[calc(var(--bottom-nav-h)+var(--rounded-decoration-h))] overflow-y-auto">
      <ul
        id="items-list"
        class="col gap-y-6 gap-x-4 flex-1 max-[825px]:items-center min-[825px]:(grid grid-cols-2 justify-center)"
        onKeyDown={(e) => {
          const { target, currentTarget, key } = e;
          if (target.closest("[data-corvu-drawer-trigger]")) {
            // change tabindex to next/previous
            if (/Arrow(Left|Right)|Home|End/.test(key)) {
              const nodes = currentTarget.children;
              const index = Array.from(currentTarget.children).indexOf(
                target.closest("li") as HTMLLIElement
              );

              let nextTargetParent: HTMLLIElement;

              if (!e.ctrlKey && (key === "End" || key === "Home")) {
                e.preventDefault();
                if (key === "Home")
                  nextTargetParent =
                    currentTarget.firstElementChild as HTMLLIElement;
                else
                  nextTargetParent = nodes[nodes.length - 1] as HTMLLIElement;
              } else {
                if (key === "ArrowLeft") {
                  if (index === 0)
                    nextTargetParent = nodes[nodes.length - 1] as HTMLLIElement;
                  else
                    nextTargetParent = currentTarget.children[
                      index - 1
                    ] as HTMLLIElement;
                } else if (key === "ArrowRight") {
                  if (index === nodes.length - 1)
                    nextTargetParent =
                      currentTarget.firstElementChild as HTMLLIElement;
                  else
                    nextTargetParent = currentTarget.children[
                      index + 1
                    ] as HTMLLIElement;
                } else return;
              }

              const nextTarget = nextTargetParent?.querySelector(
                "[data-corvu-drawer-trigger]"
              );

              if (nextTarget && nextTarget instanceof HTMLButtonElement) {
                target.setAttribute("tabindex", "-1");
                nextTarget.setAttribute("tabindex", "0");
                nextTarget.scrollIntoView({ block: "center" });
                nextTarget.focus();
              }
            }
          }
        }}
      >
        <Show
          when={!props.query.isLoading}
          fallback={<div class="loader" role="status" aria-label="cargando" />}
        >
          <Drawer open={open()} onOpenChange={setOpen}>
            <Content>
              {info() && (
                <div class="col gap-y-3">
                  <div class="col gap-y-2">
                    <div class="flex gap-2 *:flex-1 mla" role="group">
                      <button
                        class="btn icon circle size-min-7 bg-danger text-danger-text"
                        aria-label="Borrar"
                        onClick={() => {
                          if (confirm("¿Estás seguro de borrar este examen?")) {
                            setOpen(false);
                            toast.promise(deleteFn({ data: info()!.id }), {
                              loading: "Eliminando examen...",
                              success: () => {
                                qClient.setQueryData(
                                  totalQueryKey,
                                  (data: number) => data - 1
                                );

                                qClient.setQueryData(
                                  paginatedQueryKey(currentPage()),
                                  (data: ExamsPaginatedData) => {
                                    return {
                                      pagination: {
                                        ...data.pagination,
                                        rowCount: data.pagination.rowCount - 1,
                                      },
                                      rows: data.rows.filter(
                                        (row) => row.id !== info()!.id
                                      ),
                                    };
                                  }
                                );

                                return "Examen eliminado";
                              },
                              error: (err) =>
                                err.message || "Error al eliminar examen",
                            });
                          }
                        }}
                      >
                        <HiSolidTrash class="size-4" />
                      </button>

                      <Link
                        to="/exams/new"
                        search={{
                          id: info()?.id,
                        }}
                        class="btn icon circle size-min-7 primary"
                        aria-label="Editar"
                      >
                        <RiDesignEdit2Fill class="size-4" />
                      </Link>
                    </div>
                    <h2 class="font-600">{info()!.name}</h2>
                  </div>

                  <hr class="border-border" />

                  <div class="col gap-y-4">
                    <dl>
                      <dt class="font- text-(sm muted-text)">Añadido el:</dt>
                      <dd>
                        {info()!.createdAt
                          ? new Date(info()!.createdAt).toLocaleDateString(
                              "es",
                              timeOpts
                            )
                          : "Fecha no disponible"}
                      </dd>
                    </dl>

                    <dl>
                      <dt class="font- text-(sm muted-text)">
                        Última edición:
                      </dt>
                      <dd>
                        {info()!.updatedAt
                          ? new Date(info()!.updatedAt).toLocaleDateString(
                              "es",
                              timeOpts
                            )
                          : "Fecha no disponible"}
                      </dd>
                    </dl>

                    <dl>
                      <dt class="font- text-(sm muted-text)">
                        Fecha de inicio:
                      </dt>
                      <dd>
                        {info()?.startsAt
                          ? new Date(info()!.startsAt!).toLocaleString(
                              "es",
                              timeOpts
                            )
                          : "No especificada"}
                      </dd>
                    </dl>

                    <dl>
                      <dt class="font- text-(sm muted-text)">
                        Fecha de finalización
                      </dt>
                      <dd>
                        {info()?.endsAt
                          ? new Date(info()!.endsAt!).toLocaleString(
                              "es",
                              timeOpts
                            )
                          : "No especificada"}
                      </dd>
                    </dl>
                  </div>
                </div>
              )}
            </Content>

            <For
              each={props.query!.data!.rows}
              fallback={
                <li data-empty-msg class="text-center ma">
                  <span class="col gap-y-4 items-center">
                    <span class="fc p-3 rounded-full bg-translucent-1 text-(muted-text)">
                      <RiDocumentFile4Line class="size-11" />
                    </span>

                    <hgroup class="lh-[2]">
                      <h1 class="font-bold text-lg">
                        No hay nada para mostrar
                      </h1>
                      <p class="text-(muted-text)">
                        No se encontraron exámenes
                      </p>
                    </hgroup>
                  </span>
                </li>
              }
            >
              {(data, index) => (
                <Exam data={data} index={index} setInfo={setInfo} />
              )}
            </For>
          </Drawer>
        </Show>
      </ul>
    </div>
  );
}
