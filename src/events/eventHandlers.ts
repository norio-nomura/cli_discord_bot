import { EventHandlers } from "../../deps.ts";
import { guildAvailable } from "./guildAvailable.ts";
import { messageCreate } from "./messageCreate.ts";
import { messageDelete } from "./messageDelete.ts";
import { messageUpdate } from "./messageUpdate.ts";
import { ready } from "./ready.ts";

export const eventHandlers: EventHandlers = {
  guildAvailable,
  messageCreate,
  messageDelete,
  messageUpdate,
  ready,
};
