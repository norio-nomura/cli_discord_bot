import { editBotStatus } from "../../deps.ts";
import { eventHandlers } from "./eventHandlers.ts";
import { discord } from "../botConfiguration.ts";

eventHandlers.ready = function () {
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
