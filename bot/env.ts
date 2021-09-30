async function envIfGranted(key: string): Promise<string | undefined> {
  const status = await Deno.permissions.query({ name: "env", variable: key });
  return status.state === "granted" ? Deno.env.get(key) : undefined;
}

export const env = {
  /** Discord Bot's token. It fails if not granted. */
  DISCORD_TOKEN: await envIfGranted("DISCORD_TOKEN"),
  /** PATH environment variable. It fails if not granted. */
  PATH: await envIfGranted("PATH"),
};
