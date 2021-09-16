import { editBotStatus, EventHandlers } from "../../deps.ts";
import { discord } from "../botConfiguration.ts";

export const ready: EventHandlers["ready"] = function () {
  console.info("Successfully connected to gateway");
  try {
    editBotStatus({
      status: "online",
      activities: [{ name: discord.playing, type: 0, createdAt: Date.now() }],
    });
  } catch (error) {
    console.error(
      `\`ready\` failed with error: "${error}"`,
    );
  }
};
