import { BotConfig, fail } from "../deps.ts";
import { eventHandlers } from "./events/eventHandlers.ts";
import { shellsplit } from "./utils/shellwords.ts";
import { Options, options } from "./options.ts";

export const configuration = {
  get target() {
    return {
      /** `TARGET_CLI` */
      cli: options.TARGET_CLI || new Options().TARGET_CLI, // Prefer default value than ""
      /** `TARGET_ARGS_TO_USE_STDIN` */
      argumentsToUseStdin: shellsplit(options.TARGET_ARGS_TO_USE_STDIN ?? ""),
      /** `TARGET_DEFAULT_ARGS` */
      defaultArguments: shellsplit(options.TARGET_DEFAULT_ARGS ?? ""),
    };
  },
  get envCommand(): string[] {
    return [
      options.ENV_COMMAND || new Options().ENV_COMMAND, // Prefer default value than ""
      ...shellsplit(options.ENV_ARGS),
      "PATH=" + (options.PATH ?? fail("`PATH` environment variable is missing!")),
    ];
  },
  get timeoutCommand(): string[] {
    return [
      options.TIMEOUT_COMMAND || new Options().TIMEOUT_COMMAND, // Prefer default value than ""
      ...shellsplit(options.TIMEOUT_ARGS),
    ];
  },
  get discord() {
    return {
      /** `DISCORD_TOKEN` */
      get token() {
        return options.DISCORD_TOKEN ?? fail("`DISCORD_TOKEN` is missing!");
      },
      /** `DISCORD_NICKNAME` */
      get nickname() {
        return options.DISCORD_NICKNAME ?? configuration.target.cli;
      },
      /** `DISCORD_PLAYING` */
      get playing() {
        return options.DISCORD_PLAYING ?? configuration.target.cli;
      },
    };
  },
  get bot(): BotConfig {
    return {
      token: configuration.discord.token,
      intents: ["Guilds", "GuildMessages", "DirectMessages"],
      eventHandlers: eventHandlers,
    };
  },
};
