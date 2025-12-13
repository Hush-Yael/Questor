import Icons from "~/components/ui/icons";
import { toTimeStr } from "~/lib/utils";
import { type ExamStateCode, examStates } from "~/db/constants";
import type { Accessor, Setter } from "solid-js";
import type { ListExam } from "~/lib/db";
import { Trigger } from "@corvu/drawer";
import type { ExamInfo } from "./list";

const examCodeStyles = {
  [examStates.enum.UNAVAILABLE]: "bg-danger text-danger-text",
  [examStates.enum.PENDING]: "bg-info text-info-text",
  [examStates.enum.FINISHED]: "bg-success text-success-text",
  [examStates.enum.DRAFT]: "bg-muted text-muted-text",
};

const statusCodeStyles = {
  warning: "bg-warning text-warning-text",
};

export default function Exam(props: {
  data: ListExam;
  index: Accessor<number>;
  setInfo: Setter<undefined | ExamInfo>;
}) {
  return (
    <li class="col gap-y-4 w-full max-w-[400px]">
      <Trigger
        onClick={() =>
          props.setInfo({
            id: props.data.id,
            createdAt: props.data.createdAt,
            updatedAt: props.data.updatedAt,
            name: props.data.name,
            startsAt: props.data.startsAt,
            endsAt: props.data.endsAt,
          })
        }
        tabIndex={props.index() !== 0 ? -1 : undefined}
        class="col w-full p-3 px-5 outline-(1 solid #0000 offset-2) ring-(1 #0000 inset) focus-visible:(outline-current ring-2 ring-primary) text-left box light:border-t-translucent-1 rounded-box media-mouse:hover:ring-primary media-touch:active:ring-primary transition-[outline-color,box-shadow] cursor-pointer"
      >
        <h2 class="font-500">{props.data.name}</h2>
        <ul class="flex flex-wrap gap-x-2 mt-3">
          <li>
            <span
              class={`badge ${examCodeStyles[props.data.state as ExamStateCode]}`}
              role="status"
            >
              {examStates.labels[props.data.state as ExamStateCode]}
            </span>
          </li>

          {props.data.questionsCount < 1 && (
            <li>
              <span
                class={`badge bg-highlight text-highlight-text ${statusCodeStyles.warning}`}
                role="status"
              >
                <Icons.msg.error class="-translate-y-0.25 size-3.5 mr-1" /> Sin
                preguntas
              </span>
            </li>
          )}
        </ul>

        <hr class="border-translucent-1 my-3" />

        <div class="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-sm">
          <dl class="text-sm">
            <dt class="text-muted-text mb-0.5">Preguntas</dt>
            <dd>{props.data.questionsCount}</dd>
          </dl>

          <dl class="text-sm">
            <dt class="text-muted-text mb-0.5">Asignatura</dt>
            <dd>{props.data.subject}</dd>
          </dl>

          <dl class="text-sm">
            <dt class="text-muted-text mb-0.5">Ponderación</dt>
            <dd>{props.data.score}</dd>
          </dl>

          {props.data.durationSeconds !== null && (
            <dl class="text-sm">
              <dt class="text-muted-text mb-0.5">Duración</dt>
              <dd>{toTimeStr(props.data.durationSeconds, "s")}</dd>
            </dl>
          )}
        </div>
      </Trigger>
    </li>
  );
}
