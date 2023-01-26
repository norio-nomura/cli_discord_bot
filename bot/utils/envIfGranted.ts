export async function envIfGranted(key: string): Promise<string | undefined> {
  const status = await Deno.permissions.query({ name: "env", variable: key });
  return status.state === "granted" ? Deno.env.get(key) : undefined;
}
