import { startBot } from "./deps.ts";
import { botConfiguration } from "./src/botConfiguration.ts";

startBot(await botConfiguration());
