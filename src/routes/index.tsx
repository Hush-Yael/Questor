import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt, quo
      vel doloremque recusandae natus, quidem magni sed voluptatem praesentium
      consequuntur ipsam perferendis esse nam saepe culpa dignissimos ipsa quas
      repellat.
    </main>
  );
}
