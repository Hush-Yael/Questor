import { createServerFn } from "@tanstack/solid-start";
import {
  getCookie as getCookieFn,
  setCookie as setCookieFn,
} from "@tanstack/solid-start/server";

export const getCookie = createServerFn({ method: "GET" })
  .inputValidator((data: { name: string }) => data.name)
  .handler(async ({ data: name }) => {
    return getCookieFn(name);
  });
export const setCookie = createServerFn({ method: "POST" })
  .inputValidator(
    // @ts-expect-error: el tipo de las opts es correcto
    (data: {
      name: string;
      value: string;
      opts?: Parameters<typeof setCookieFn>["2"];
    }) => data
  )
  .handler(async ({ data: { name, value, opts } }) => {
    return setCookieFn(name, value, opts || { maxAge: 60 * 60 * 24 * 7 });
  });
