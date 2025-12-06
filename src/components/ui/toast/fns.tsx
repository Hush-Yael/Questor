import { type JSX } from "solid-js";
import { Switch, Match } from "solid-js/web";
import Toast, { type ToastProps } from "./component";
import { toaster } from "@kobalte/core/toast";
import Icons from "../icons";

type ToastFnProps = Omit<ToastProps, "toastId" | "children">;

const variants = {
  neutral: {
    msg: "bg-elevated shadow-[0_-1px_2px_#00000010,0_1px_4px_#00000020] dark:shadow-[--elevated-shadow]",
    track: "text-#0004 dark:text-#fff3",
    closeClass:
      "dark:(bg-#fff1 media-mouse:hover:bg-#fff2 media-touch:active:bg-#fff2)",
  },
  success: {
    msg: "bg-success text-success-text shadow-[inset_0_-1px_2px_#ffffff30]",
    track: "text-#0004",
  },
  error: {
    msg: "bg-danger text-danger-text shadow-[inset_0_-1px_4px_#00000040]",
    track: "light:bg-#0003",
  },
  info: {
    msg: "bg-info text-info-text shadow-[inset_0_-1px_2px_#ffffff30]",
    track: "text-#0002 bg-#0005 dark:(text-#0005 bg-#0003)",
  },
} as const;

const toastFn = (
  c: JSX.Element,
  props?: ToastFnProps & {
    variant: keyof typeof variants;
  }
) =>
  toaster.show((cProps) => (
    <Toast
      {...props}
      toastId={cProps.toastId}
      class={`${variants[props!.variant].msg} ${props?.class || ""}`}
      trackClass={variants[props!.variant].track}
      // @ts-expect-error: no importa
      closeClass={variants[props!.variant as keyof typeof variants]?.closeClass}
      icon={
        props!.variant in Icons.msg &&
        Icons.msg[props!.variant as keyof typeof Icons.msg]()
      }
    >
      {c}
    </Toast>
  ));

const states: Record<string, keyof typeof variants> = {
  pending: "neutral",
  fulfilled: "success",
  rejected: "error",
} as const;

const promise = <T,>(
  promise: Promise<T>,
  options: {
    loading: JSX.Element;
    success: JSX.Element | ((data: T) => JSX.Element);
    error: JSX.Element | ((error: Error | { message: string }) => JSX.Element);
    duration?: {
      success?: number;
      error?: number;
    };
    descriptions?: {
      loading?: JSX.Element;
      success?: JSX.Element;
      error?: JSX.Element;
    };
  }
) =>
  toaster.promise(promise, ({ toastId, state, data, error }) => (
    <Toast
      toastId={toastId}
      class={variants[states[state] as keyof typeof variants].msg}
      trackClass={variants[states[state] as keyof typeof variants].track}
      description={
        options.descriptions &&
        options.descriptions[states[state] as keyof typeof options.descriptions]
      }
      duration={
        state !== "pending" && options.duration
          ? options.duration[states[state] as keyof typeof options.duration]
          : undefined
      }
      state={state}
      icon={
        <Switch>
          <Match when={state === "fulfilled"}>
            <Icons.msg.success />
          </Match>
          <Match when={state === "rejected"}>
            <Icons.msg.error />
          </Match>
        </Switch>
      }
    >
      <Switch>
        <Match when={state === "pending"}>{options.loading}</Match>
        <Match when={state === "fulfilled"}>
          {typeof options.success === "function"
            ? options.success(data!)
            : options.success}
        </Match>
        <Match when={state === "rejected"}>
          {typeof options.error === "function"
            ? options.error(error)
            : options.error}
        </Match>
      </Switch>
    </Toast>
  ));

export const toast = {
  show: (c: JSX.Element, props?: ToastFnProps) =>
    toastFn(c, { ...props, variant: "neutral" }),
  success: (c: JSX.Element, props?: ToastFnProps) =>
    toastFn(c, { ...props, variant: "success" }),
  error: (c: JSX.Element, props?: ToastFnProps) =>
    toastFn(c, { ...props, variant: "error" }),
  info: (c: JSX.Element, props?: ToastFnProps) =>
    toastFn(c, { ...props, variant: "info" }),
  promise,
};
