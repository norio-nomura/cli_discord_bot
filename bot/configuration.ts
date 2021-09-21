import { BotConfig } from "../deps.ts";
import { eventHandlers } from "./events/eventHandlers.ts";
import { env } from "./env.ts";
import { shellsplit } from "./utils/shellwords.ts";
import { Defaults, options } from "./options.ts";

export const target = {
  /** `TARGET_CLI` */
  cli: options.TARGET_CLI || new Defaults().TARGET_CLI, // Prefer default value than ""
  /** `TARGET_ARGS_TO_USE_STDIN` */
  argumentsToUseStdin: shellsplit(options.TARGET_ARGS_TO_USE_STDIN ?? ""),
  /** `TARGET_DEFAULT_ARGS` */
  defaultArguments: shellsplit(options.TARGET_DEFAULT_ARGS ?? ""),
};

export const envCommand: string[] = [
  options.ENV_COMMAND || new Defaults().ENV_COMMAND, // Prefer default value than ""
  ...shellsplit(options.ENV_ARGS),
  "PATH=" + env.PATH,
];

export const timeoutCommand: string[] = [
  options.TIMEOUT_COMMAND || new Defaults().TIMEOUT_COMMAND, // Prefer default value than ""
  ...shellsplit(options.TIMEOUT_ARGS),
];

export const discord = {
  /** `DISCORD_TOKEN` */
  token: options.DISCORD_TOKEN ?? env.DISCORD_TOKEN,
  /** `DISCORD_NICKNAME` */
  nickname: options.DISCORD_NICKNAME ?? target.cli,
  /** `DISCORD_PLAYING` */
  playing: options.DISCORD_PLAYING ?? target.cli,
};

export const botConfiguration: BotConfig = {
  token: discord.token,
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
  eventHandlers: eventHandlers,
};
