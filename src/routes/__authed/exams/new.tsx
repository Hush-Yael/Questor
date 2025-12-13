import { createFileRoute } from "@tanstack/solid-router";
import { useBlocker } from "@tanstack/solid-router";

export const Route = createFileRoute("/__authed/exams/new")({
  component: RouteComponent,
  validateSearch: (search) =>
    ({
      id: Number.isInteger(parseInt(search.id as string))
        ? parseInt(search.id as string)
        : undefined,
    }) as { id?: number } | undefined,
  beforeLoad: ({ search }) => {
    if (search?.id) {
      // fetch exam
      return;
    }
  },
});

function RouteComponent() {
  const search = Route.useSearch();

  useBlocker({
    shouldBlockFn: () => {
      const shouldLeave = confirm(
        "¿Realmente quieres irte? Tus cambios no se guardarán"
      );
      return !shouldLeave;
    },
  });

  return <div>Hello "/__authed/exams/new"! {search()?.id}</div>;
}
