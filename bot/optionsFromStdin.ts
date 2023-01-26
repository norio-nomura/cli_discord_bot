import { readAllSync } from "../deps.ts";
import { Options } from "./options.ts";

export const optionsFromStdin: { [key in keyof Options]: Options[key] } = JSON.parse(
  new TextDecoder().decode(readAllSync(Deno.stdin)),
);
