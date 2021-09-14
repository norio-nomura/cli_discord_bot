import { EventHandlers } from "../../deps.ts";

export const eventHandlers = {} as EventHandlers;

export async function loadEventHandlers(): Promise<EventHandlers> {
  await import("./guildAvailable.ts");
  await import("./messageCreate.ts");
  await import("./messageDelete.ts");
  await import("./messageUpdate.ts");
  await import("./ready.ts");
  return eventHandlers;
}
