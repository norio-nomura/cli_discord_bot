import { BotConfig, fail } from "../deps.ts";
import { eventHandlers } from "./events/eventHandlers.ts";
import { shellsplit } from "./utils/shellwords.ts";

async function guardEnv(key: string, defaultValue?: string) {
  const status = await Deno.permissions.query({ name: "env", variable: key });
  return status.state === "granted" && Deno.env.get(key) ||
    (defaultValue != undefined ? defaultValue : fail(`\`${key}\` environment variable is not defined!`));
}

export const target = {
  /** `TARGET_CLI` */
  cli: await guardEnv("TARGET_CLI"),
  /** `TARGET_ARGS_TO_USE_STDIN` */
  argumentsToUseStdin: shellsplit(
    await guardEnv("TARGET_ARGS_TO_USE_STDIN", ""),
  ),
  /** `TARGET_DEFAULT_ARGS` */
  defaultArguments: shellsplit(await guardEnv("TARGET_DEFAULT_ARGS", "")),
  /** `PATH` */
  path: await guardEnv("PATH"),
};

export const envCommand: string[] = [
  await guardEnv("ENV_COMMAND", "/usr/bin/env"),
  ...shellsplit(await guardEnv("ENV_ARGS", "-i")),
  ...(["PATH=" + await guardEnv("PATH")]),
];

export const timeoutCommand: string[] = [
  await guardEnv("TIMEOUT_COMMAND", "timeout"),
  ...shellsplit(await guardEnv("TIMEOUT_ARGS", "--signal=KILL 30")),
];

export const discord = {
  /** `DISCORD_TOKEN` */
  token: await guardEnv("DISCORD_TOKEN"),
  /** `DISCORD_NICKNAME` */
  nickname: await guardEnv("DISCORD_NICKNAME", target.cli),
  /** `DISCORD_PLAYING` */
  playing: await guardEnv("DISCORD_PLAYING", target.cli),
};

export const botConfiguration: BotConfig = {
  token: discord.token,
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
  eventHandlers: eventHandlers,
};
