import { ChannelTypes, EventHandlers } from "../../deps.ts";
import { executeTarget } from "../utils/executeTarget.ts";

export const messageCreate: EventHandlers["messageCreate"] = async function (bot, msg) {
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
      if (!msg.mentioning(bot)) return;
    } else if (!isDM) {
      return;
    }

    const defaultCmds = isDM ? [""] : [];
    const input = msg.codeblock;
    const cmds = msg.commandlinesFor(bot) || defaultCmds;

    if (cmds.length > 0) {
      await bot.helpers.startTyping(msg.channelId);
    }

    // if input or commandline is not empty, bot can execute target
    const canExecute = input ? () => true : (cmd: string) => !!cmd;
    // if multple replies are needed, content should include commandline
    const outputCmd = cmds.length > 1 ? true : false;
    const results = await Promise.all(
      cmds.map((cmd) => canExecute(cmd) ? executeTarget(cmd, input, outputCmd) : bot.helpers.helpResult()),
    );
    for (const result of results) {
      await bot.helpers.sendReply(msg, result.content);
    }
  } catch (error) {
    const link = `https://discord.com/channels/${msg.guildId || "@me"}/${msg.channelId}/${msg.id}`;
    console.error(`\`messageCreate\`: "${link}" failed with error: "${error}"`);
  }
};
