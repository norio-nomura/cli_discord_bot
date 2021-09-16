import { DiscordChannelTypes, EventHandlers, startTyping } from "../../deps.ts";
import { executeTarget } from "../utils/executeTarget.ts";
import {
  channelTypeOf,
  codeblock,
  commandlines,
  getReplies,
  help,
  isMentioned,
  shouldIgnore,
} from "../utils/message.ts";
import { zipLongest } from "../utils/zip.ts";

export const messageUpdate: EventHandlers["messageUpdate"] = async function (msg, oldMsg) {
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
      // new message may be changed to delete mentions to bot
      // if (!isMentioned(msg)) return;
    } else if (!isDM) {
      return;
    }

    const defaultCmds = isDM ? [""] : [];
    const oldInput = codeblock(oldMsg);
    const oldCmds = isMentioned(oldMsg) && commandlines(oldMsg) || defaultCmds;

    const input = codeblock(msg);
    const cmds = isMentioned(msg) && commandlines(msg) || defaultCmds;
    // Is the message changed from the old message?
    if (input === oldInput && JSON.stringify(cmds) === JSON.stringify(oldCmds)) return;

    if (cmds.length > 0) {
      await startTyping(msg.channelId);
    }

    // if input or commandline is not empty, bot can execute target
    const canExecute = input ? () => true : (cmd: string) => !!cmd;
    // if multple replies are needed, content should include commandline
    const outputCmd = cmds.length > 1 ? true : false;
    const resultsPromise = Promise.all(
      cmds.map((cmd) => canExecute(cmd) ? executeTarget(cmd, input, outputCmd) : help(msg)),
    );
    const resultAndReplies = await Promise.all([resultsPromise, getReplies(msg.channelId, msg.id)]);

    for (const [result, reply] of zipLongest(...resultAndReplies)) {
      if (result && reply) {
        await reply.edit(result.content);
      } else if (result) {
        await msg.reply(result.content);
      } else if (reply) {
        await reply.delete();
      }
    }
  } catch (error) {
    console.error(`\`messageUpdate\`: "${msg.link}" failed with error: "${error}"`);
  }
};
