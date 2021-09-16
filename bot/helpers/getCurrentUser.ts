import { endpoints, rest, User } from "../../deps.ts";

/** get current user */
export async function getCurrentUser(): Promise<User> {
  return await rest.runMethod<User>("get", endpoints.USER_BOT);
}
