import { type UserTheme, useTheme } from "~/contexts/theme/provider";
import { SegmentedControl } from "@kobalte/core/segmented-control";
import { ClientOnly } from "@tanstack/solid-router";
import { For, type JSX } from "solid-js";
import Icons from "~/components/ui/icons";
import type { IconProps } from "solid-icons";

type Option = {
  icon: (p: IconProps) => JSX.Element;
  label: string;
  value: UserTheme;
};

const themeOptions: Option[] = [
  { icon: Icons.sun, label: "Claro", value: "light" },
  { icon: Icons.moon, label: "Oscuro", value: "dark" },
  { icon: Icons.system, label: "Sistema", value: "system" },
];

const classes = {
  root: "size-max",
  list: "flex gap-1 box p-1 px-1.75 rounded-full",
  item: "relative",
  itemLabel:
    "flex items-center justify-center rounded-full size-6.5 select-none transition-[background-color,color] peer-disabled:(opacity-50 cursor-not-allowed) peer-not-checked:(text-muted-text) peer-checked:(bg-primary text-primary-text shadow-[--btn-shadow]) peer-not-[:checked,:disabled]:(cursor-pointer hover:(bg-highlight shadow-[--elevated-shadow])) peer-checked:[&>svg>path:nth-child(2)]:fill-current peer-focus-visible:(outline-(1 solid current)))",
};

export default (props: { class?: string }) => {
  const { userTheme, setTheme } = useTheme();

  return (
    <ClientOnly
      fallback={
        <div
          role="radiogroup"
          class={props.class ? `${classes.root} ${props.class}` : classes.root}
        >
          <div role="presentation" class={classes.list}>
            <For each={themeOptions}>
              {(option) => (
                <div class={classes.item}>
                  <input
                    id={"theme-" + option.value}
                    class="sr-only"
                    type="radio"
                    name="theme"
                    disabled
                    value={option.value}
                  />
                  <label
                    for={"theme-" + option.value}
                    class={
                      classes.itemLabel + " !opacity-25 !cursor-not-allowed"
                    }
                  >
                    <span class="sr-only">{option.label}</span>
                    <option.icon />
                  </label>
                </div>
              )}
            </For>
          </div>
        </div>
      }
    >
      <SegmentedControl
        class={props.class ? `${classes.root} ${props.class}` : classes.root}
        options={themeOptions}
        value={themeOptions.find((theme) => theme.value === userTheme())!.value}
        // @ts-expect-error: el valor es un tema correcto
        onChange={setTheme}
      >
        <SegmentedControl.Label class="sr-only">
          Seleccionar tema del sitio
        </SegmentedControl.Label>

        <div role="presentation" class={classes.list}>
          <For each={themeOptions}>
            {(option) => (
              <SegmentedControl.Item value={option.value} class={classes.item}>
                <SegmentedControl.ItemInput class="peer sr-only" />

                <SegmentedControl.ItemLabel class={classes.itemLabel}>
                  <span class="sr-only">{option.label}</span>
                  <option.icon />
                </SegmentedControl.ItemLabel>
              </SegmentedControl.Item>
            )}
          </For>
        </div>
      </SegmentedControl>
    </ClientOnly>
  );
};
