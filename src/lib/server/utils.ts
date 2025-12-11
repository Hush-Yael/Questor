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
  .inputValidator((data: { name: string; value: string }) => data)
  .handler(async ({ data: { name, value } }) => {
    return setCookieFn(name, value);
  });
