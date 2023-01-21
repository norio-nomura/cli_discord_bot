import { ChannelTypes, EventHandlers } from "../../deps.ts";
import { executeTarget } from "../utils/executeTarget.ts";
import { zipLongest } from "../utils/zip.ts";

export const messageUpdate: EventHandlers["messageUpdate"] = async function (bot, msg, oldMsg) {
  try {
    if (msg.shouldBeIgnored) return;

    const channelType = (await bot.helpers.getChannel(msg.channelId)).type;
    const isChannelTypeSupported = [
      ChannelTypes.GuildText,
      ChannelTypes.PublicThread,
      ChannelTypes.PrivateThread,
    ].includes(channelType);
    const isDM = channelType === ChannelTypes.DM;
    if (isChannelTypeSupported) {
      // new message may be changed to delete mentions to bot
      // if (!msg.mentioning(bot)) return;
    } else if (!isDM) {
      return;
    }

    const defaultCmds = isDM ? [""] : [];
    const oldInput = oldMsg?.codeblock;
    const oldCmds = oldMsg?.commandlinesFor(bot) || defaultCmds;

    const input = msg.codeblock;
    const cmds = msg.commandlinesFor(bot) || defaultCmds;
    // Is the message changed from the old message?
    if (input === oldInput && JSON.stringify(cmds) === JSON.stringify(oldCmds)) return;

    if (cmds.length > 0) {
      await bot.helpers.startTyping(msg.channelId);
    }

    // if input or commandline is not empty, bot can execute target
    const canExecute = input ? () => true : (cmd: string) => !!cmd;
    // if multple replies are needed, content should include commandline
    const outputCmd = cmds.length > 1 ? true : false;
    const resultsPromise = Promise.all(
      cmds.map((cmd) => canExecute(cmd) ? executeTarget(cmd, input, outputCmd) : bot.helpers.helpResult()),
    );
    const resultAndReplies = await Promise.all([resultsPromise, bot.helpers.getReplies(msg.channelId, msg.id)]);

    for (const [result, reply] of zipLongest(...resultAndReplies)) {
      if (result && reply) {
        await reply.edit(bot, result);
      } else if (result) {
        await bot.helpers.sendReply(msg, result);
      } else if (reply) {
        await reply.delete(bot);
      }
    }
  } catch (error) {
    const link = `https://discord.com/channels/${msg.guildId || "@me"}/${msg.channelId}/${msg.id}`;
    console.error(`\`messageUpdate\`: "${link}" failed with error: "${error}"`);
  }
};
