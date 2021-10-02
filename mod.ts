import { startBot } from "./deps.ts";
import { configuration, Options, setOptions } from "./bot/mod.ts";

export function startCLIBot(options: Partial<Options>) {
  setOptions(options);
  startBot(configuration.bot);
}
