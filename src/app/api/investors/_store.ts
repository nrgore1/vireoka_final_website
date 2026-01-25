import fs from "node:fs/promises";
import path from "node:path";

export type InvestorRequest = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  firm?: string;
  title?: string;
  notes?: string;
  status: "submitted" | "nda_sent" | "nda_accepted" | "approved" | "rejected";
  invitationCode?: string;
};

const STORE_PATH = path.join(process.cwd(), ".tmp", "vk-investors.json");

async function ensureDir() {
  const dir = path.dirname(STORE_PATH);
  await fs.mkdir(dir, { recursive: true });
}

export async function readAll(): Promise<InvestorRequest[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as InvestorRequest[];
  } catch {
    return [];
  }
}

export async function writeAll(items: InvestorRequest[]) {
  await ensureDir();
  await fs.writeFile(STORE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export function makeId() {
  return `req_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function makeInvitationCode() {
  return `VK-INV-${Math.random().toString(36).toUpperCase().slice(2, 8)}`;
}
