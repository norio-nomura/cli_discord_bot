import { configuration } from "../configuration.ts";
import { shelljoin, shellsplit } from "./shellwords.ts";

export interface ExecutionResult {
  status: number;
  content: string;
  stdout?: string;
  stderr?: string;
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
      p.output().then(decode),
      p.stderrOutput().then(decode),
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
    if (stdout.length > 0) {
      const header = status.code !== 0 ? "stdout:```\n" : "```\n";
      const footer = "```";
      const limit = contentMax - content.length - header.length - footer.length;
      if (limit > 0 && stdout.length > limit) {
        content += header + stdout.substr(0, limit) + footer;
        attachOutput = true;
      } else {
        content += header + stdout + footer;
      }
    }
    if (stderr.length > 0) {
      const header = "stderr:```\n";
      const footer = "```";
      const remain = contentMax - content.length;
      if (remain > header.length + footer.length) {
        const limit = contentMax - content.length - header.length -
          footer.length;
        if (limit > 0 && stderr.length > limit) {
          content += header + stderr.substr(0, limit) + footer;
          attachError = true;
        } else {
          content += header + stderr + footer;
        }
      } else {
        attachError = true;
      }
    }
    return {
      status: status.code,
      content,
      stdout: attachOutput ? stdout : undefined,
      stderr: attachError ? stderr : undefined,
    };
  } catch (err) {
    Error.captureStackTrace(err, executeTarget);
    return {
      status: -1,
      content: (outputCommandline ? "`" + commandline + "`\n" : "") + `${err}`,
    };
  }
}
