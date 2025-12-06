import { createServerFn } from "@tanstack/solid-start";
import { redirect } from "@tanstack/solid-router";
import { useAppSession } from "~/hooks/useSession";
import bcrypt from "bcrypt";
import { tableSchemas } from "~/db/validators";
import { getUserById, getUserByName, createUser } from "~/lib/db/users";

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator(tableSchemas.users.select.omit({ role: true }))
  .handler(async ({ data }) => {
    const { data: user, error } = await authenticateUser({
      data: { username: data.username, password: data.password, login: true },
    });

    if (error) throw new Error(error);

    const session = await useAppSession();
    await session.update({
      userId: user!.id.toString(),
    });

    throw redirect({ to: "/" });
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  await session.clear();
  throw redirect({ to: "/auth/login" });
});

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();
    const userId = Number(session.data["userId"]);

    if (userId !== 0 && !userId) return null;

    return await getUserById(userId);
  }
);

export const registerFn = createServerFn({ method: "POST" })
  .inputValidator(tableSchemas.users.insert)
  .handler(async ({ data }) => {
    const exists = await getUserByName(data.username);
    if (exists) throw new Error("Ya existe un usuario con ese nombre");

    const hash = await bcrypt.hash(
      data.password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await createUser({
      username: data.username,
      password: hash,
    });

    const session = await useAppSession();
    await session.update({ userId: user.id.toString() });

    throw redirect({ to: "/" });
  });

export const authenticateUser = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { username: string; password: string; login: boolean }) => data
  )
  .handler(async ({ data }) => {
    const isSigningIn = data.login === true,
      isSigningUp = !isSigningIn,
      user = await getUserByName(data.username);

    if ((isSigningIn && !user) || isSigningUp)
      return {
        data: null,
        error: isSigningIn
          ? "No existe un usuario con ese nombre"
          : user
            ? "Ya existe un usuario con ese nombre"
            : null,
        validName: isSigningUp && !user ? true : false,
        validPass: null,
      };

    const isValid = await bcrypt.compare(data.password, user!.password);

    return isValid
      ? {
          data: user,
          error: null,
          validName: true,
          validPass: true,
        }
      : {
          data: null,
          error: "La contraseña no es correcta",
          validName: true,
          validPass: false,
        };
  });
