import { startBot, stopBot } from "./deps.ts";
import { configuration, Options, setOptions } from "./bot/mod.ts";

export function startCLIBot(options: Partial<Options>) {
  setOptions(options);
  const bot = configuration.bot;
  Deno.addSignalListener("SIGINT", async () => {
    console.info("Terminating by SIGINT");
    await stopBot(bot);
    Deno.exit();
  });
  Deno.addSignalListener("SIGTERM", async () => {
    console.info("Terminating by SIGTERM");
    await stopBot(bot);
    Deno.exit();
  });
  startBot(bot);
}
