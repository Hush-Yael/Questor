import { type UserTheme, useTheme } from "~/contexts/theme/provider";
import { Select } from "@kobalte/core/select";
import { ClientOnly } from "@tanstack/solid-router";
import type { JSX } from "solid-js";
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

export default () => {
  const { userTheme, setTheme } = useTheme();

  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <Select<Option>
        options={themeOptions}
        optionValue="value"
        optionTextValue="label"
        placeholder="Select a theme"
        disallowEmptySelection
        allowDuplicateSelectionEvents={false}
        value={themeOptions.find((theme) => theme.value === userTheme())}
        onChange={(option) => setTheme(option!.value)}
        itemComponent={(props) => (
          <Select.Item item={props.item} class="menu-item">
            <Select.ItemLabel class="menu-item-label">
              <props.item.rawValue.icon /> {props.item.textValue}
            </Select.ItemLabel>
          </Select.Item>
        )}
        defaultOpen
      >
        <Select.Trigger>
          <Select.Value<Option>>
            {(state) => (
              <>
                <span class="sr-only">{state.selectedOption()!.label}</span>
                {state.selectedOption()!.icon}
              </>
            )}
          </Select.Value>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content class="box">
            <Select.Listbox />
          </Select.Content>
        </Select.Portal>
      </Select>
    </ClientOnly>
  );
};
