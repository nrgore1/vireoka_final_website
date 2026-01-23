import "server-only";

import { investorRepo } from "./repository";
import type { InvestorEvent } from "./types";

export async function recordInvestorEvent(ev: InvestorEvent) {
  const repo = investorRepo();
  await repo.recordEvent(ev);
}

export async function listInvestorEvents(limit = 500) {
  const repo = investorRepo();
  return repo.listEvents(limit);
}
