import { Link } from "@tanstack/solid-router";
import ThemeSelect from "./theme-select";
import { createForm } from "@tanstack/solid-form";
import * as tables from "~/db/schema";
import * as tableSchemas from "~/db/validators";
import { authenticateUser, loginFn, registerFn } from "~/lib/server/auth";
import { createMemo, createSignal } from "solid-js";
import { TextField } from "@kobalte/core/text-field";
import { toast } from "./ui/toast/fns";
import { useServerFn } from "@tanstack/solid-start";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "solid-icons/ai";
import Logo from "./logo";

export default function RouteComponent(props: { type: "login" | "signup" }) {
  const isLogin = props.type === "login";
  const fn = isLogin ? loginFn : registerFn;
  const submitFn = useServerFn(fn);
  const checkUserFn = useServerFn(authenticateUser);
  const [passVisible, setPassVisible] = createSignal(false);

  const Form = createForm(() => ({
    defaultValues: {
      username: "",
      password: "",
    } satisfies typeof tables.users.$inferInsert,
    validators: {
      onSubmitAsync: async ({ value: data }) => {
        const { error, validName, validPass } = await checkUserFn({
          data: { ...data, login: isLogin },
        });

        if (validName === false)
          return {
            fields: {
              username: {
                message: error,
              },
            },
          };

        if (validPass === false)
          return {
            fields: {
              password: {
                message: error,
              },
            },
          };
      },
    },
    onSubmit: async ({ value: data }) => {
      toast.promise(submitFn({ data }), {
        loading: "Subiendo datos...",
        success:
          (isLogin ? "Se inició sesión" : "Cuenta creada") + " correctamente",
        error: (error) => {
          return error?.message || "Ocurrió un error al subir los datos";
        },
      });
    },
  }));

  return (
    <div class="col justify-between h-full overflow-x-hidden">
      <div class="sticky top-0 flex items-center justify-center w-full max-w-700px h-60px mxa text-primary-text sm:h-80px">
        <div class="absolute top-0 left-0 z-0 w-full lh-0 h-inherit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            class="w-full h-inherit"
            filter="url(#inset-shadow)"
          >
            <filter id="inset-shadow">
              <feOffset dx="0" dy="-5" />
              <feGaussianBlur stdDeviation="5" result="offset-blur" />
              <feComposite
                operator="out"
                in="SourceGraphic"
                in2="offset-blur"
                result="inverse"
              />
              <feFlood flood-color="#ccc" flood-opacity=".1" result="color" />
              <feComposite
                operator="in"
                in="color"
                in2="inverse"
                result="shadow"
              />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
            <path
              class="fill-primary"
              d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
            ></path>
          </svg>
        </div>
        <Logo
          class="relative top-0 z-1 mb-1 w-110px h-35px sm:(mb-2 w-125px h-175px)"
          style={{
            filter:
              "drop-shadow(0 2px 0 #0002) drop-shadow(-1px 1px 0 #0001) drop-shadow(1px 1px 0 #0001)",
          }}
        />
      </div>
      <main class="flex items-center justify-center mya mx-4">
        <div class="col gap-4 box max-w-md w-full py-4 px-5">
          <hgroup class="text-center mb-4">
            <h1 class="text-2xl font-bold">
              {props.type === "login" ? "Iniciar sesión" : "Registro"}
            </h1>
            <p class="mt-2 text-(sm balance muted-text)">
              {props.type === "login"
                ? "Ingresa tus datos para acceder al sistema"
                : "Indica los datos de tu nuevo usuario"}
            </p>
          </hgroup>

          <form
            class="col gap-3"
            method="post"
            // @ts-expect-error: previene que se recargue el sitio antes de la hidratación
            onsubmit="event.preventDefault()"
            onSubmit={(e) => {
              e.preventDefault();
              Form.handleSubmit();
            }}
          >
            <Form.Field
              name="username"
              validators={{
                onBlur: tableSchemas.users.insert.shape.username,
              }}
            >
              {(f) => {
                const errors = createMemo(() => f().state.meta.errors);

                return (
                  <TextField
                    required
                    id="username"
                    validationState={errors().length > 0 ? "invalid" : "valid"}
                  >
                    <TextField.Label class="input-label">
                      Nombre de usuario
                    </TextField.Label>
                    <TextField.Input
                      class="input"
                      type="text"
                      value={f().state.value}
                      onChange={(e) => f().handleChange(e.target.value.trim())}
                      onBlur={f().handleBlur}
                    />

                    <TextField.ErrorMessage class="input-error">
                      {errors()[0]!.message}
                    </TextField.ErrorMessage>
                  </TextField>
                );
              }}
            </Form.Field>

            <Form.Field
              name="password"
              validators={{
                onBlur: tableSchemas.users.insert.shape.password,
              }}
            >
              {(f) => {
                const errors = createMemo(() => f().state.meta.errors);

                return (
                  <TextField
                    required
                    id="password"
                    class="group"
                    validationState={errors().length > 0 ? "invalid" : "valid"}
                  >
                    <TextField.Label class="input-label">
                      Contraseña
                    </TextField.Label>
                    <div class="flex items-center justify-between gap-2 input">
                      <TextField.Input
                        class="w-full outline-0"
                        type={passVisible() ? "text" : "password"}
                        value={f().state.value}
                        onChange={(e) =>
                          f().handleChange(e.target.value.trim())
                        }
                        onBlur={f().handleBlur}
                      />
                      <button
                        type="button"
                        onClick={[setPassVisible, !passVisible()]}
                        aria-label={
                          passVisible() ? "Ocultar" : "Mostrar" + " contraseña"
                        }
                        class="btn media-mouse:hover:bg-#0001 dark:media-mouse:hover:bg-#fff1 media-touch:active:bg-#0001 dark:media-touch:active:bg-#fff1 transform-scale-120 p0.5"
                      >
                        {passVisible() ? (
                          <AiTwotoneEye class="size-4" />
                        ) : (
                          <AiTwotoneEyeInvisible class="size-4" />
                        )}
                      </button>
                    </div>

                    <TextField.ErrorMessage class="input-error">
                      {errors()[0]!.message}
                    </TextField.ErrorMessage>
                  </TextField>
                );
              }}
            </Form.Field>

            <Form.Subscribe
              selector={(state) => ({ canSubmit: state.canSubmit })}
            >
              {(state) => (
                <button
                  disabled={!state().canSubmit}
                  class="btn primary md w-full mt-4"
                >
                  {props.type === "login" ? "Ingresar" : "Crear cuenta"}
                </button>
              )}
            </Form.Subscribe>
          </form>

          <hr class="border-[--border] mt-2" />

          <div class="text-center">
            <span class="text-sm text-muted-text mr-2">
              {props.type === "login"
                ? "¿No tienes una cuenta?"
                : "¿Ya tienes una cuenta?"}
            </span>
            <Link
              to={"/auth/" + (props.type === "login" ? "signup" : "login")}
              class="link primary underline text-sm"
            >
              {props.type === "login" ? "Regístrate" : "Inicia sesión"}
            </Link>
          </div>
        </div>
      </main>
      <ThemeSelect class="mxa mb-4" />
    </div>
  );
}
