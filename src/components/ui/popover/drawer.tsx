import DW, {
  Close as DWClose,
  Description,
  Label,
  type CloseProps,
  type RootProps,
  type TriggerProps,
} from "@corvu/drawer";
import type { JSX, Setter } from "solid-js";

type DrawerContentProps = {
  class?: string;
  overlayClass?: string;
  wrapperClass?: string;
  children?: JSX.Element;
  description?: JSX.Element;
  label?: JSX.Element;
};

type DrawerProps<T extends JSX.Element | undefined> = Omit<
  RootProps,
  "children"
> &
  DrawerContentProps &
  (T extends undefined
    ? {
        open: boolean;
        setOpen?: Setter<boolean>;
      }
    : {
        trigger: (props: TriggerProps) => JSX.Element;
      });

export const Close = (
  props: CloseProps & JSX.IntrinsicElements['button']
) => (
  <DWClose
    {...props}
    class={`btn btn-primary w-full max-w-400px ma ${props.class || ""}`}
  >
    {props.children}
  </DWClose>
);

export const Content = (
  props: DrawerContentProps & Pick<DrawerProps<JSX.Element>, "side">
) => (
  <DW.Portal>
    <DW.Overlay
      class={`dialog-overlay fixed z-40 inset-0 m-a bg-[var(--ov-bg)] data-[open]:animate-[fade-in_.3s_cubic-bezier(0.32,0.72,0,1)] data-[closing]:animate-[fade-out_.3s_cubic-bezier(0.32,0.72,0,1)] keyframes-fade-in keyframes-fade-out animate-forwards ${
        props.overlayClass || ""
      }`}
    />
    <DW.Content
      class={`
          fixed z-50 max-w-[550px] ma bg-[--base-background] p-5 select-none
          data-transitioning:transition-transform 
          data-[transitioning]:transition-transform data-[transitioning]:duration-300 shadow-[0_0_14px_#0007] dark:shadow-[0_0_14px_#000a]
        ${props.class || ""}`}
      classList={{
        "top-0 rounded-b-3xl": props.side === "top",
        "bottom-0 rounded-t-3xl": !props.side || props.side === "bottom",
        "left-0": props.side !== "right",
        "right-0": props.side !== "left",
        "top-0 bottom-0 max-h-80vh":
          props.side === "right" || props.side === "left",
        "col left-0 right-0":
          !props.side || props.side === "top" || props.side === "bottom",
        "flex-col-reverse": props.side === "top",
        "flex rounded-l-3xl": props.side === "right",
        "flex flex-row-reverse rounded-r-3xl": props.side === "left",
      }}
    >
      <div
        class="m-a rounded-full bg-muted"
        classList={{
          "w-15 h-1.25":
            props.side === "top" || props.side === "bottom" || !props.side,
          "mt-10": props.side === "top",
          "mb-10": props.side === "bottom" || !props.side,
          "h-15 w-1.25": props.side === "left" || props.side === "right",
          "mr-10": props.side === "right",
          "ml-10": props.side === "left",
        }}
      />
      <div class={`col ${props.wrapperClass || ""}`}>
        <div class="col gap-4 empty:hidden">
          {props.label && (
            <Label class="text-(xl center balance) font-bold">
              {props.label}
            </Label>
          )}
          {props.description && (
            <Description class="text-muted">{props.description}</Description>
          )}
        </div>
        {props.children}
      </div>
    </DW.Content>
  </DW.Portal>
);

const Drawer = <T extends JSX.Element | undefined>(props: DrawerProps<T>) => (
  <DW
    {...props}
    side={props.side || "bottom"}
    onOpenChange={
      (props as DrawerProps<undefined>).setOpen || props.onOpenChange
    }
    // @ts-expect-error: strip prop
    overlayClass={null}
    wrapperClass={null}
    trigger={null}
    label={null}
    description={null}
  >
    {(props as DrawerProps<Element>).trigger && (
      <DW.Trigger as={(props as DrawerProps<Element>).trigger} />
    )}
    <Content {...props} />
  </DW>
);

export default Drawer;
