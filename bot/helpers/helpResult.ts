import { Bot } from "../../deps.ts";
import { ExecutionResult } from "../utils/executeTarget.ts";
import { getCurrentUser } from "./getCurrentUser.ts";

/** Build help message execution result for replying to the message */
export async function helpResult(bot: Bot): Promise<ExecutionResult> {
  const username = (await getCurrentUser(bot)).username;
  return {
    content: `\`\`\`
Usage:
@${username} [OPTIONS]
\`\u{200b}\`\u{200b}\`\u{200b}
\[contents for standard input\]
\`\u{200b}\`\u{200b}\`\u{200b}
\`\`\`
`,
  };
}
