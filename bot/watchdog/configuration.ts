import { endpoints, User } from "../../deps.ts";
import { guardEnv } from "../utils/guardEnv.ts";

export interface WatchdogTarget {
  host: string;
  id: string;
  token: string;
}

const watchdogTargetsEnv = await guardEnv("WATCHDOG_TARGETS");
const targets = JSON.parse(watchdogTargetsEnv) as Omit<WatchdogTarget, "id">[];
const targetWithIDs = await Promise.all(targets.map(async ({ token, host }) => {
  return {
    id: await getUserId(token),
    token,
    host,
  } as WatchdogTarget;
}));

export const watchdogTargets = new Map<string, WatchdogTarget>(
  targetWithIDs.map((target) => {
    return [target.id, target];
  }),
);

async function getUserId(token: string): Promise<string> {
  const result = await fetch(endpoints.USER_BOT, { method: "GET", headers: { authorization: `Bot ${token}` } }).then(
    (response) => response.json()
  ) as User;
  return result.id;
}
