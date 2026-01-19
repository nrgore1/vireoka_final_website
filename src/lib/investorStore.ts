import Database from "better-sqlite3";
import { nanoid } from "nanoid";

export type InvestorStatus = "PENDING_NDA" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "EXPIRED";

export type InvestorRecord = {
  id: string;
  email: string;
  name: string;
  org: string;
  role: string;
  intent: string;
  status: InvestorStatus;
  ndaAcceptedAt: string | null;
  approvedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function nowIso() {
  return new Date().toISOString();
}

function getDbPath() {
  return process.env.INVESTOR_DB_PATH || ".data/investors.sqlite";
}

let _db: Database.Database | null = null;

function db() {
  if (_db) return _db;
  const path = getDbPath();
  // ensure parent dir exists
  const dir = path.split("/").slice(0, -1).join("/") || ".";
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("fs").mkdirSync(dir, { recursive: true });

  _db = new Database(path);
  _db.pragma("journal_mode = WAL");
  _db.exec(`
    CREATE TABLE IF NOT EXISTS investors (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      org TEXT NOT NULL,
      role TEXT NOT NULL,
      intent TEXT NOT NULL,
      status TEXT NOT NULL,
      ndaAcceptedAt TEXT,
      approvedAt TEXT,
      expiresAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_investors_status ON investors(status);
  `);
  return _db;
}

export function createOrGetInvestor(input: {
  email: string;
  name: string;
  org: string;
  role: string;
  intent: string;
}): InvestorRecord {
  const d = db();
  const existing = d
    .prepare("SELECT * FROM investors WHERE email = ?")
    .get(input.email) as InvestorRecord | undefined;

  if (existing) return existing;

  const id = nanoid();
  const ts = nowIso();

  const rec: InvestorRecord = {
    id,
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    org: input.org.trim(),
    role: input.role.trim(),
    intent: input.intent.trim(),
    status: "PENDING_NDA",
    ndaAcceptedAt: null,
    approvedAt: null,
    expiresAt: null,
    createdAt: ts,
    updatedAt: ts,
  };

  d.prepare(`
    INSERT INTO investors (id,email,name,org,role,intent,status,ndaAcceptedAt,approvedAt,expiresAt,createdAt,updatedAt)
    VALUES (@id,@email,@name,@org,@role,@intent,@status,@ndaAcceptedAt,@approvedAt,@expiresAt,@createdAt,@updatedAt)
  `).run(rec);

  return rec;
}

export function getInvestorByEmail(email: string): InvestorRecord | null {
  const d = db();
  const rec = d.prepare("SELECT * FROM investors WHERE email = ?").get(email.trim().toLowerCase()) as InvestorRecord | undefined;
  return rec || null;
}

export function getInvestorById(id: string): InvestorRecord | null {
  const d = db();
  const rec = d.prepare("SELECT * FROM investors WHERE id = ?").get(id) as InvestorRecord | undefined;
  return rec || null;
}

export function acceptNda(email: string): InvestorRecord {
  const d = db();
  const rec = getInvestorByEmail(email);
  if (!rec) throw new Error("Investor not found");

  // If already beyond NDA stage, keep status as-is.
  const nextStatus: InvestorStatus =
    rec.status === "PENDING_NDA" ? "PENDING_APPROVAL" : rec.status;

  const ts = nowIso();
  d.prepare(`
    UPDATE investors
    SET ndaAcceptedAt = COALESCE(ndaAcceptedAt, ?),
        status = ?,
        updatedAt = ?
    WHERE email = ?
  `).run(ts, nextStatus, ts, email.trim().toLowerCase());

  return getInvestorByEmail(email)!;
}

export function approveInvestor(email: string, ttlDays: number): InvestorRecord {
  const d = db();
  const rec = getInvestorByEmail(email);
  if (!rec) throw new Error("Investor not found");

  if (rec.status === "PENDING_NDA") {
    throw new Error("NDA not accepted yet");
  }

  const ts = nowIso();
  const expires = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();

  d.prepare(`
    UPDATE investors
    SET status = 'APPROVED',
        approvedAt = ?,
        expiresAt = ?,
        updatedAt = ?
    WHERE email = ?
  `).run(ts, expires, ts, email.trim().toLowerCase());

  return getInvestorByEmail(email)!;
}

export function rejectInvestor(email: string): InvestorRecord {
  const d = db();
  const rec = getInvestorByEmail(email);
  if (!rec) throw new Error("Investor not found");

  const ts = nowIso();
  d.prepare(`
    UPDATE investors
    SET status = 'REJECTED',
        updatedAt = ?
    WHERE email = ?
  `).run(ts, email.trim().toLowerCase());

  return getInvestorByEmail(email)!;
}

export function expireIfNeeded(email: string): InvestorRecord {
  const d = db();
  const rec = getInvestorByEmail(email);
  if (!rec) throw new Error("Investor not found");

  if (rec.status === "APPROVED" && rec.expiresAt) {
    const exp = new Date(rec.expiresAt).getTime();
    if (Date.now() > exp) {
      const ts = nowIso();
      d.prepare(`
        UPDATE investors
        SET status = 'EXPIRED',
            updatedAt = ?
        WHERE email = ?
      `).run(ts, email.trim().toLowerCase());
    }
  }

  return getInvestorByEmail(email)!;
}

export function listInvestors(): InvestorRecord[] {
  const d = db();
  const rows = d.prepare("SELECT * FROM investors ORDER BY createdAt DESC").all() as InvestorRecord[];
  return rows;
}
