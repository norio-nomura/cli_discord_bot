import { assertEquals } from "../../deps.ts";
import { codeblockFrom, commandlinesFrom } from "./message.ts";

const botId = 80351110224678912n;
const mentions = {
  "mentioned by UserId": `<@${botId}>`,
  "mentioned by Nickname": `<@!${botId}>`,
};
const commandlines = {
  "has empty commandline": '',
  "has optimizer commandline": ' -O -',
}
const joiners = {
  "with line ending": '\n',
  "with codeblock ending": '',
};
type Codeblocks = {
  "and hello codeblock": string
  "and hello Swift codeblock": string
}
const codeblocks: Codeblocks = {
  "and hello codeblock": '```\nhello\n```',
  "and hello Swift codeblock": '```swift\nprint("hello Swift")\n```',
};
const expectedCodeblocks: Codeblocks = {
  "and hello codeblock": "hello\n",
  "and hello Swift codeblock": 'print("hello Swift")\n',
}

for (const [mentionType, mention] of Object.entries(mentions)) {
  for (const [optionType, commandline] of Object.entries(commandlines)) {
    for (const [joinerType, joiner] of Object.entries(joiners)) {
      let codeblockType: keyof Codeblocks;
      for (codeblockType in codeblocks ) {
        const content = [mention,commandline,joiner,codeblocks[codeblockType]].join('');
        const expectedCommandlines = [commandline];
        const expectedCodeblock = expectedCodeblocks[codeblockType];
        Deno.test(["commandlines:", mentionType, optionType, joinerType, codeblockType].join(" "), () => {
          assertEquals(commandlinesFrom(content, botId), expectedCommandlines);
        })
        Deno.test(["codeblock:", mentionType, optionType, joinerType, codeblockType].join(" "), () => {
          assertEquals(codeblockFrom(content), expectedCodeblock);
        })
      }
    }
  }
}
