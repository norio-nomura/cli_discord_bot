import { EventHandlers } from "../../deps.ts";
import { configuration } from "../configuration.ts";

export const ready: EventHandlers["ready"] = async function (bot, payload) {
  console.info("Successfully connected to gateway");
  try {
    bot.helpers.editBotStatus({
      status: "online",
      activities: [{ name: configuration.discord.playing, type: 0, createdAt: Date.now() }],
    });
    console.info(`\`ready\`: changed status to "playing: ${configuration.discord.playing}"`);
    for (const guildId of payload.guilds) {
      const member = await bot.helpers.getMember(guildId, payload.user.id);
      if (member.nick != configuration.discord.nickname) {
        await bot.helpers.editBotMember(guildId, { nick: configuration.discord.nickname });
        console.info(
          `\`ready\`: changed nick from "${member.nick}" to "${configuration.discord.nickname}" in guild(${guildId})`,
        );
      }
    }
  } catch (error) {
    console.error(`\`ready\` failed with error: "${error}"`);
  }
};
