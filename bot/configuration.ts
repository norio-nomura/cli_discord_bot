import { Bot, createBot, fail, GatewayIntents } from "../deps.ts";
import { events } from "./events/mod.ts";
import { shellsplit } from "./utils/shellwords.ts";
import { Options, options } from "./options.ts";
import { transformers } from "./transformers/mod.ts";
import { helpers } from "./helpers/mod.ts";

export const configuration = {
  get bot(): Bot {
    return createBot({
      token: configuration.discord.token,
      intents: GatewayIntents.Guilds | GatewayIntents.GuildMessages | GatewayIntents.DirectMessages,
      botId: 0n,
      events,
      transformers,
      helpers,
    });
  },
  get discord() {
    return {
      /** `DISCORD_TOKEN` */
      get token() {
        return options.DISCORD_TOKEN || fail("`DISCORD_TOKEN` is missing!");
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
  get envCommand(): string[] {
    return [
      options.ENV_COMMAND || new Options().ENV_COMMAND, // Prefer default value than ""
      ...shellsplit(options.ENV_ARGS),
      "PATH=" + (options.PATH || fail("`PATH` environment variable is missing!")),
    ];
  },
  get output() {
    return {
      /** Upload output as file if contains more lines than */
      numberOfLinesToEmbed: options.NUMBER_OF_LINES_TO_EMBED_OUTPUT,
      /** Embed preview lines of uploaded output to content */
      numberOfLinesToEmbedUploaded: options.NUMBER_OF_LINES_TO_EMBED_UPLOADED_OUTPUT,
    };
  },
  get target() {
    return {
      /** `TARGET_CLI` */
      cli: options.TARGET_CLI || new Options().TARGET_CLI, // Prefer default value than ""
      /** `TARGET_ARGS_TO_USE_STDIN` */
      argumentsToUseStdin: shellsplit(options.TARGET_ARGS_TO_USE_STDIN ?? ""),
      /** `TARGET_DEFAULT_ARGS` */
      defaultArguments: shellsplit(options.TARGET_DEFAULT_ARGS ?? ""),
      /** `ATTACHMENT_EXTENSION_TO_TREAT_AS_INPUT` */
      attachmentExtensionToTreatAsInput: options.ATTACHMENT_EXTENSION_TO_TREAT_AS_INPUT,
    };
  },
  get timeoutCommand(): string[] {
    return [
      options.TIMEOUT_COMMAND || new Options().TIMEOUT_COMMAND, // Prefer default value than ""
      ...shellsplit(options.TIMEOUT_ARGS),
    ];
  },
};
