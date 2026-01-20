export function requireCron(req: Request) {
  const token = req.headers.get("x-cron-token");
  if (!token || token !== process.env.CRON_TOKEN) {
    throw new Error("Unauthorized");
  }
}
