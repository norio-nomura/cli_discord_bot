import { EventHandlers } from "../../deps.ts";
import { getReplies, shouldIgnore } from "../utils/message.ts";

export const messageDelete: EventHandlers["messageDelete"] = async function ({ id, channelId }, msg) {
  try {
    if (msg && shouldIgnore(msg)) return;

    // delete all bot's replies against them message
    const replies = await getReplies(channelId, id);
    await Promise.all(replies.map((reply) => reply.delete()));
  } catch (error) {
    console.error(
      `\`messageDelete\`: "${msg?.link}" failed with error: "${error}"`,
    );
  }
};
