import { envIfGranted, Options } from "./bot/mod.ts";
import { writeAllSync } from "./deps.ts";

const keyOfOptions = Object.keys(new Options()) as (keyof Options)[];
const valueConverters: { [key in keyof Options]?: (value: string) => Options[key] } = {
};

export const optionsFromEnv = await keyOfOptions.reduce(async (envPromise, key) => {
  let env = await envPromise;
  const value = await envIfGranted(key);
  if (value) {
    const converter = valueConverters[key];
    env = { ...env, ...Object.fromEntries([[key, converter ? converter(value) : value]]) };
  }
  return env;
}, Promise.resolve({} as { [key in keyof Options]: Options[key] }));

writeAllSync(Deno.stdout, new TextEncoder().encode(JSON.stringify(optionsFromEnv)));
