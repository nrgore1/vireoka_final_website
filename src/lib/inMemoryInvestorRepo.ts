import { InvestorRepository } from "./investorRepository";

export const inMemoryRepo: InvestorRepository = {
  async getByEmail() { return null; },
  async save() {},
  async list() { return []; },
  async audit() {},
};
