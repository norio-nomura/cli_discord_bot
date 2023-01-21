import { FileContent } from "../../deps.ts";
import { configuration } from "../configuration.ts";
import { shelljoin, shellsplit } from "./shellwords.ts";

export interface ExecutionResult {
  content?: string;
  file?: FileContent[];
}

const decode = (r: Uint8Array): string => new TextDecoder().decode(r);
const encode = (s: string): Uint8Array => new TextEncoder().encode(s);

/**
 * Execute target with options and input, then returns the execution result
 * @param commandline will be passed to the target
 * @param input will be passed to the target
 * @param outputCommandline output commandline to content if true
 * @returns ExecutionResult
 */
export async function executeTarget(
  commandline: string,
  input?: string,
  outputCommandline = false,
): Promise<ExecutionResult> {
  const contentMax = 2000;
  let content = "";
  let attachOutput = false;
  let attachError = false;

  try {
    // Setup RunOptions
    const options = shellsplit(commandline);
    const cli = [
      configuration.target.cli,
      ...(options.length > 0 ? options : configuration.target.defaultArguments),
      ...(input != undefined ? configuration.target.argumentsToUseStdin : []),
    ];
    const cmd = [...configuration.envCommand, ...configuration.timeoutCommand, ...cli];
    const opt: Deno.RunOptions = {
      cmd,
      stdin: input != undefined ? "piped" : "null",
      stdout: "piped",
      stderr: "piped",
    };

    // Run target
    const p = Deno.run(opt);
    console.info(`\`executeTarget\`: \`${shelljoin(cmd)}\``);

    // Setup stdin
    const stdinWriter = input != undefined && p.stdin
      ? p.stdin.write(encode(input)).then(() => p.stdin?.close())
      : Promise.resolve();

    // await
    const [status, stdout, stderr] = await Promise.all([
      p.status(),
      p.output(),
      p.stderrOutput(),
      stdinWriter,
    ]);

    // Build content from result
    content += outputCommandline ? "`" + shelljoin(cli) + "`\n" : "";
    if (status.code === 128 + 9) {
      content += "execution timeout with ";
    } else if (status.code !== 0) {
      content += `exit status: ${status.code} with `;
    }
    if (stdout.length === 0 && stderr.length === 0) {
      content += "no output";
    }
    const file: FileContent[] = [
      stdout.length > 0 ? { blob: new Blob([stdout.buffer]), name: "stdout.log"} : undefined,
      stderr.length > 0 ? { blob: new Blob([stderr.buffer]), name: "stderr.log"} : undefined,
    ].filter((element): element is FileContent => element !== undefined);
    return file.length > 0 ?  { content, file } : { content };
  } catch (err) {
    Error.captureStackTrace(err, executeTarget);
    return {
      content: (outputCommandline ? "`" + commandline + "`\n" : "") + `${err}`,
    };
  }
}
