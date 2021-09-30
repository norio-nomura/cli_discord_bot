import { editBotStatus, EventHandlers } from "../../deps.ts";
import { configuration } from "../configuration.ts";

export const ready: EventHandlers["ready"] = function () {
  console.info("Successfully connected to gateway");
  try {
    editBotStatus({
      status: "online",
      activities: [{ name: configuration.discord.playing, type: 0, createdAt: Date.now() }],
    });
  } catch (error) {
    console.error(`\`ready\` failed with error: "${error}"`);
  }
};
