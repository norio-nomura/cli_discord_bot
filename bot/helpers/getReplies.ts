import { Bot } from "../../deps.ts";

/** Returns messages replied by bot to the messageId and channelId */
export async function getReplies(bot: Bot, channelId: bigint, messageId: bigint) {
  const msgs = await bot.helpers.getMessages(channelId, {
    after: messageId,
  });
  return msgs.filter((msg) =>
    msg.authorId === bot.id &&
    typeof msg?.messageReference?.messageId != "undefined" &&
    msg.messageReference.messageId === messageId
  ).array().sort((l, r) => l.timestamp - r.timestamp);
}
