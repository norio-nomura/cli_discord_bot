import { Bot, DiscordMessage, EditMessage, Message, MessageTypes, transformMessage } from "../../deps.ts";
import { codeblockFrom, commandlinesFrom } from "../utils/messageContent.ts";

declare module "../../deps.ts" {
  interface Message extends ReturnType<typeof transformMessage> {
    /** Returns the first code block in the message */
    codeblock: string | undefined;
    /**
     * Parses content in message and returns commandlines for target if available.
     * Commandlines are captured between mention to bot and end of line.
     */
    commandlinesFor: (bot: Bot) => string[] | undefined;
    edit: (bot: Bot, content: string | EditMessage) => Promise<Message>;
    delete: (bot: Bot) => Promise<void>;
    /** Returns true if the message mentioned bot */
    mentioning: (bot: Bot) => boolean;
    /** Returns true if the message should be ignored */
    shouldBeIgnored: boolean;
  }
}

export const transformExtendedMessage = (
  bot: Bot,
  payload: DiscordMessage,
): Message => {
  const message: Message = {
    ...transformMessage(bot, payload),
    get codeblock(): string | undefined {
      return codeblockFrom(message.content);
    },
    commandlinesFor: (bot: Bot) => message.mentioning(bot) ? commandlinesFrom(message.content, bot.id) : undefined,
    edit: (bot: Bot, content: string | EditMessage) =>
      bot.helpers.editMessage(message.channelId, message.id, typeof content == "string" ? { content } : content),
    delete: (bot: Bot) => bot.helpers.deleteMessage(message.channelId, message.id),
    mentioning: (bot: Bot) => isMentioned(bot, message),
    get shouldBeIgnored(): boolean {
      return shouldIgnore(message);
    },
  };
  return message;
};

/** Returns true if the message mentioned bot */
function isMentioned(bot: Bot, message?: Message): boolean {
  return message?.mentionedUserIds.includes(bot.id) || false;
}

/** Returns true if the message should be ignored */
function shouldIgnore(message: Message): boolean {
  const targetTypes = [MessageTypes.Default, MessageTypes.Reply];
  return message.isFromBot || !targetTypes.includes(message.type);
}
