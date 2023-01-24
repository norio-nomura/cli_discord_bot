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
      return { content };
    }

    // Upload outputs as files if `output.length` > 2000 or `output` contains 20+ lines
    const file: FileContent[] = [];
    const maxLinesToEmbed = configuration.output.numberOfLinesToEmbed;
    const previewLinesForUploaded = configuration.output.numberOfLinesToEmbedUploaded;
    const outputs = [
      { name: "stdout", output: stdout },
      { name: "stderr", output: stderr },
    ];
    for (const { name, output } of outputs) {
      if (output.length > 0) {
        const header = name == "stdout" && status.code !== 0 ? "stdout:```\n" : "```\n";
        const footer = "```";
        const limit = contentMax - content.length - header.length - footer.length;
        const outputString = decode(output);
        const headLines = outputString.substring(0, limit).split("\n", maxLinesToEmbed + 1);
        if (headLines.length > maxLinesToEmbed || outputString.length > limit) {
          content += header + headLines.slice(0, previewLinesForUploaded).join("\n") + footer;
          file.push({ blob: new Blob([output.buffer]), name: `${name}.log` });
        } else {
          content += header + outputString + footer;
        }
      }
    }
    return file.length > 0 ? { content, file } : { content };
  } catch (err) {
    Error.captureStackTrace(err, executeTarget);
    return {
      content: (outputCommandline ? "`" + commandline + "`\n" : "") + `${err}`,
    };
  }
}
