import { fail } from "../deps.ts";
import { envIfGranted } from "./utils/envIfGranted.ts";

export const requiredEnv = {
  PATH: envIfGranted("PATH") || fail("`PATH` environment variable is missing!"),
};

// Declare Options class and default values.
export class Options {
  /** The first attachment with this extension found is treated as input */
  ATTACHMENT_EXTENSION_TO_TREAT_AS_INPUT = "";
  /** Discord Nickname */
  DISCORD_NICKNAME: string | undefined;
  /** Discord status for "Playing" */
  DISCORD_PLAYING: string | undefined;
  /** Discord Bot's token */
  DISCORD_TOKEN = "";
  /** arguments for Env command */
  ENV_ARGS = "-i";
  /** Env command launching Timeout command */
  ENV_COMMAND = "/usr/bin/env";
  /** Upload output as file if contains more lines than */
  NUMBER_OF_LINES_TO_EMBED_OUTPUT = 20;
  /** Embed preview lines of uploaded output to content */
  NUMBER_OF_LINES_TO_EMBED_UPLOADED_OUTPUT = 3;
  /** PATH environment variable */
  PATH = requiredEnv.PATH;
  /** arguments for CLI to use standard input */
  TARGET_ARGS_TO_USE_STDIN: string | undefined;
  /** target CLI */
  TARGET_CLI = "cat";
  /** arguments for CLI with no arguments */
  TARGET_DEFAULT_ARGS: string | undefined;
  /** arguments for timeout command */
  TIMEOUT_ARGS = "--signal=KILL 30";
  /** Timeout command launching target CLI */
  TIMEOUT_COMMAND = "timeout";

  static get fromEnv() {
    return optionsFromEnv();
  }

  static printOptionsFromEnv() {
    writeAllSync(Deno.stdout, new TextEncoder().encode(JSON.stringify(Options.fromEnv)));
  }
}

const keyOfOptions = Object.keys(new Options()) as (keyof Options)[];
const valueConverters: { [key in keyof Options]?: (value: string) => Options[key] } = {
  NUMBER_OF_LINES_TO_EMBED_OUTPUT: parseInt,
  NUMBER_OF_LINES_TO_EMBED_UPLOADED_OUTPUT: parseInt,
};

function optionsFromEnv() {
  return keyOfOptions.reduce((env, key) => {
    const value = envIfGranted(key);
    if (value) {
      const converter = valueConverters[key];
      env = { ...env, ...Object.fromEntries([[key, converter ? converter(value) : value]]) };
    }
    return env;
  }, {} as { [key in keyof Options]: Options[key] });
}

export let options = new Options();
export function setOptions(newOptions: Partial<Options>) {
  options = {
    ...options,
    ...newOptions,
  };
}
