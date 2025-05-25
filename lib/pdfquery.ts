import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile);

/** Build FAISS index, returns slug */
export async function buildIndex(pdfPath: string) {
  const slug = crypto.randomUUID();
  await exec("pdfquery", ["index", "--source", pdfPath, "--name", slug]);
  return slug;
}

/** Ask a question */
export async function ask(slug: string, question: string) {
  const { stdout } = await exec("pdfquery", ["query", "--name", slug, question]);
  return stdout.trim();
}
