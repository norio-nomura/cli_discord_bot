import { EventHandlers } from "../../deps.ts";
import { messageCreate } from "./messageCreate.ts";
import { messageDelete } from "./messageDelete.ts";
import { messageUpdate } from "./messageUpdate.ts";
import { ready } from "./ready.ts";

export const events: Partial<EventHandlers> = {
  messageCreate,
  messageDelete,
  messageUpdate,
  ready,
};
