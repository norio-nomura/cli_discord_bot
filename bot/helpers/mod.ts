import "../../deps.ts";
import { getCurrentUser } from "./getCurrentUser.ts";
import { getReplies } from "./getReplies.ts";
import { helpResult } from "./helpResult.ts";
import { sendReply } from "./sendReply.ts";

export const helpers = { getCurrentUser, getReplies, helpResult, sendReply };
type ExtendingHelpers = typeof helpers;

declare module "../../deps.ts" {
  // deno-lint-ignore no-empty-interface
  interface Helpers extends ExtendingHelpers {}
}
