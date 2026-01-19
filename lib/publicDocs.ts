import { promises as fs } from "fs";

export async function readPublicDoc(path: string): Promise<string> {
  // Public docs only. Do NOT use this for NDA-gated docs.
  return await fs.readFile(path, "utf8");
}
