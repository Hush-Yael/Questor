import "./ui/styles/nav.css";
import { Link, useLocation, type LinkOptions } from "@tanstack/solid-router";
import Icons from "./ui/icons";
import { For, type JSX, Show } from "solid-js";
import Logo from "./logo";
import { createSignal } from "solid-js";
import ThemeSelector from "~/components/theme-select";
import type { IconProps } from "solid-icons";

const links: {
  path: LinkOptions["to"];
  icons: Record<string, (p: IconProps) => JSX.Element>;
  label: string;
  name: NavLinkName;
}[] = [
  {
    path: "/",
    icons: {
      outline: Icons.nav.outline.home,
      solid: Icons.nav.solid.home,
    },
    label: "Inicio",
    name: "home",
  },
  {
    path: "/subjects",
    icons: {
      outline: Icons.nav.outline.subjects,
      solid: Icons.nav.solid.subjects,
    },
    label: "Asignaturas",
    name: "subjects",
  },
  {
    path: "/exams",
    icons: {
      outline: Icons.nav.outline.exams,
      solid: Icons.nav.solid.exams,
    },
    label: "Exámenes",
    name: "exams",
  },
  {
    path: "/users",
    icons: {
      outline: Icons.nav.outline.users,
      solid: Icons.nav.solid.users,
    },
    label: "Usuarios",
    name: "users",
  },
] as const;

export type NavLinkName = "home" | "subjects" | "exams" | "users";

const excludedPathnames: [...LinkOptions["to"][]] = [
  "/auth/login",
  "/auth/signup",
];

export default function Nav() {
  const location = useLocation();
  const [open, setOpen] = createSignal(false);

  return (
    <Show
      when={
        !excludedPathnames.includes(location().pathname as LinkOptions["to"])
      }
    >
      <div
        data-visible={open()}
        aria-hidden="true"
        class="z-10 fixed inset-0 bg-#0004 dark:bg-#0008 keyframes-fade-in keyframes-fade-out data-[visible=false]:(animate-[fade-out_200ms_forwards] pointer-events-none) data-[visible=true]:animate-[fade-in_200ms_forwards]"
        onClick={() => setOpen(false)}
      ></div>

      <header class="sticky z-20 top-0 flex items-center justify-between gap-y-4 bg-primary text-primary-text h-[--header-height] px-5 pl-3">
        <Link to="/">
          <Logo class="w-25" />
        </Link>

        <button
          id="nav-icon"
          class="nav-icon relative h-20px w-22px transition-[transform] duration-500 ease-in-out cursor-pointer"
          style={{
            transform: "rotate(0deg)",
          }}
          onClick={() => setOpen(!open())}
          aria-label="Menú"
          aria-expanded={open()}
          aria-haspopup="menu"
          aria-controls="nav-menu"
        >
          <span />
          <span />
          <span />
          <span />
        </button>

        <div
          role="menu"
          class="absolute z-19 top-full left-0 right-0 bg-base rounded-b-3xl py-2.5 supports-[not(corner-shape:_squircle)]:rounded-b-xl text-base-text aria-hidden:(pointer-events-none opacity-0) transition-[opacity,transform]"
          aria-hidden={!open()}
          style={{
            // @ts-expect-error: sí existe
            "corner-shape": "squircle",
          }}
          id="nav-menu"
        >
          <ThemeSelector
            label={(
              <span class="flex items-center gap-x-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-muted-text size-4.5" width="24" height="24" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-9 1.732a8 8 0 0 0 4.001 14.928l-.001 -16a8 8 0 0 0 -4 1.072" /></svg>
                Tema del sitio
              </span>
            )}
            class="flex justify-between items-end w-full px-6"
          />

          <hr class="my-4  mx-6 border-translucent-2" />

          <nav>
            <ul
              class="col justify-between"
              onClick={(e) => e.target.closest("a") && setOpen(false)}
            >
              <For each={links}>
                {(l) => (
                  <li>
                    <Link
                      to={l.path}
                      class="nav-link relative btn justify-start gap-x-3 p-3 px-6 text-sm transition-[color,background-color] focus-visible:(bg-highlight text-highlight-text! ring-1 ring-primary) not-[[data-status=active]]:(text-muted-text! media-mouse:hover:(bg-highlight text-highlight-text!) media-touch:active:(bg-highlight text-highlight-text!)) data-[status=active]:(bg-#0000000a text-highlight-text after:content-['']) dark:data-[status=active]:bg-#ffffff0a [&>svg]:size-4.5 after:(absolute right-4 top-1/2 -translate-y-1/2 w-2 h-70% rounded-2px bg-primary text-primary-text shadow-[--btn-shadow])"
                    >
                      <l.icons.outline class="outlined" />
                      <l.icons.solid class="solid" />
                      {l.label}
                    </Link>
                  </li>
                )}
              </For>
            </ul>
          </nav>
        </div>
      </header>
    </Show>
  );
}
