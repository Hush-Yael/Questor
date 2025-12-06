import { type ErrorComponentProps } from "@tanstack/solid-router";

export default function ErrorComponent(props: ErrorComponentProps) {
  return (
    <main class="col p-6">
      <h1 class="text-(danger center 2xl) font-bold">Ha ocurrido un error</h1>
      <hr class="border-[--border] my-4" />
      <pre
        class="text-sm whitespace-normal w-full h-full overflow-auto"
        style={{ "text-indent": "-1.5em", "margin-left": "1.5em" }}
      >
        {props.error.stack}
      </pre>
    </main>
  );
}
