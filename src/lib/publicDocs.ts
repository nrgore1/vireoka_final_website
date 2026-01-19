import fs from "fs";
import path from "path";

/**
 * Reads a markdown file from the public docs directory.
 * Safe for server components only.
 */
export async function readPublicDoc(relativePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), "public", relativePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Public document not found: ${relativePath}`);
  }

  return fs.readFileSync(fullPath, "utf8");
}
