import { Bot, CreateMessage, Message } from "../../deps.ts";

export async function sendReply(bot: Bot, msg: Message, content: string | CreateMessage, mentionUser = true) {
  const contentWithMention: CreateMessage = typeof content === "string"
    ? {
      content,
      allowedMentions: {
        repliedUser: mentionUser,
      },
      messageReference: {
        messageId: msg.id,
        failIfNotExists: false,
      },
    }
    : {
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
