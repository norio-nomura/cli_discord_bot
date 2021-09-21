import { Args, parse } from "../deps.ts";

export class Defaults {
  [key: string]: unknown
  /** Discord Nickname */
  DISCORD_NICKNAME: string | undefined;
  /** Discord status for "Playing" */
  DISCORD_PLAYING: string | undefined;
  /** Discord Bot's token */
  DISCORD_TOKEN: string | undefined = undefined;
  /** arguments for Env command */
  ENV_ARGS = "-i";
  /** Env command launching Timeout command */
  ENV_COMMAND = "/usr/bin/env";
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
  /** watchdog targets represented in json */
  WATCHDOG_TARGETS: string | undefined;
}

export const options = parse(Deno.args, {
  default: new Defaults(),
  alias: Object.fromEntries(Object.keys(Defaults).map((k) => [k, k.toLowerCase().replaceAll("_", "-")])),
}) as Defaults & Pick<Args, "_">;
