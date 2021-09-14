// Ported from Ruby's [Shellwords](https://github.com/ruby/shellwords/blob/master/lib/shellwords.rb)

/**
 * Splits a string into an array of tokens in the same way the UNIX Bourne shell does.
 * It throws Error("Unmatched quote") if quote unmatch.
 */
export function shellsplit(string: string): string[] {
  var words: string[] = [];
  var field = "";

  const matches = string.matchAll(
    /\s*(?:([^\s\\\'\"]+)|'([^\']*)'|"((?:[^\"\\]|\\.)*)"|(\\.?)|(\S))(\s?|$)/gm,
  );
  for (const [, word, sq, dq, esc, garbage, sep] of matches) {
    if (garbage) throw new Error("Unmatched quote: `" + string + "`");
    field += word || sq || (dq && dq.replace(/\\([$`"\\\n])/g, "\$1")) ||
      (esc && esc.replace(/\\(.)/g, "\$1")) || "";
    if (typeof sep == "string") { // `sep` can be "", so check the type.
      words.push(field);
      field = "";
    }
  }
  return words;
}

/** Escapes a string so that it can be safely used in a Bourne shell command line. */
export function shellescape(string: string): string {
  return string
    ? string.replace(/[^A-Za-z0-9_\-.,:+\/@\n]/g, "\\$&").replace(/\n/g, "'\n'")
    : "''";
}

/** Builds a command line string from an argument list */
export function shelljoin(strings: string[]): string {
  return strings.map(shellescape).join(" ");
}
