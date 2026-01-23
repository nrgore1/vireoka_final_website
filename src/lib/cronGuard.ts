import "server-only";

function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function requireCron(req: Request) {
  // Use a header token so you can call cron endpoints safely.
  const secret = mustGet("CRON_SECRET");
  const got = req.headers.get("x-cron-secret");
  if (!got || got !== secret) {
    throw new Error("Unauthorized cron");
  }
}
