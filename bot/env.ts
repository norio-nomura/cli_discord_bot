import { fail } from "../deps.ts";

async function envIfGranted(key: string): Promise<string | undefined> {
  const status = await Deno.permissions.query({ name: "env", variable: key });
  return status.state === "granted" ? Deno.env.get(key) : undefined;
}

async function guardEnv(key: string, defaultValue?: string): Promise<string> {
  return await envIfGranted(key) ?? defaultValue ?? fail(`\`${key}\` environment variable is not defined!`);
}

export const env = {
  /** Discord Bot's token. It fails if not granted. */
  DISCORD_TOKEN: await guardEnv("DISCORD_TOKEN"),
  /** PATH environment variable. It fails if not granted. */
  PATH: await guardEnv("PATH"),
};
