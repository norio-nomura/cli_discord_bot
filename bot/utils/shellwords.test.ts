// Ported from Ruby's [TestShellwords](https://github.com/ruby/shellwords/blob/master/test/test_shellwords.rb)

import { assertEquals, assertThrows } from "../../deps.ts";
import { shellescape, shelljoin, shellsplit } from "./shellwords.ts";

Deno.test("shellsplit", () => {
  const cmd1 = "ruby -i'.bak' -pe \"sub /foo/, '\\\\&bar'\" foobar\\ me.txt\n";
  assertEquals(shellsplit(cmd1), ["ruby", "-i.bak", "-pe", "sub /foo/, '\\&bar'", "foobar me.txt"]);

  // shellwords does not interpret meta-characters
  const cmd2 = "ruby my_prog.rb | less";
  assertEquals(shellsplit(cmd2), ["ruby", "my_prog.rb", "|", "less"]);
});

Deno.test("test_unmatched_double_quote", () => {
  const badCmd = 'one two "three';
  assertThrows(() => shellsplit(badCmd), Error, "Unmatched quote: `");
});

Deno.test("test_unmatched_single_quote", () => {
  const badCmd = "one two 'three";
  assertThrows(() => shellsplit(badCmd), Error, "Unmatched quote: `");
});

Deno.test("test_unmatched_quotes", () => {
  const badCmd = "one '" + '"' + '""' + "";
  assertThrows(() => shellsplit(badCmd), Error, "Unmatched quote: `");
});

Deno.test("test_backslashes", () => {
  [
    [
      `/a//b///c////d/////e/ "/a//b///c////d/////e/ "'/a//b///c////d/////e/ '/a//b///c////d/////e/ `,
      "a/b/c//d//e /a/b//c//d///e/ /a//b///c////d/////e/ a/b/c//d//e ",
    ],
    [
      'printf %s /"/$/`///"/r/n',
      "printf",
      "%s",
      '"$`/"rn',
    ],
    [
      'printf %s "/"/$/`///"/r/n"',
      "printf",
      "%s",
      '"$`/"/r/n',
    ],
  ].map((strs) => {
    const [cmdline, ...expected] = strs.map((str) => str.replaceAll("/", "\\"));
    assertEquals(shellsplit(cmdline), expected);
  });
});

Deno.test("test_shellescape", () => {
  assertEquals(shellescape(""), "''");
  assertEquals(shellescape("^AZaz09_\\-.,:\/@\n+'\""), "\\^AZaz09_\\\\-.,:/@'\n'+\\'\\\"");
});

Deno.test("test_whitespace", () => {
  const empty = "";
  const space = " ";
  const newline = "\n";
  const tab = "\t";

  const tokens = [
    empty,
    space,
    space + space,
    newline,
    newline + newline,
    tab,
    tab + tab,
    empty,
    space + newline + tab,
    empty,
  ];

  tokens.forEach((token) => {
    assertEquals(shellsplit(shellescape(token)), [token]);
  });

  assertEquals(tokens, shellsplit(shelljoin(tokens)));
});

Deno.test("test_multibyte_characters", () => {
  // This is not a spec.  It describes the current behavior which may
  // be changed in future.  There would be no multibyte character
  // used as shell meta-character that needs to be escaped.
  assertEquals(shellescape("あい"), "\\あ\\い");
});
