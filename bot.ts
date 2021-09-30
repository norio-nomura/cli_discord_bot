import { startBot } from "./deps.ts";
import { configuration } from "./bot/configuration.ts";
import { setOptions } from "./bot/options.ts";

setOptions({
// Set options here
});

startBot(configuration.bot);
