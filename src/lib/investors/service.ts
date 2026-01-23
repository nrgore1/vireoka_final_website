import "server-only";

import { investorRepo } from "./repository";

export async function getInvestorByEmail(email: string) {
  return investorRepo().getByEmail(email);
}

export async function listInvestors() {
  return investorRepo().list();
}

export async function approveInvestor(email: string) {
  await investorRepo().setStatus(email, "approved");
  return true;
}

export async function rejectInvestor(email: string) {
  await investorRepo().setStatus(email, "rejected");
  return true;
}

export async function revokeInvestor(email: string) {
  await investorRepo().setStatus(email, "revoked");
  return true;
}

export async function expireInvestor(email: string) {
  await investorRepo().setStatus(email, "expired");
  return true;
}

export async function createPendingInvestor(email: string) {
  await investorRepo().upsertPending(email);
  return true;
}

export async function touchInvestor(email: string) {
  await investorRepo().setLastAccess(email);
}
