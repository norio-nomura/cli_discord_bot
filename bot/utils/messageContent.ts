export function commandlinesFrom(content: string, botId: bigint): string[] | undefined {
  const patternForMentionToBot = new RegExp(`<@!?${botId}>(?<args>.*?)(?:\`\`\`|$)`, "mg");
  const matches = content.matchAll(patternForMentionToBot);
  const extractMention = (m: RegExpMatchArray) => m[1].replace(/<@!?\d+>/g, "");
  const lines = [...new Set([...matches].map(extractMention))];
  return lines.length !== 0 ? lines : undefined;
}

export function codeblockFrom(content: string): string | undefined {
  const match = content.match(/```(?:.*?\n)?(?<input>.*?)```/ms);
  return match?.groups?.input;
}
