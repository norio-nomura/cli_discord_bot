import { DiscordChannelTypes, EventHandlers, startTyping } from "../../deps.ts";
import { executeTarget } from "../utils/executeTarget.ts";
import {
  channelTypeOf,
  codeblock,
  commandlines,
  help,
  isMentioned,
  shouldIgnore,
} from "../utils/message.ts";

export const messageCreate: EventHandlers["messageCreate"] = async function (msg) {
  try {
    if (shouldIgnore(msg)) return;

    const channelType = await channelTypeOf(msg);
    const isChannelTypeSupported = [
      DiscordChannelTypes.GuildText,
      DiscordChannelTypes.GuildPublicThread,
      DiscordChannelTypes.GuildPrivateThread,
    ].includes(channelType);
    const isDM = channelType === DiscordChannelTypes.DM;
    if (isChannelTypeSupported) {
      if (!isMentioned(msg)) return;
    } else if (!isDM) {
      return;
    }

    await startTyping(msg.channelId);

    const defaultCmds = isDM ? [""] : [];
    const input = codeblock(msg);
    const cmds = isMentioned(msg) && commandlines(msg) || defaultCmds;
    // if input or commandline is not empty, bot can execute target
    const canExecute = input ? () => true : (cmd: string) => !!cmd;
    // if multple replies are needed, content should include commandline
    const outputCmd = cmds.length > 1 ? true : false;
    const results = await Promise.all(
      cmds.map((cmd) =>
        canExecute(cmd) ? executeTarget(cmd, input, outputCmd) : help(msg)
      ),
    );
    for (const result of results) {
      await msg.reply(result.content);
    }
  } catch (error) {
    console.error(
      `\`messageCreate\`: "${msg.link}" failed with error: "${error}"`,
    );
  }
};
