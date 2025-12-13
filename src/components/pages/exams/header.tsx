import { useQueryClient, type UseQueryResult } from "@tanstack/solid-query";
import { BiRegularSearchAlt } from "solid-icons/bi";
import { CgOptions } from "solid-icons/cg";
import { For, useContext, createSignal, Show } from "solid-js";
import Drawer, { Close } from "~/components/ui/popover/drawer";
import { examStates } from "~/db/constants";
import "~/components/ui/styles/options.css";
import ExamsListContext from "~/contexts/exams";
import { paginatedQueryKey } from "~/routes/__authed/exams";
import type { ExamsPaginatedData } from "~/lib/db";
import { debounce } from "@tanstack/pacer";

export default function Header<
  T extends UseQueryResult<number>,
  Q extends UseQueryResult<ExamsPaginatedData>,
>(props: { totalQuery: T; paginatedQuery: Q }) {
  const { q, setQ, currentPage } = useContext(ExamsListContext)!;
  const qClient = useQueryClient();

  const searchFn = debounce(
    (search: string) => {
      setQ(search);
      qClient.invalidateQueries({
        queryKey: paginatedQueryKey(currentPage()),
      });
    },
    { wait: 500 }
  );

  return (
    <header
      class="sticky z-1 top-[--header-height]  bg-primary w-full border-t border-#fff3 pt-4 duration-500 ease-in-out"
      style={{ "transition-property": "translate" }}
    >
      <div class="col gap-y-2 max-w-400px mxa px-4">
        <div class="text-primary-text pl-2">
          <span class="text-sm">
            <span class="opacity-80">Exámenes totales:</span>{" "}
            <b class="font-500">{props.totalQuery.data}</b>
          </span>
          <span class="opacity-80">,</span>{" "}
          <span class="text-sm">
            <span class="opacity-80">en el conjunto:</span>{" "}
            <b class="font-500">
              {props.paginatedQuery.isLoading
                ? "..."
                : (props.paginatedQuery.data?.pagination.rowCount ?? 0)}
            </b>
          </span>
        </div>

        <div
          role="group"
          class="flex items-center gap-x-2.5 p-1.5 px-4 rounded-full outline-(1 solid #0000) -outline-offset-2 bg-primary-text shadow-[--elevated-shadow] not-focus-within:text-muted-text focus-within:(outline-#0005) dark:focus-within:text-base transition-[outline-color,color] ease-in-out duration-300"
        >
          <Show
            when={!props.paginatedQuery.isFetching}
            fallback={<div class="loader size-3.5" />}
          >
            <BiRegularSearchAlt class="scale-110 translate-y-0.25" />
          </Show>
          <label class="flex-1 text-sm" for="search">
            <input
              type="search"
              id="search"
              placeholder="Buscar por nombre..."
              class="w-full outline-0 placeholder-current"
              aria-controls="items-list"
              value={q()}
              onInput={(e) => searchFn(e.target.value.trim())}
            />
          </label>
          <hr
            aria-orientation="vertical"
            class="min-h-4 w-[1px] bg-#0002 dark:bg-#fff2 border-0"
          />
          <Opts />
        </div>
      </div>

      <div class="h-[var(--rounded-decoration-h)] w-full bg-[--base-background] rounded-t-2xl mt-5 mx0!" />
    </header>
  );
}

const classes = {
  input:
    "flex items-center gap-x-3 p-1.5 px-3 border border-input rounded-field shadow-[0_5.5px_10.5px_-4px_#00000014,_0_1px_2px_-5px_#00000014] dark:shadow-[0_5.5px_10.5px_-4px_#00000034,_0_1px_2px_-5px_#00000034] transition-[border-color,background-color] ease-in-out duration-300",
  get opt() {
    return (
      this.input +
      " media-mouse:hover:(border-primary/35 bg-primary/3) media-touch:active:(border-primary/35 bg-primary/3) peer-checked:(border-primary bg-primary/10 text-[color-mix(in_srgb,_var(--base-text),var(--primary))])"
    );
  },
};

const Opts = () => {
  const { currentPage, pageSize, setPageSize, filters, setFilters } =
    useContext(ExamsListContext)!;
  const qClient = useQueryClient();

  const [_filters, _setFilters] = createSignal(filters());
  let newPageSize = pageSize();

  return (
    <Drawer
      initialOpen
      label="Configuración y filtros"
      onOpenChange={(isOpen) => {
        if (!isOpen) _setFilters(filters());
      }}
      trigger={(p) => (
        <button
          {...p}
          type="button"
          class="btn icon sm circle media-mouse:not-disabled:hover:bg-#0002 media-touch:not-disabled:active:bg-#0002 data-[open]:not-disabled:bg-#0002 media-mouse:focus-visible:(bg-#0002 ring-1) text-current!"
          aria-label="Opciones"
        >
          <CgOptions class="scale-140" />
        </button>
      )}
    >
      <Close
        class="btn md primary order-1 mt-3 w-full"
        autofocus
        onClick={() => {
          setFilters(_filters());
          setPageSize(newPageSize);

          qClient.invalidateQueries({
            queryKey: paginatedQueryKey(currentPage()),
          });
        }}
      >
        Aplicar
      </Close>

      <div class="col gap-y-4 mt-7">
        <label class="flex items-center justify-between gap-x-4">
          <span class="min-w-max flex-1">Cantidad por página:</span>
          <input
            type="number"
            class={classes.input + " max-w-23 ml-auto px-2 py-0.5 text-right"}
            value={pageSize()}
            onChange={(e) => (newPageSize = Number(e.currentTarget.value))}
          />
        </label>

        <div
          role="group"
          class="flex flex-col gap-y-2 py-4"
          aria-labelledby="filter-label"
        >
          <p id="filter-label">Mostrar según estado:</p>

          <div>
            <input
              checked={!_filters().length}
              onChange={() => _setFilters([])}
              class="sr-only peer"
              type="radio"
              name="filter"
              id="any"
            />
            <label for="any" class={classes.opt + " cursor-pointer"}>
              <span class="radio size-4.5" />
              Cualquiera
            </label>
          </div>

          <For each={Object.entries(examStates.enum)}>
            {([codeName, code]) => (
              <div>
                <input
                  type="checkbox"
                  class="sr-only peer"
                  name="filter"
                  id={codeName}
                  checked={_filters().includes(code)}
                  onChange={() =>
                    _setFilters((p) =>
                      p.includes(code)
                        ? p.filter((c) => c !== code)
                        : [...p, code]
                    )
                  }
                />
                <label
                  for={codeName}
                  class={classes.opt + "input cursor-pointer"}
                >
                  <span class="checkbox size-4" />
                  {examStates.labels[code]}
                </label>
              </div>
            )}
          </For>
        </div>
      </div>
    </Drawer>
  );
};
