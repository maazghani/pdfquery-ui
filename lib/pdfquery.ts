// lib/pdfquery.ts

import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile);

// Absolute path to the pdfquery CLI inside the Docker container
const CLI_PATH = "/usr/local/bin/pdfquery"; // Adjust if different

/** Build a FAISS index for the given PDF, returns slug */
export async function buildIndex(pdfPath: string, key: string): Promise<string> {
  const slug = crypto.randomUUID();
  const args = [
    "index",
    "--source", pdfPath,
    "--name", slug,
    "--key", key
  ];

  await exec(CLI_PATH, args);
  return slug;
}

/** Ask a question using the indexed chunks */
export async function ask(slug: string, question: string, key: string): Promise<string> {
  const args = [
    "query",
    "--name", slug,
    "--key", key,
    question
  ];

  const { stdout } = await exec(CLI_PATH, args);
  return stdout.trim();
}