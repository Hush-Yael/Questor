import { type JSX, createSignal } from "solid-js";
import { Tooltip as T } from "@kobalte/core/tooltip";

export default function Tooltip(
  props: JSX.IntrinsicElements["button"] & {
    content: string;
    tooltipClass?: string;
    arrowClass?: string;
    mount?: Node;
  }
) {
  const [open, setOpen] = createSignal(false);
  // En touch, el foco se obtiene por un instante al presionar el botón y se pierde ahí mismo. Hay que tomar en cuenta cuando esto sucede para prevenir que se muestre y se cierre instantáneamente el tooltip al hacer click
  let isTouchFocus = false;

  return (
    <T
      open={open()}
      onOpenChange={(isOpen) => {
        if (isTouchFocus) return (isTouchFocus = false);
        setOpen(isOpen);
      }}
    >
      <T.Trigger
        {...props}
        onFocus={() => {
          if (window.matchMedia("(pointer: coarse) and (hover: none)").matches)
            isTouchFocus = true;
        }}
        onContextMenu={() => {
          isTouchFocus = false;
          setOpen(true);
        }}
        content={null}
        mount={null}
        tooltipClass={null}
        arrowClass={null}
      >
        {props.children}
      </T.Trigger>
      <T.Portal mount={props.mount}>
        <T.Content
          class={`box p-1 px-3 text-(sm muted-text) transform-origin-[--kb-tooltip-content-transform-origin] animate-[content-hide-vertical_150ms_ease-in_forwards] data-[expanded]:animate-[content-show-vertical_150ms_ease-in_forwards] ${props.tooltipClass || ""}`}
        >
          <T.Arrow
            class={`text-[--elevated-background] [&>svg]:(stroke-muted stroke-1 drop-shadow dark:stroke-2) ${props.arrowClass || ""}`}
          />
          {props.content}
        </T.Content>
      </T.Portal>
    </T>
  );
}
