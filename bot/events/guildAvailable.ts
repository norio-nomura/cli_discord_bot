import { editBotNickname, EventHandlers } from "../../deps.ts";
import { configuration } from "../configuration.ts";

export const guildAvailable: EventHandlers["guildAvailable"] = function (guild) {
  console.info(`Guild Available: ${guild.name}`);

  try {
    if (guild.botMember?.nick != configuration.discord.nickname) {
      editBotNickname(guild.id, configuration.discord.nickname);
    }
  } catch (error) {
    console.error(`\`guildAvailable\` failed with error: "${error}"`);
  }
};
