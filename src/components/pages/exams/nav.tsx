import {
  BiRegularArrowToRight,
  BiRegularRightArrowAlt,
  BiRegularLeftArrowAlt,
  BiRegularArrowToLeft,
} from "solid-icons/bi";
import Tooltip from "~/components/ui/popover/tooltip";
import Drawer, { Close as CloseDW } from "~/components/ui/popover/drawer";
import { useContext } from "solid-js";
import ExamsListContext from "~/contexts/exams";

const classes = {
  navBtn:
    "btn icon circle not-disabled:bg-#00000009 dark:not-disabled:not-hover:not-disabled:bg-#ffffff09 ghost md",
};

export default function PaginationNav(props: { lastVisitedPage: number }) {
  const { setCurrentPage, pageCount, currentPage } =
    useContext(ExamsListContext)!;
  let goToVal: number = props.lastVisitedPage;

  return (
    <nav class="fixed bottom-0 left-0 right-0 z-1">
      <ul class="flex justify-center items-center gap-x-4 h-[--bottom-nav-h] bg-elevated text-muted-text shadow-[inset_0_-1px_3px_#00000003,0_-2px_25px_#00000020,0_-4px_8px_#00000015] dark:shadow-[inset_0_2px_4px_#ffffff18,0_-2px_15px_#00000050,_0_-4px_8px_#00000015]">
        <li>
          <Tooltip
            class={classes.navBtn}
            aria-label="Primera página"
            content="Ir a la primera página"
            disabled={currentPage() === 1}
            onClick={() => setCurrentPage(1)}
          >
            <BiRegularArrowToLeft class="size-5" />
          </Tooltip>
        </li>

        <li>
          <Tooltip
            class={classes.navBtn}
            aria-label="Página anterior"
            content="Ir a la página anterior"
            disabled={currentPage() === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <BiRegularLeftArrowAlt class="size-5" />
          </Tooltip>
        </li>

        <li>
          <div class="relative flex items-center gap-x-4 relative mx-2 text-sm">
            <span class="font-medium select-none">
              Página {currentPage()} de {pageCount()}
            </span>
            <Drawer
              side="top"
              trigger={(props) => (
                <Tooltip
                  {...props}
                  type="button"
                  onClick={props.onClick}
                  class="absolute -inset-1 cursor-pointer"
                  aria-label="Ir a la página..."
                  content="Pulsa para ir a una página específica"
                />
              )}
            >
              <div class="box flex items-center gap-x-2.5 gap-x-2 p-1.5 px-3 rounded-full outline-(1 solid #0000) text-muted-text">
                <label
                  for="page-input"
                  class="flex items-center gap-x-3 min-w-max flex-1 pl-1"
                >
                  Ir a la página:
                  <input
                    id="page-input"
                    type="number"
                    class="flex-1 outline-none bg-#0000000a rounded text-(sm right) p-0.5 px-3 text-base-text transition-[border-color] ease-in-out duration-300"
                    min="1"
                    max={pageCount()}
                    value={currentPage()}
                    onChange={(e) => {
                      let newVal = e.target.valueAsNumber;
                      if (!Number.isInteger(newVal) || newVal < 1) newVal = 1;

                      const count = pageCount();
                      if (newVal > count) newVal = count;

                      goToVal = newVal;
                    }}
                  />
                </label>

                <hr
                  aria-orientation="vertical"
                  class="min-h-4 w-[1px] bg-#0002 dark:bg-#fff2 border-0"
                />

                <CloseDW
                  class="btn primary icon circle size-min-7"
                  aria-label="Ir a la página seleccionada"
                  onClick={() => setCurrentPage(goToVal)}
                >
                  <BiRegularRightArrowAlt class="size-5" />
                </CloseDW>
              </div>
            </Drawer>
          </div>
        </li>

        <li>
          <Tooltip
            class={classes.navBtn}
            aria-label="Siguiente página"
            content="Ir a la siguiente página"
            disabled={currentPage() === pageCount()}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <BiRegularRightArrowAlt class="size-5" />
          </Tooltip>
        </li>

        <li>
          <Tooltip
            class={classes.navBtn}
            aria-label="Última página"
            content="Ir a la última página"
            disabled={currentPage() === pageCount()}
            onClick={() => setCurrentPage(pageCount())}
          >
            <BiRegularArrowToRight class="size-5" />
          </Tooltip>
        </li>
      </ul>

      <style>{`[data-popper-positioner] { z-index: 2 !important; }`}</style>
    </nav>
  );
}
