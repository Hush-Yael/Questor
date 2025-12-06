import { Toast as T, type ToastRootProps } from "@kobalte/core/toast";
import { Show, type JSX } from "solid-js";
import { IoCloseSharp as X } from "solid-icons/io";
import "~/components/ui/styles/toast.css";

export type ToastProps = Omit<ToastRootProps, "id" | "translations"> & {
  class?: string;
  trackClass?: string;
  closeClass?: string;
  icon?: JSX.Element;
  description?: JSX.Element;
  state?: "pending" | "fulfilled" | "rejected";
  variant?: "neutral" | "error" | "warning" | "info" | "success";
  children: JSX.Element;
};

const classes = {
  track: "h-1 mx-2 mt-1.25 mb-0.5 bg-#0002",
  trackFill: "h-full w-[var(--kb-toast-progress-fill-width)] bg-current-color",
  closeBtn:
    "grid place-content-center mla min-w-max float-right rounded-full bg-#0002 p-0.5 media-mouse:hover:bg-#0004 media-touch:active:bg-#0004",
  content:
    "toast-content group flex gap-2.5 text-sm p-2 px-3 [&>svg]:(size-4.5 translate-y-0.5 drop-shadow-[0_1px_0_#0002])",
  desc: "font-400 opacity-70 group-data-[variant]:opacity-90",
};

export default (props: ToastProps) => (
  <T
    {...props}
    translations={{ close: "Cerrar" }}
    class={`toast ${props.class || ""}`}
    persistent={props.state === "pending"}
    trackClass={null}
    closeClass={null}
    variant={null}
    icon={null}
    state={null}
  >
    <Show
      when={props.state !== "pending"}
      fallback={
        <div
          class={`toast-loader ${classes.track} ${props.trackClass || ""}`}
        />
      }
    >
      <T.ProgressTrack class={`${classes.track} ${props.trackClass || ""}`}>
        <T.ProgressFill class={classes.trackFill} />
      </T.ProgressTrack>
    </Show>
    <div class={classes.content} data-variant={props.variant || null}>
      {props.icon}
      <div class="col gap-1 flex-1">
        <div class="flex items-start gap-2.5">
          <T.Title class="font-600">
            <span>{props.children}</span>
          </T.Title>
          <T.CloseButton
            class={`${classes.closeBtn} ${props.closeClass || ""}`}
          >
            <X class="size-4.5" />
          </T.CloseButton>
        </div>

        <Show when={props.description}>
          <T.Description class={classes.desc}>
            {props.description}
          </T.Description>
        </Show>
      </div>
    </div>
  </T>
);
