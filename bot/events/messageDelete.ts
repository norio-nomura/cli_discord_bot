import { EventHandlers } from "../../deps.ts";

export const messageDelete: EventHandlers["messageDelete"] = async function (bot, { id, channelId, guildId }) {
  try {
    // delete all bot's replies against the message
    const replies = await bot.helpers.getReplies(channelId, id);
    await Promise.all(replies.map((reply) => reply.delete(bot)));
  } catch (error) {
    const link = `https://discord.com/channels/${guildId || "@me"}/${channelId}/${id}`;
    console.error(`\`messageDelete\`: "${link}" failed with error: "${error}"`);
  }
};
