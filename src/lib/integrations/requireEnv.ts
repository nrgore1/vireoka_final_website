export function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export function envOr(name: string, fallback: string) {
  return process.env[name] || fallback;
}
