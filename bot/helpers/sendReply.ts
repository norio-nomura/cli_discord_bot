import { Bot, CreateMessage, Message } from "../../deps.ts";

export async function sendReply(bot: Bot, msg: Message, content: CreateMessage, mentionUser = true) {
  const contentWithMention: CreateMessage = {
    ...content,
    allowedMentions: {
      repliedUser: mentionUser,
      ...(content.allowedMentions || {}),
    },
    messageReference: {
      messageId: msg.id,
      failIfNotExists: content.messageReference?.failIfNotExists === true,
    },
  };

  if (msg.guildId) return bot.helpers.sendMessage(msg.channelId!, contentWithMention);
  const dmChannel = await bot.helpers.getDmChannel(msg.authorId);
  return bot.helpers.sendMessage(dmChannel.id, contentWithMention);
}
