import { botId, DiscordenoMessage, DiscordMessageTypes, getChannel, getMessages } from "../../deps.ts";
import { getCurrentUser } from "../helpers/getCurrentUser.ts";
import { ExecutionResult } from "./executeTarget.ts";

/** Returns true if the message should be ignored */
export function shouldIgnore(message: DiscordenoMessage): boolean {
  const targetTypes = [DiscordMessageTypes.Default, DiscordMessageTypes.Reply];
  return message.isBot || !(message.type in targetTypes);
}

/** Returns the channel type of the message */
export async function channelTypeOf(message: DiscordenoMessage) {
  return (message.channel || await getChannel(message.channelId)).type;
}

/** Returns true if the message mentioned bot */
export function isMentioned(message?: DiscordenoMessage): boolean {
  return message?.mentionedUserIds.includes(botId) || false;
}

/**
 * Parses content in message and returns commandlines for target if available.
 * Commandlines are captured between mention to bot and end of line.
 */
export function commandlines(message?: DiscordenoMessage): string[] | undefined {
  if (message == undefined || !isMentioned(message)) return;

  const patternForMentionToBot = new RegExp(`<@!?${botId}>(?<args>.*)$`, "mg");
  const matches = message.content.matchAll(patternForMentionToBot);
  const extractMention = (m: RegExpMatchArray) => m[0].replace(/<@!?\d+>/g, "");
  const lines = [...new Set([...matches].map(extractMention))];
  return lines.length != 0 ? lines : undefined;
}

/** Returns the first code block in the message */
export function codeblock(message?: DiscordenoMessage): string | undefined {
  const match = message?.content.match(/```(?:.*?\n)?(?<input>.*?)```/ms);
  return match?.groups?.input;
}

/** Build help message content for replying to the message */
export async function help(message: DiscordenoMessage) {
  const username = message.guild?.bot?.name(message.guildId) || (await getCurrentUser()).username;
  return {
    status: 0,
    content: `\`\`\`
Usage:
@${username} [OPTIONS]
\`\u{200b}\`\u{200b}\`\u{200b}
\[contents for standard input\]
\`\u{200b}\`\u{200b}\`\u{200b}
\`\`\`
`,
  } as ExecutionResult;
}

const snowflakeFrom = (i: bigint | string): string => typeof i === "string" ? i : i && i.toString() || "";
const bigintFrom = (i: bigint | string): bigint => typeof i === "bigint" ? i : i && BigInt(i) || 0n;

/** Returns messages replied by bot to the messageId and channelId */
export async function getReplies(channelId: bigint | string, messageId: bigint | string) {
  const msgs = await getMessages(bigintFrom(channelId), {
    after: bigintFrom(messageId),
  });
  const messageIdString = snowflakeFrom(messageId);
  return msgs.filter((msg) =>
    msg.authorId === botId &&
    msg?.messageReference?.messageId &&
    msg.messageReference.messageId == messageIdString
  ).sort((l, r) => l.timestamp - r.timestamp);
}
