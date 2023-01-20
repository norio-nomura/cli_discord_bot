import { env } from "./env.ts";

export class Options {
  [key: string]: unknown;
  /** Discord Nickname */
  DISCORD_NICKNAME: string | undefined;
  /** Discord status for "Playing" */
  DISCORD_PLAYING: string | undefined;
  /** Discord Bot's token */
  DISCORD_TOKEN = env.DISCORD_TOKEN;
  /** arguments for Env command */
  ENV_ARGS = "-i";
  /** Env command launching Timeout command */
  ENV_COMMAND = "/usr/bin/env";
  /** PATH environment variable */
  PATH = env.PATH;
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
}

export let options = new Options();
export function setOptions(newOptions: Partial<Options>) {
  options = {
    ...options,
    ...newOptions,
  };
}
