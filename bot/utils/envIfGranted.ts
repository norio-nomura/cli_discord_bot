export function envIfGranted(key: string): string | undefined {
  const status = Deno.permissions.querySync({ name: "env", variable: key });
  return status.state === "granted" ? Deno.env.get(key) : undefined;
}
