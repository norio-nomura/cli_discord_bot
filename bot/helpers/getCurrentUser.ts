import { Bot, User } from "../../deps.ts";

/** get current user */
export async function getCurrentUser(bot: Bot): Promise<User> {
  return await bot.rest.runMethod<User>(bot.rest, "GET", bot.constants.routes.USER_BOT());
}
