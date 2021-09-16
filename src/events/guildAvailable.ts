import { editBotNickname, EventHandlers } from "../../deps.ts";
import { discord } from "../botConfiguration.ts";

export const guildAvailable: EventHandlers["guildAvailable"] = function (guild) {
  console.info(`Guild Available: ${guild.name}`);

  try {
    if (guild.botMember?.nick != discord.nickname) {
      editBotNickname(guild.id, discord.nickname);
    }
  } catch (error) {
    console.error(
      `\`guildAvailable\` failed with error: "${error}"`,
    );
  }
};
