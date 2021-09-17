import { fail } from "../../deps.ts";

export async function guardEnv(key: string, defaultValue?: string) {
  const status = await Deno.permissions.query({ name: "env", variable: key });
  return status.state === "granted" && Deno.env.get(key) ||
    (defaultValue != undefined ? defaultValue : fail(`\`${key}\` environment variable is not defined!`));
}
